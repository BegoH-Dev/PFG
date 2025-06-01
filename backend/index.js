require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('Error: JWT_SECRET no está definido en las variables de entorno');
  process.exit(1);
}

const port = process.env.PORT || 5000;


// ENDPOINTS

app.get('/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos');
    res.json({
      mensaje: 'Lista de productos',
      productos: result.rows
    });  
  } catch (err) {
    console.error('Error al obtener los productos:', err.message);
    res.status(500).json({ error: err.message });
  }
});


app.post('/pedidos', async (req, res) => {
  const { usuario_id, total, estado, fecha } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO pedidos (usuario_id, total, estado, fecha) VALUES ($1, $2, $3, $4) RETURNING *',
      [usuario_id, total, estado, fecha]
    );
    res.status(201).json({
      mensaje: 'Pedido creado con éxito',
      reserva: result.rows[0]
    });
  } catch (err) {
    console.error('Error al crear el pedido:', err.message);
    res.status(500).json({ error: err.message });
  }
});


app.get('/productos/alergenos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id AS producto_id, p.nombre AS producto_nombre, STRING_AGG(a.nombre, ', ') AS alergenos
      FROM productos p
      LEFT JOIN producto_alergenos pa ON p.id = pa.producto_id
      LEFT JOIN alergenos a ON pa.alergeno_id = a.id
      GROUP BY p.id, p.nombre
      ORDER BY p.id;
    `);
    res.json({
      mensaje: 'Lista de productos con sus alérgenos',
      productos: result.rows
    });
  } catch (error) {
    console.error('Error al obtener productos:', err.message);
    res.status(500).json({ error: err.message });
  }
});


app.post('/reservas', async (req, res) => {
  const { usuario_id, mesa_id, fecha_hora, num_comensales, estado } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO reservas (usuario_id, mesa_id, fecha_hora, num_comensales, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [usuario_id, mesa_id, fecha_hora, num_comensales, estado]
    );
    res.status(201).json({
      mensaje: 'Reserva creada con éxito',
      reserva: result.rows[0]
    });
  } catch (err) {
    console.error('Error al crear la reserva:', err.message);
    res.status(500).json({ error: err.message });
  }
});


app.get('/admin/pedidos', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pedidos ORDER BY fecha DESC');
      res.json({
        mensaje: 'Lista de pedidos',
        productos: result.rows
      });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener los pedidos');
  }
});


app.get('/admin/reservas', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reservas ORDER BY fecha_hora DESC');
    res.json({
      mensaje: 'Lista de reservas',
      productos: result.rows
    });  
  } catch (err) {
    console.error('Error en /admin/reservas:', err);
    res.status(500).send('Error al obtener las reservas');
  }
});


app.get('/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT p.id, p.nombre, STRING_AGG(a.nombre, ', ') AS alergenos
      FROM productos p
      LEFT JOIN producto_alergenos pa ON p.id = pa.producto_id
      LEFT JOIN alergenos a ON a.id = pa.alergeno_id
      WHERE p.id = $1
      GROUP BY p.id, p.nombre;
    `, [id]);

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({
      mensaje: 'Detalles del producto',
      producto: result.rows[0]
    });  
  
  } catch (err) {
    console.error('Error al obtener el producto por ID:', err.message);
    res.status(500).json({ error: err.message });
  }
});


app.post('/usuarios', async (req, res) => {
  const { nombre, apellidos, email, telefono, direccion, contraseña, rol } = req.body;
  
  if (!nombre || !apellidos || !email || !contraseña) {
    return res.status(400).json({ message: "Faltan campos requeridos" });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const result = await pool.query(
      `INSERT INTO usuarios 
      (nombre, apellidos, email, telefono, direccion, contraseña, rol) 
      VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 'cliente')) RETURNING *`,
      [nombre, apellidos, email, telefono, direccion, hashedPassword, rol]
    );
    const { id } = result.rows[0];
    res.status(201).json({ 
      message: 'Usuario creado con éxito', 
      user: { id, email } 
    });
  } catch (err) {
    console.error('Error al crear usuario:', err.message);
    res.status(500).json({ error: err.message });
  }
});


app.get('/usuarios/:id/pedidos', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM pedidos WHERE usuario_id = $1 ORDER BY fecha DESC',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener los pedidos:', err.message);
    res.status(500).json({ error: err.message });
  }
});


app.get('/reservas', async (req, res) => {
  const { fecha } = req.query;

  let query;
  let params = [];

  if (fecha) {
    query = `SELECT * FROM reservas WHERE DATE(fecha_hora) = $1 ORDER BY fecha_hora`;
    params = [fecha];
  } else {
    query = `SELECT * FROM reservas WHERE fecha_hora >= CURRENT_DATE ORDER BY fecha_hora`;
  }

  try {
    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }

    res.json({
      mensaje: 'Lista de reservas',
      productos: result.rows
    });  
  } catch (err) {
    console.error('Error al obtener las reservas:', err.message);
    res.status(500).json({ error: err.message });
  }
});


