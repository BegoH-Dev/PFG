const express = require('express'); 
const bodyParser = require('body-parser'); 
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const authRoutes = require('./routes/auth'); // Importa la ruta corregida

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000' })); // Permite el frontend

// Conexión a PostgreSQL 
const pool = new Pool({
  user: 'admin', 
  host: 'localhost', 
  database: 'restaurante_db', 
  password: 'admin', 
  port: 5432,
});

// Usa la ruta corregida
app.use('/api', authRoutes);

app.post('/api/register', async (req, res) => { 
  const { nombre, apellidos, nombreUsuario, email, fechaNacimiento, contraseña } = req.body;

  try { 
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const result = await pool.query(
      'INSERT INTO usuarios (nombre, apellidos, nombreUsuario, email, fechaNacimiento, contraseña, fecha_registro, rol) VALUES ($1, $2, $3, $4, DEFAULT, DEFAULT) RETURNING *', 
      [nombre, apellidos, email, hashedPassword]
    );

    res.status(201).send('Usuario registrado con éxito'); 
  } catch (error) { 
    console.error('Error al registrar el usuario:', error); 
    res.status(400).send('Error al registrar el usuario'); 
  } 
});

app.listen(5000, () => { 
  console.log('Server is running on port 5000'); 
});