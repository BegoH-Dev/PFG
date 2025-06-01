/* CONSULTAS */

-- Consulta para ver productos con o sin alérgenos:
SELECT p.id AS producto_id,
       p.nombre AS producto_nombre,
       STRING_AGG(a.nombre, ', ') AS alergenos
FROM productos p
LEFT JOIN producto_alergenos pa ON p.id = pa.producto_id
LEFT JOIN alergenos a ON pa.alergeno_id = a.id
GROUP BY p.id, p.nombre
ORDER BY p.id;

-- Mostrar productos que contienen gluten
SELECT p.nombre 
FROM productos p
JOIN producto_alergenos pa ON p.id = pa.producto_id
JOIN alergenos a ON pa.alergeno_id = a.id
WHERE a.nombre = 'Gluten';

-- Consultar los alérgenos de cada producto:
SELECT p.id, p.nombre, STRING_AGG(a.nombre, ', ' ORDER BY a.nombre) AS alergenos
FROM productos p
JOIN producto_alergenos pa ON p.id = pa.producto_id
JOIN alergenos a ON pa.alergeno_id = a.id
GROUP BY p.id, p.nombre
ORDER BY p.id;

--Consultar los alérgenos de un determinado producto (EJEMPLO: PRODUCTO DEL ID "11") 
SELECT p.nombre AS producto, STRING_AGG(a.nombre, ', ' ORDER BY a.nombre) AS alergenos
FROM productos p
JOIN producto_alergenos pa ON p.id = pa.producto_id
JOIN alergenos a ON pa.alergeno_id = a.id
WHERE p.id = 11
GROUP BY p.nombre;

--Consulta que incluye el id, el nombre del producto y los alérgenos agrupados en una sola fila:
SELECT p.id, p.nombre AS producto, STRING_AGG(a.nombre, ', ' ORDER BY a.nombre) AS alergenos
FROM productos p
JOIN producto_alergenos pa ON p.id = pa.producto_id
JOIN alergenos a ON pa.alergeno_id = a.id
WHERE p.id = 11
GROUP BY p.id, p.nombre;

-- Ver reservas activas
SELECT r.id, u.nombre, u.apellidos, r.fecha_hora, r.num_comensales, r.estado
FROM reservas r
JOIN usuarios u ON r.usuario_id = u.id
WHERE r.fecha_hora > NOW() AND r.estado != 'cancelada'
ORDER BY r.fecha_hora;

-- Ver historial de pedidos de un usuario
SELECT p.id AS pedido_id, p.fecha, p.total, p.estado
FROM pedidos p
WHERE p.usuario_id = :usuario_id
ORDER BY p.fecha DESC;

-- Ver productos y cantidad de un pedido específico
SELECT pr.nombre AS producto_nombre,
       dp.cantidad,
       dp.precio_unitario,
       (dp.cantidad * dp.precio_unitario) AS subtotal
FROM detalles_pedido dp
JOIN productos pr ON dp.producto_id = pr.id
WHERE dp.pedido_id = :pedido_id;

-- Ver alérgenos de un producto
SELECT a.nombre
FROM producto_alergenos pa
JOIN alergenos a ON pa.alergeno_id = a.id
WHERE pa.producto_id = :producto_id;

-- Ver productos más vendidos
SELECT p.nombre, SUM(dp.cantidad) AS total_vendidos
FROM detalles_pedido dp
JOIN productos p ON dp.producto_id = p.id
GROUP BY p.id, p.nombre
ORDER BY total_vendidos DESC
LIMIT 10;

-- Buscar disponibilidad de mesas para una fecha y hora
SELECT m.id, m.numero, m.capacidad
FROM mesas m
WHERE m.id NOT IN (
    SELECT mesa_id
    FROM reservas
    WHERE fecha_hora = '2025-06-10 20:00:00'  -- reemplazar por la fecha/hora deseada
      AND estado != 'cancelada'
);

-- Ver suscriptores
SELECT email, fecha_suscripcion
FROM suscripciones
ORDER BY fecha_suscripcion DESC;

-- Ver valoraciones de un producto
SELECT u.nombre, v.puntuacion, v.comentario, v.fecha
FROM valoraciones v
JOIN usuarios u ON v.usuario_id = u.id
WHERE v.producto_id = :producto_id
ORDER BY v.fecha DESC;

-- Ver si hay mesas disponibles para una fecha u hora
CREATE OR REPLACE FUNCTION ver_disponibilidad_mesas(p_fecha TIMESTAMP)
RETURNS TABLE (mesa_id INT, numero INT, capacidad INT) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT m.id AS mesa_id, m.numero, m.capacidad
  FROM mesas m
  WHERE m.id NOT IN (
    SELECT r.mesa_id
    FROM reservas r
    WHERE r.fecha_hora = p_fecha
    AND r.estado != 'cancelada'
  );