app.put('/reservas/:id', async (req, res) => {
  const { id } = req.params;
  const { fecha, estado } = req.body;
  try {
    const result = await pool.query(
      `UPDATE reservas 
       SET fecha_hora = COALESCE($1, fecha_hora), estado = COALESCE($2, estado) 
       WHERE id = $3 
       RETURNING *`,
      [fecha, estado, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }

    res.json({
      mensaje: 'Reserva actualizada',
      reserva: result.rows[0]
    });    
  } catch (err) {
    console.error('Error al modificar reserva:', err.message);
    res.status(500).json({ error: err.message });
  }
});


app.get('/alergenos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alergenos');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener alérgenos:', err.message);
    res.status(500).json({ error: err.message });
  }
});


app.get('/productos/:id/alergenos', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT a.nombre FROM producto_alergenos pa
       JOIN alergenos a ON a.id = pa.alergeno_id
       WHERE pa.producto_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado o sin alérgenos' });
    }

    res.json({
      mensaje: 'Lista de alérgenos del producto',
      alergenos: result.rows.map(row => row.nombre)
    });

  } catch (err) {
    console.error('Error al obtener alérgenos del producto:', err.message);
    res.status(500).json({ error: err.message });
  }
});


app.get('/valoraciones/:producto_id', async (req, res) => {
  const { producto_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM valoraciones WHERE producto_id = $1 ORDER BY fecha DESC',
      [producto_id]
    );
    res.json({
      mensaje: 'Lista de valoraciones',
      productos: result.rows
    });  
  } catch (err) {
    console.error('Error al obtener valoraciones:', err.message);
    res.status(500).json({ error: err.message });
  }
});


app.post('/auth/register', async (req, res) => {
  const { nombre, apellidos, nombre_usuario, email, contraseña, acepta_terminos, fecha_nacimiento } = req.body;

  if (!nombre || !apellidos || !email || !contraseña) {
    return res.status(400).json({ message: "Faltan campos requeridos" });
  }

  if (!acepta_terminos) {
    return res.status(400).json({ error: 'Debes aceptar los términos y condiciones' });
  }

  if (!fecha_nacimiento) {
    return res.status(400).json({ error: 'La fecha de nacimiento es obligatoria' });
  }

  const existe = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
  if (existe.rows.length > 0) {
    return res.status(401).json({ message: 'Ya existe un usuario con ese email' });
  }

  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, apellidos, nombre_usuario, email, contraseña, rol, acepta_terminos, fecha_nacimiento) 
      VALUES ($1, $2, $3, $4, $5, 'cliente', $6, $7) RETURNING *`,
      [nombre, apellidos, nombre_usuario, email, hashedPassword, acepta_terminos, fecha_nacimiento]
    );
    const { id } = result.rows[0];
    res.status(201).json({ 
      message: "Registrado con éxito", 
      user: { id, email } 
    });
  } catch (err) {
    console.error('Error en registro:', err.message);
    res.status(500).json({ error: err.message });
  }
});


app.post('/auth/login', async (req, res) => {
  console.log('Intentando login:', req.body);

  const { nombre_usuario, contraseña } = req.body;

    if (!nombre_usuario || !contraseña) {
      return res.status(400).json({ error: 'Nombre de usuario y contraseña requeridos' });
    } 

    try {
      const result = await pool.query(
        'SELECT * FROM usuarios WHERE nombre_usuario = $1',
        [nombre_usuario]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Usuario no encontrado' });
      }

      const user = result.rows[0];
      
      const passwordMatch = await bcrypt.compare(contraseña, user.contraseña);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Contraseña no válida o usuario no encontrado' });
      }

      const token = jwt.sign(
        { userId: user.id, 
          email: user.email, 
          rol: user.rol },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      res.json({ 
        message: "Inicio de sesión exitoso", 
        token,
        user: {
          id: user.id,
          nombre_usuario: user.nombre_usuario,
          rol: user.rol
        }
       });

    } catch (error) {
      console.error('Error en /auth/login:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
});


app.delete('/usuarios/:id', verificarToken, verificarAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json({ mensaje: 'Usuario eliminado', usuario: result.rows[0] });
  } catch (err) {
    console.error('Error al eliminar usuario:', err.message);
    res.status(500).json({ error: err.message });
  }
});


app.delete('/eliminar-cuenta', verificarToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      'DELETE FROM usuarios WHERE id = $1 RETURNING *',
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Tu cuenta ha sido eliminada', usuario: result.rows[0] });
  } catch (err) {
    console.error('Error al eliminar tu cuenta:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Middleware para verificar si es admin
function verificarAdmin(req, res, next) {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso restringido a administradores' });
  }
  next();
}

// Middleware "verificarToken" que valida el token en rutas protegidas.
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensaje: 'Requiere token' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ mensaje: 'Token inválido o expirado' });
    }
    req.user = user;
    next();
  });
}

// Ruta protegida "/perfil" que solo se accede con token válido.
app.get('/perfil', verificarToken, (req, res) => {
  res.json({ mensaje: 'Ruta protegida', user: req.user });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});

