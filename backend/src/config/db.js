// IMPORTAR POOL DE PG PARA MANEJAR CONEXIONES A POSTGRESQL
const { Pool } = require('pg');

// CREAR UN POOL DE CONEXIONES
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

// EVENTO PARA CUANDO SE ESTABLECE UNA CONEXIÓN EXITOSA
pool.on('connect', () => {
  console.log('Conectado a la base de datos');
});

// EVENTO PARA CUANDO OCURRE UN ERROR EN LA CONEXIÓN
pool.on('error', (err) => {
  console.error('Error en la conexión a la base de datos:', err);
});

// EXPORTAR EL POOL
module.exports = pool;
