// Carga variables de entorno desde archivo .env
require('dotenv').config();
// Importa dependencias necesarias
const express = require('express'); 
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const authRoutes = require('./routes/auth');

// Crea instancia de la aplicación Express
const app = express();
// Middleware para parsear JSON en el cuerpo de las peticiones
app.use(bodyParser.json());
// Habilita CORS solo para el frontend en localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));

// Configuración del pool de conexiones a PostgreSQL usando variables de entorno
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST, 
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

// Monta las rutas de autenticación bajo el prefijo '/api'
app.use('/api', authRoutes);

// Inicia el servidor en el puerto 5000
app.listen(5000, () => { 
  console.log('Server is running on port 5000'); 
});