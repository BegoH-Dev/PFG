const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'restaurante_db',
  password: 'postgres',
  port: 5432,
});

// Endpoint para obtener los productos
app.get('/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en la base de datos');
  }
});

// Endpoint para hacer un pedido
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

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});
