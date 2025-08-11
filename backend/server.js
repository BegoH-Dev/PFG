// CARGAR VARIABLES DE ENTORNO DESDE ARCHIVO '.ENV'
require('dotenv').config();
// IMPORTAR DEPENDENCIAS
const express = require('express'); 
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const authRoutes = require('./routes/auth');

// CREAR INSTACIA DE EXPRESS
const app = express();
// MIDDLEWARE PARA PARSEAR JSON EN LAS PETICIONES
app.use(bodyParser.json());
// HABILITAR CORS PARA FRONTEND EN LOCALHOST:3000
app.use(cors({ origin: 'http://localhost:3000' }));

// CONFIGURACIÓN DE CONEXIONES A POSTGRESQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST, 
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

// MONTAR RUTAS DE AUTENTICACIÓN CON '/api'
app.use('/api', authRoutes);

// INICIAR SERVIDOR EN PUERTO 5000
app.listen(5000, () => { 
  console.log('Corriendo en puerto 5000'); 
});