END;
$$;

SELECT * FROM ver_disponibilidad_mesas('2025-06-15 21:00:00');

-- Actualizar el estado de una reserva (por ejemplo, cuando un cliente cancela una reserva desde el frontend)
UPDATE reservas
SET estado = :estado
WHERE id = :reserva_id;

-- Actualizar el estado de un pedido (por ejemplo, marcarlo como entregado)
UPDATE pedidos
SET estado = :estado
WHERE id = :pedido_id;

-- Editar los datos de un usuario (cuando un usuario actualiza su perfil)
UPDATE usuarios
SET nombre = :nombre,
    apellidos = :apellidos,
    email = :email
WHERE id = :usuario_id;

-- Actualizar el precio de un producto
UPDATE productos
SET precio = :nuevo_precio
WHERE id = :producto_id;

-- Modificar fecha u hora de una reserva (cuando el cliente cambia la hora)
UPDATE reservas
SET fecha_hora = :nueva_fecha
WHERE id = :reserva_id;

-- Modificar una valoración de producto (para que el cliente edite su reseña)
UPDATE valoraciones
SET puntuacion = :puntuacion,
    comentario = :comentario
WHERE id = :valoracion_id AND usuario_id = :usuario_id;

-- Ver todas las reservas con nombre del usuario y número de mesa
SELECT r.id AS reserva_id,
       u.nombre AS usuario,
       m.numero AS mesa,
       r.fecha_hora,
       r.num_comensales,
       r.estado
FROM reservas r
JOIN usuarios u ON r.usuario_id = u.id
JOIN mesas m ON r.mesa_id = m.id
ORDER BY r.fecha_hora;

-- Ver todos los pedidos con nombre del cliente y total
SELECT p.id AS pedido_id,
       u.nombre AS cliente,
       p.fecha,
       p.total,
       p.estado
FROM pedidos p
JOIN usuarios u ON p.usuario_id = u.id
ORDER BY p.fecha DESC;

-- Ver los productos de cada pedido con nombre del cliente
SELECT u.nombre AS cliente,
       p.id AS pedido_id,
       pr.nombre AS producto,
       dp.cantidad,
       dp.precio_unitario
FROM pedidos p
JOIN usuarios u ON p.usuario_id = u.id
JOIN detalles_pedido dp ON p.id = dp.pedido_id
JOIN productos pr ON dp.producto_id = pr.id
ORDER BY p.fecha DESC;

-- Ver las valoraciones con nombre del producto y del usuario
SELECT v.id AS valoracion_id,
       u.nombre AS usuario,
       pr.nombre AS producto,
       v.puntuacion,
       v.comentario,
       v.fecha
FROM valoraciones v
JOIN usuarios u ON v.usuario_id = u.id
JOIN productos pr ON v.producto_id = pr.id
ORDER BY v.fecha DESC;

-- Ver productos con sus categorías (si tienes una tabla categorias)
SELECT id, nombre, tipo AS categoria, precio
FROM productos
ORDER BY tipo, nombre;

-- Contar cuántos productos hay por tipo
SELECT tipo AS categoria, COUNT(*) AS total_productos
FROM productos
GROUP BY tipo
ORDER BY total_productos DESC;

-- Contar reservas por usuario
SELECT u.id, u.nombre, COUNT(r.id) AS total_reservas
FROM usuarios u
LEFT JOIN reservas r ON u.id = r.usuario_id
GROUP BY u.id, u.nombre
ORDER BY total_reservas DESC;

-- Listar usuarios que han hecho pedidos, junto con el número total de productos pedidos
SELECT u.nombre,
       COUNT(DISTINCT p.id) AS total_pedidos,
       SUM(dp.cantidad) AS total_productos
FROM usuarios u
JOIN pedidos p ON u.id = p.usuario_id
JOIN detalles_pedido dp ON p.id = dp.pedido_id
GROUP BY u.id, u.nombre
ORDER BY total_productos DESC;

-- Ver usuarios que han dejado valoraciones (y cuántas)
SELECT u.nombre,
       COUNT(v.id) AS total_valoraciones
FROM usuarios u
JOIN valoraciones v ON u.id = v.usuario_id
GROUP BY u.id, u.nombre
ORDER BY total_valoraciones DESC;

--  Ver productos de una categoría específica (por ejemplo, ‘Sushi’)
SELECT id, nombre, precio
FROM productos
WHERE tipo = 'Sushi'
ORDER BY nombre;

