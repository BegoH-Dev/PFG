require('dotenv').config();
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
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

// Usa la ruta corregida
app.use('/api', authRoutes);

app.listen(5000, () => { 
  console.log('Server is running on port 5000'); 
});