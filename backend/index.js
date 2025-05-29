require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

// GET /productos: obtener todos los productos
/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 *       500:
 *         description: Error al obtener los productos
 */

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


// POST /pedidos: hacer un nuevo pedido
/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Crear nuevo pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario_id:
 *                 type: integer
 *               total:
 *                 type: number
 *               estado:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Pedido creado con éxito
 * *     500:
 *         description: Error al crear el pedido
 */

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


// GET /productos/alergenos: muestra productos con sus alérgenos.
/**
 * @swagger
 * /productos/alergenos:
 *   get:
 *     summary: Obtener productos con sus alérgenos
 *     tags:
 *       - Productos
 *     responses:
 *       200:
 *         description: Lista de productos con sus alérgenos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   producto_id:
 *                     type: integer
 *                   producto_nombre:
 *                     type: string
 *                   alergenos:
 *                     type: string
 *       500:
 *         description: Error al obtener productos
 */

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


// POST /reservas: crea una nueva reserva
/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Crear una nueva reserva
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario_id:
 *                 type: integer
 *               mesa_id:
 *                 type: integer
 *               fecha_hora:
 *                 type: string
 *                 format: date-time
 *               num_comensales:
 *                 type: integer
 *               estado:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reserva creada con éxito
 *       500:
 *         description: Error al crear la reserva
 */

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


// GET /admin/pedidos: lista todos los pedidos (admin)
/**
 * @swagger
 * /admin/pedidos:
 *   get:
 *     summary: Obtener todos los pedidos (solo admin)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *       500:
 *         description: Error al obtener los pedidos
 */

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


// GET /admin/reservas: lista todas las reservas (admin)
/**
 * @swagger
 * /admin/reservas:
 *   get:
 *     summary: Obtener todas las reservas (solo admin)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas
 *       500:
 *         description: Error al obtener las reservas
 */

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


// GET /productos/:id: Producto por id con alérgenos
/**
 * @swagger
 * /productos/{id}:
 *   get:
 *     summary: Obtener un producto por ID (incluye alérgenos)
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Detalles del producto
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al obtener el producto
 */

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


// POST /usuarios: Crear usuario
/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellidos
 *               - email
 *               - telefono
 *               - direccion
 *               - contraseña
 *             properties:
 *               nombre:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               email:
 *                 type: string
 *               telefono:
 *                 type: string
 *               direccion:
 *                 type: string
 *               contraseña:
 *                 type: string
 *               rol:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado con éxito
 *       400:
 *         description: Faltan campos requeridos
 *       500:
 *         description: Error al crear usuario
 */

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


// GET /usuarios/:id/pedidos: Pedidos de un usuario
/**
 * @swagger
 * /usuarios/{id}/pedidos:
 *   get:
 *     summary: Obtener pedidos de un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *       500:
 *         description: Error al obtener los pedidos
 */

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


// GET /reservas: Listar reservas futuras o filtrar por fecha
/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Obtener reservas futuras o filtrar por fecha
 *     tags:
 *       - Reservas
 *     parameters:
 *       - in: query
 *         name: fecha
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha específica para filtrar reservas (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de reservas
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error al obtener las reservas
 */

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


// PUT /reservas/:id: Modificar estado o fecha de reserva
/**
 * @swagger
 * /reservas/{id}:
 *   put:
 *     summary: Modificar estado o fecha de una reserva
 *     tags:
 *       - Reservas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva a modificar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date-time
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reserva actualizada
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error al modificar reserva
 */

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


// GET /alergenos: Listar alérgenos
/**
 * @swagger
 * /alergenos:
 *   get:
 *     summary: Listar todos los alérgenos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de alérgenos
 *      500:
 *        description: Error al obtener alérgenos
 */

app.get('/alergenos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alergenos');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener alérgenos:', err.message);
    res.status(500).json({ error: err.message });
  }
});


// GET /productos/:id/alergenos: Alérgenos de producto
/**
 * @swagger
 * /productos/{id}/alergenos:
 *   get:
 *     summary: Obtener alérgenos de un producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Lista de alérgenos del producto
 *       404: 
 *        description: Producto no encontrado o sin alérgenos
 *       500:
 *        description: Error al obtener alérgenos del producto
 */

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


// GET /valoraciones/:producto_id: Valoraciones de producto
/**
 * @swagger
 * /valoraciones/{producto_id}:
 *   get:
 *     summary: Obtener valoraciones de un producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: producto_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *      200:
 *         description: Lista de valoraciones
 *      500:
 *         description: Error al obtener valoraciones
 */

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


// Registro
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               email:
 *                 type: string
 *               contraseña:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registrado con éxito
 *       400:
 *         description: Faltan campos requeridos
 *       401:
 *         description: Ya existe un usuario con ese email
 *       500:
 *         description: Error en registro
 */

app.post('/auth/register', async (req, res) => {
  const { nombre, apellidos, email, contraseña } = req.body;

  if (!nombre || !apellidos || !email || !contraseña) {
    return res.status(400).json({ message: "Faltan campos requeridos" });
  }

  const existe = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (existe.rows.length > 0) {
      return res.status(401).json({ message: 'Ya existe un usuario con ese email' });
    }

  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, apellidos, email, contraseña, rol) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, apellidos, email, hashedPassword, 'cliente']
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


// Login
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               contraseña:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Contraseña no válida o usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */

app.post('/auth/login', async (req, res) => {
  const { email, contraseña } = req.body;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Contraseña no válida o usuario no encontrado' });
    }
    
    const passwordMatch = await bcrypt.compare(contraseña, user.contraseña);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña no válida o usuario no encontrado' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email, rol: user.rol }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ message: "Inicio de sesión exitoso", token });
  } catch (err) {
    console.error('Error en login:', err.message);
    res.status(500).json({ error: 'Error en el servidor' });  
  }
});


// DELETE /usuarios/:id: elimina un usuario por ID (sólo administradores)
/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario por ID (solo administradores)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al eliminar usuario
 */

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


// DELETE /eliminar-cuenta: para que el propio usuario borre su cuenta
/**
 * @swagger
 * /eliminar-cuenta:
 *   delete:
 *     summary: Eliminar tu propia cuenta
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tu cuenta ha sido eliminada
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al eliminar tu cuenta
 */

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

