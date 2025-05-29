const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { Pool } = require('pg');
const pool = new Pool({ 
    user: 'admin',
    host: 'localhost',
    database: 'restaurante_db',
    password: 'admin',
    port: 5432,
});

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

    // Validación básica
    if (!aceptaTerminos) {
      return res.status(400).json({ error: 'Debes aceptar los términos y condiciones' });
    }

    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Inserta en la base de datos
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

module.exports = router;