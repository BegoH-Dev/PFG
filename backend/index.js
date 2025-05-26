require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
app.use(express.json());

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

const port = process.env.PORT || 3000;


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
 */

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
 *         description: Pedido creado exitosamente
 */

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
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos' });
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
 *         description: Reserva creada exitosamente
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
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error detalle:', err);
    res.status(500).send('Error al crear la reserva');
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
 *       403:
 *         description: Acceso restringido
 */

app.get('/admin/pedidos', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pedidos ORDER BY fecha DESC');
    res.json(result.rows);
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
 */

app.get('/admin/reservas', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reservas ORDER BY fecha_hora DESC');
    res.json(result.rows);
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

    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).send('Error al obtener producto');
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
 *         description: Usuario creado exitosamente
 *       500:
 *         description: Error al crear usuario
 */

app.post('/usuarios', async (req, res) => {
  const { nombre, apellidos, email, telefono, direccion, contraseña, rol } = req.body;
  
  if (!nombre || !apellidos || !email || !contraseña) {
    return res.status(400).json({ message: "Faltan campos requeridos" });
  }
  
  try {
    // Hashear la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(contraseña, 10); // 10 es el "salt rounds"

    const result = await pool.query(
      `INSERT INTO usuarios 
      (nombre, apellidos, email, telefono, direccion, contraseña, rol) 
      VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 'cliente')) RETURNING *`,
      [nombre, apellidos, email, telefono, direccion, hashedPassword, rol]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(500).send('Error al crear usuario');
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
    res.status(500).send('Error al obtener pedidos');
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
 *       500:
 *         description: Error al obtener reservas
 */

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
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al modificar reserva');
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
 */

app.get('/alergenos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alergenos');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Error al obtener alérgenos');
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
    res.json(result.rows.map(row => row.nombre));
  } catch (err) {
    res.status(500).send('Error al obtener alérgenos del producto');
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
 *       200:
 *         description: Lista de valoraciones
 */

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
 *         description: Usuario registrado exitosamente
 *       500:
 *         description: Error en el servidor
 */

app.post('/auth/register', async (req, res) => {
  const { nombre, apellidos, email, contraseña } = req.body;

  if (!nombre || !apellidos || !email || !contraseña) {
    return res.status(400).json({ message: "Faltan campos requeridos" });
  }

  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, apellidos, email, contraseña, rol) VALUES ($1, $2, $3, $4) RETURNING *',
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
 *         description: Credenciales inválidas
 */

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
 *         description: Usuario eliminado correctamente
 *       403:
 *         description: Acceso no autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
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
    console.error(err);
    res.status(500).send('Error al eliminar usuario');
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
 *         description: Cuenta eliminada exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al eliminar la cuenta
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

