const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

// Hacer disponible la conexión para las rutas
app.locals.db = pool;

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('Error: JWT_SECRET no está definido en las variables de entorno');
  process.exit(1);
}

const port = process.env.PORT || 5000;


// *ENDPOINTS*
// GET
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


app.get('/pedidos/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        json_agg(
          json_build_object(
            'producto_id', dp.producto_id,
            'cantidad', dp.cantidad,
            'precio_unitario', dp.precio_unitario,
            'nombre', pr.nombre
          )
        ) as productos
      FROM pedidos p
      LEFT JOIN detalles_pedido dp ON p.id = dp.pedido_id
      LEFT JOIN productos pr ON dp.producto_id = pr.id
      WHERE p.usuario_id = $1
      GROUP BY p.id
      ORDER BY p.fecha DESC
    `, [usuario_id]);

    res.json({
      mensaje: 'Pedidos del usuario',
      pedidos: result.rows
    });
  } catch (err) {
    console.error('Error al obtener pedidos:', err.message);
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


// (Solo para administradores) 
app.get('/usuarios', verificarToken, verificarAdmin, async (req, res) => { 
  try { 
    const result = await pool.query (      
      `SELECT id, nombre, apellidos, email, telefono, direccion, rol, fecha_registro       
      FROM usuarios       
      ORDER BY fecha_registro DESC`   
    );
  } catch (err) { 
    console.error('Error al obtener usuarios:', err.message); 
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    }); 
  }
});


// OBTENER LAS SUSCRIPCIONES (PARA ADMIN)
app.get('/api/suscripciones', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const query = `
      SELECT id, email, fecha_suscripcion 
      FROM suscripciones 
      ORDER BY fecha_suscripcion DESC 
      LIMIT $1 OFFSET $2
    `;
    
    const countQuery = 'SELECT COUNT(*) FROM suscripciones';
    
    const [subscriptions, totalCount] = await Promise.all([
      pool.query(query, [limit, offset]),
      pool.query(countQuery)
    ]);

    res.json({
      success: true,
      data: subscriptions.rows,
      pagination: {
        total: parseInt(totalCount.rows[0].count),
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalCount.rows[0].count / limit)
      }
    });

  } catch (error) {
    console.error('Error al obtener suscripciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});


// POST
app.post('/pedidos', async (req, res) => {
  const { 
    usuario_id, productos, total, direccion, notas, metodoPago, datosEntrega 
  } = req.body;  
  
  if (!usuario_id || !productos || !total) {
    return res.status(400).json({ 
      error: 'Faltan campos requeridos: usuario_id, productos, total' 
    });
  }

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Crear el pedido principal
    const pedidoResult = await client.query(
      `INSERT INTO pedidos 
       (usuario_id, total, estado, direccion_entrega, metodo_pago, notas, datos_entrega) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        usuario_id, 
        parseFloat(total), 
        'pendiente', 
        direccion, 
        metodoPago, 
        notas || null,
        JSON.stringify(datosEntrega) // Guardar como JSON
      ]
    );

    const pedidoId = pedidoResult.rows[0].id;

    // Insertar los detalles del pedido
    for (const producto of productos) {
      await client.query(
        `INSERT INTO detalles_pedido 
         (pedido_id, producto_id, cantidad, precio_unitario) 
         VALUES ($1, $2, $3, $4)`,
        [
          pedidoId,
          producto.id || null, // Si no tienes ID del producto, podrías usar null
          producto.cantidad || 1,
          parseFloat(producto.precio?.toString().replace(',', '.') || '0')
        ]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      mensaje: 'Pedido creado con éxito',
      pedido: {
        ...pedidoResult.rows[0],
        productos: productos
      }
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error al crear el pedido:', err.message);
    res.status(500).json({ error: 'Error al procesar el pedido: ' + err.message });
  } finally {
    client.release();
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


app.post('/usuarios/:id/pedidos', async (req, res) => {
  console.log('Datos recibidos:', req.body);
  const { id } = req.params;
  const {
    productos,
    total,
    estado,
    direccion,
    metodoPago,
    notas,
    datosEntrega
  } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const pedidoResult = await client.query(
      `INSERT INTO pedidos (usuario_id, total, estado, direccion_entrega, metodo_pago, notas, datos_entrega)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [id, total, estado, direccion, metodoPago, notas, datosEntrega]
    );

    const pedidoId = pedidoResult.rows[0].id;

    for (const prod of productos) {
      await client.query(
        `INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4)`,
        [pedidoId, prod.id, prod.cantidad, prod.precio]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ mensaje: 'Pedido guardado correctamente', pedidoId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error al guardar pedido:', err.message);
    res.status(500).json({ error: 'No se pudo guardar el pedido' });
  } finally {
    client.release();
  }
});


// SUSCRIPCIONES
app.post('/api/suscripciones', async (req, res) => {
  try {
    console.log('Recibida petición de suscripción:', req.body);
    
    const { email } = req.body;

    // Validaciones
    if (!email) {
      console.log('Error: Email no proporcionado');
      return res.status(400).json({
        success: false,
        message: 'El email es requerido'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Error: Formato de email inválido:', email);
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }

    // Verificar conexión a la base de datos
    console.log('Verificando conexión a la base de datos...');
    await pool.query('SELECT 1');

    // Verificar si el email ya existe
    console.log('Verificando si el email ya existe...');
    const checkQuery = 'SELECT id FROM suscripciones WHERE email = $1';
    const existingSubscription = await pool.query(checkQuery, [email]);

    if (existingSubscription.rows.length > 0) {
      console.log('Email ya existe:', email);
      return res.status(409).json({
        success: false,
        message: 'Este email ya está suscrito'
      });
    }

    // Insertar nueva suscripción
    console.log('Insertando nueva suscripción...');
    const insertQuery = `
      INSERT INTO suscripciones (email, fecha_suscripcion) 
      VALUES ($1, CURRENT_TIMESTAMP) 
      RETURNING id, email, fecha_suscripcion
    `;
    
    const result = await pool.query(insertQuery, [email]);
    const newSubscription = result.rows[0];

    console.log('Suscripción creada exitosamente:', newSubscription);

    res.status(201).json({
      success: true,
      message: 'Suscripción exitosa',
      data: {
        id: newSubscription.id,
        email: newSubscription.email,
        fecha_suscripcion: newSubscription.fecha_suscripcion
      }
    });

  } catch (error) {
    console.error('Error detallado al crear suscripción:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Este email ya está suscrito'
      });
    }

    // Error de conexión a la base de datos
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(503).json({
        success: false,
        message: 'Problema de conexión con la base de datos'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


// REGISTRO
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
      VALUES ($1, $2, $3, $4, $5, 'cliente', $6, $7) RETURNING id, email, nombre_usuario, rol`,
      [nombre, apellidos, nombre_usuario, email, hashedPassword, acepta_terminos, fecha_nacimiento]
    );

    const user = result.rows[0];
    res.status(201).json({ 
      message: "Registrado con éxito", 
      user 
    });
  } catch (err) {
    console.error('Error en registro:', err.message);
    res.status(500).json({ error: err.message });
  }
});


// INICIO SESIÓN
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


// PUT
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

// Actualizar datos de usuario
app.put('/api/users/update', verificarToken, async (req, res) => {
  const userId = req.user.userId;
  const { nombre, email, telefono, direccion } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({ error: 'Nombre y email son obligatorios' });
  }

  try {
    const result = await pool.query(
      `UPDATE usuarios 
       SET nombre = $1, email = $2, telefono = $3, direccion = $4
       WHERE id = $5
       RETURNING id, nombre, email, telefono, direccion`,
      [nombre, email, telefono, direccion, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ 
      message: 'Datos actualizados correctamente',
      usuario: result.rows[0]
    });
  } catch (err) {
    console.error('Error al actualizar usuario:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// DELETE
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


// ELIMINAR SUSCRIPCIÓN
app.delete('/api/suscripciones/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const deleteQuery = 'DELETE FROM suscripciones WHERE email = $1 RETURNING *';
    const result = await pool.query(deleteQuery, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Email no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Suscripción eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar suscripción:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
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

