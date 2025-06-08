// Importa la clase Pool de pg para manejar conexiones a PostgreSQL
const { Pool } = require('pg');

// Crea un pool de conexiones con configuración desde variables de entorno
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

// Evento que se dispara cuando se establece una conexión exitosa
pool.on('connect', () => {
  console.log('Conectado a la base de datos PostgreSQL');
});

// Evento que se dispara cuando ocurre un error en el pool de conexiones
pool.on('error', (err) => {
  console.error('Error en la conexión a la base de datos:', err);
});

// Exporta el pool para usarlo en otros módulos de la aplicación
module.exports = pool;