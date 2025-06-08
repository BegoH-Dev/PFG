const express = require('express');
const router = express.Router();
// Importa el pool de conexiones a la base de datos
const pool = require('../config/db');

// Importa middlewares de autenticación y autorización
const { verificarAdmin, verificarToken } = require('../middlewares/auth');

// POST - CREAR NUEVA RESERVA
router.post('/', async (req, res) => {
  const { usuario_id, fecha_hora, num_comensales, estado, email_envio, comentarios } = req.body;
  
  try {
    const mesaResult = await pool.query(
      'SELECT id FROM mesas WHERE capacidad >= $1 AND disponible = TRUE ORDER BY capacidad ASC LIMIT 1',
      [num_comensales]
    );

    if (mesaResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay mesas disponibles para ese número de comensales'
      });
    }

    const mesa_id = mesaResult.rows[0].id;

    const result = await pool.query(
      `INSERT INTO reservas (usuario_id, mesa_id, fecha_hora, num_comensales, estado, email_envio, comentarios)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [usuario_id, mesa_id, fecha_hora, num_comensales, estado, email_envio, comentarios]
    );

    await pool.query('UPDATE mesas SET disponible = FALSE WHERE id = $1', [mesa_id]);

    res.status(201).json({
      success: true,
      data: { reserva: result.rows[0] }
    });

  } catch (err) {
    console.error('Error al crear la reserva:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET - OBTENER RESERVAS (SOLO ADMINISTRADORES)
router.get('/admin/reservas', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reservas ORDER BY fecha_hora DESC');
    res.json({
      mensaje: 'Lista de reservas',
      productos: result.rows
    });  
  } catch (err) {
    console.error('Error en /admin/reservas:', err);
    res.status(500).send('Error al obtener las reservas');
  }
});

// GET - OBTENER RESERVAS (PÚBLICO/FILTRADO)
router.get('/', async (req, res) => {
  const { fecha } = req.query;

  let query;
  let params = [];

  if (fecha) {
    query = `SELECT * FROM reservas WHERE DATE(fecha_hora) = $1 ORDER BY fecha_hora`;
    params = [fecha];
  } else {
    query = `SELECT * FROM reservas WHERE fecha_hora >= CURRENT_DATE ORDER BY fecha_hora`;
  }

  try {
    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }

    res.json({
      mensaje: 'Lista de reservas',
      productos: result.rows
    });  
  } catch (err) {
    console.error('Error al obtener las reservas:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT - ACTUALIZAR ESTADO DE RESERVA
router.put('/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!['confirmada', 'cancelada', 'pendiente'].includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado no válido'
      });
    }

    const query = `
      UPDATE reservas 
      SET estado = $1 
      WHERE id = $2 
      RETURNING id, estado
    `;

    const result = await pool.query(query, [estado, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Reserva no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Estado de reserva actualizado',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Exporta el router para usar en la aplicación principal
module.exports = router;