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
  user: 'postgres', 
  host: 'localhost', 
  database: 'restaurante_db', 
  password: 'postgres', 
  port: 5432,
});

// Usa la ruta corregida
app.use('/api', authRoutes);

app.listen(5000, () => { 
  console.log('Server is running on port 5000'); 
});