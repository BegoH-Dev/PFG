// Carga variables de entorno desde archivo .env
require('dotenv').config();
// Importa dependencias necesarias
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { Pool } = require('pg');

// Configura conexión a base de datos con variables de entorno
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

// Ruta POST para registro de nuevos usuarios
router.post('/register', async (req, res) => {
  try {
    const {
      nombre,
      apellidos,
      nombre_usuario,
      email,
      fecha_nacimiento,
      contraseña,
      acepta_terminos
    } = req.body;

    if (!acepta_terminos) {
      return res.status(400).json({ error: 'Debes aceptar los términos y condiciones' });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const query = `
      INSERT INTO usuarios 
      (nombre, apellidos, nombre_usuario, email, fecha_nacimiento, contraseña, acepta_terminos)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [
      nombre,
      apellidos,
      nombre_usuario,
      email,
      fecha_nacimiento,
      hashedPassword,
      acepta_terminos
    ];

    const result = await pool.query(query, values);
    res.status(201).json({ message: 'Usuario registrado con éxito', user: result.rows[0] });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

// Importa JWT para autenticación
const jwt = require('jsonwebtoken');
// Obtiene clave secreta para firmar tokens
const JWT_SECRET = process.env.JWT_SECRET;

// Ruta POST para inicio de sesión
router.post('/login', async (req, res) => {
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
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, rol: user.rol },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        nombre_usuario: user.nombre_usuario,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Exporta el router para usar en la aplicación principal
module.exports = router;