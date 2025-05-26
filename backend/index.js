require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

const JWT_SECRET = process.env.JWT_SECRET;
const port = process.env.PORT || 3000;

// ENDPOINTS
// GET /productos: obtener todos los productos
app.get('/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en la base de datos');
  }
});

// POST /pedidos: hacer un nuevo pedido
app.post('/pedidos', async (req, res) => {
  const { usuario_id, total, estado, fecha } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO pedidos (usuario_id, total, estado, fecha) VALUES ($1, $2, $3, $4) RETURNING *',
      [usuario_id, total, estado, fecha]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al crear el pedido');
  }
});

// GET /productos/alergenos: muestra productos con sus alérgenos.
app.get('/productos/alergenos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id AS producto_id,
             p.nombre AS producto_nombre,
             STRING_AGG(a.nombre, ', ') AS alergenos
      FROM productos p
      LEFT JOIN producto_alergenos pa ON p.id = pa.producto_id
      LEFT JOIN alergenos a ON pa.alergeno_id = a.id
      GROUP BY p.id, p.nombre
      ORDER BY p.id;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// POST /reservas: crea una nueva reserva
app.post('/reservas', async (req, res) => {
  const { usuario_id, mesa_id, fecha_hora, num_comensales, estado } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO reservas (usuario_id, mesa_id, fecha_hora, num_comensales, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [usuario_id, mesa_id, fecha_hora, num_comensales, estado]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error detalle:', err);
    res.status(500).send('Error al crear la reserva');
  }
});

// GET /admin/pedidos: lista todos los pedidos (admin)
app.get('/admin/pedidos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pedidos ORDER BY fecha DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener los pedidos');
  }
});

// GET /admin/reservas: lista todas las reservas (admin)
app.get('/admin/reservas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reservas ORDER BY fecha_hora DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error en /admin/reservas:', err);
    res.status(500).send('Error al obtener las reservas');
  }
});

// GET /productos/:id: Producto por id con alérgenos
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
    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).send('Error al obtener producto');
  }
});

// POST /usuarios: Crear usuario
app.post('/usuarios', async (req, res) => {
  const { nombre, apellidos, email, telefono, direccion, contraseña, rol } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO usuarios 
      (nombre, apellidos, email, telefono, direccion, contraseña, rol) 
      VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 'cliente')) RETURNING *`,
      [nombre, apellidos, email, telefono, direccion, contraseña, rol]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al crear usuario');
  }
});

// GET /usuarios/:id/pedidos: Pedidos de un usuario
app.get('/usuarios/:id/pedidos', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM pedidos WHERE usuario_id = $1 ORDER BY fecha DESC',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Error al obtener pedidos');
  }
});

// GET /reservas: Listar reservas futuras o filtrar por fecha
app.get('/reservas', async (req, res) => {
  const { fecha } = req.query;
  try {
    const result = await pool.query(
      fecha
        ? `SELECT * FROM reservas WHERE DATE(fecha_hora) = $1 ORDER BY fecha_hora`
        : `SELECT * FROM reservas WHERE fecha_hora >= CURRENT_DATE ORDER BY fecha_hora`,
      fecha ? [fecha] : []
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Error al obtener reservas');
  }
});

// PUT /reservas/:id: Modificar estado o fecha de reserva
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
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al modificar reserva');
  }
});

// GET /alergenos: Listar alérgenos
app.get('/alergenos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alergenos');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Error al obtener alérgenos');
  }
});

// GET /productos/:id/alergenos: Alérgenos de producto
app.get('/productos/:id/alergenos', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT a.nombre FROM producto_alergenos pa
       JOIN alergenos a ON a.id = pa.alergeno_id
       WHERE pa.producto_id = $1`,
      [id]
    );
    res.json(result.rows.map(row => row.nombre));
  } catch (err) {
    res.status(500).send('Error al obtener alérgenos del producto');
  }
});

// GET /valoraciones/:producto_id: Valoraciones de producto
app.get('/valoraciones/:producto_id', async (req, res) => {
  const { producto_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM valoraciones WHERE producto_id = $1 ORDER BY fecha DESC',
      [producto_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Error al obtener valoraciones');
  }
});

// Registro
app.post('/auth/register', async (req, res) => {
  const { nombre, apellidos, email, contraseña } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, apellidos, email, contraseña) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, apellidos, email, hashedPassword]
    );
    res.status(201).json({ 
      message: "Registrado con éxito", 
      user: { id: result.rows[0].id, email } 
    });  
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).send('Error al registrar usuario');
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  const { email, contraseña } = req.body;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).send('Credenciales inválidas');

    const match = await bcrypt.compare(contraseña, user.contraseña);
    if (!match) return res.status(401).send('Credenciales inválidas');

    const token = jwt.sign({ userId: user.id, email: user.email, rol: user.rol }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ 
      message: "Inicio de sesión exitoso", 
      token 
    });
  } catch (err) {
    res.status(500).send('Error en el login');
  }
});

// DELETE /usuarios/:id: elimina un usuario por ID (sólo administradores)
app.delete('/usuarios/:id', verificarToken, verificarAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json({ mensaje: 'Usuario eliminado', usuario: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar usuario');
  }
});

// DELETE /eliminar-cuenta: para que el propio usuario borre su cuenta
app.delete('/eliminar-cuenta', verificarToken, async (req, res) => {
  const userId = req.user.userId; // del token

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
    console.error(err);
    res.status(500).json({ mensaje: 'Error al eliminar tu cuenta' });
  }
});

// Middleware para verificar si es admin
function verificarAdmin(req, res, next) {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso restringido a administradores' });
  }
  next();
}

app.get('/admin/pedidos', verificarToken, verificarAdmin, async (req, res) => {
  // solo entra si es admin
});


// Middleware "verificarToken" que valida el token en rutas protegidas.
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
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

