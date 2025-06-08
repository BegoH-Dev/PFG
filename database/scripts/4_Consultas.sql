/* CONSULTAS */
/* VER TABLAS */
select * from producto_alergenos;
select * from detalles_pedido;
select * from pedidos;
select * from reservas;
select * from valoraciones;
select * from suscripciones;
select * from alergenos;
select * from mesas;
select * from usuarios;
select * from productos;

/* PARA ELIMINAR USUARIO */ 
DELETE FROM usuarios WHERE email = 'prueba@yopmail.com';

SELECT * FROM usuarios WHERE nombre_usuario = 'juanp';

SELECT * FROM mesas WHERE capacidad >= 2 AND disponible = TRUE ORDER BY capacidad LIMIT 1;

SELECT id, nombre_usuario FROM usuarios WHERE id = 35;
SELECT * FROM usuarios WHERE id = 35;

/* COMPROBAR SI UN USUARIO ESTÁ REGISTRADO */
SELECT * FROM usuarios WHERE email = 'lucia@example.com';
SELECT id, email, contraseña FROM usuarios WHERE email = 'manu@email.com';

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

-- Ver historial de pedidos de un usuario
SELECT p.id AS pedido_id, p.fecha, p.total, p.estado
FROM pedidos p
WHERE p.usuario_id = 35
ORDER BY p.fecha DESC;

-- Ver productos y cantidad de un pedido específico
SELECT pr.nombre AS producto_nombre,
       dp.cantidad,
       dp.precio_unitario,
       (dp.cantidad * dp.precio_unitario) AS subtotal
FROM detalles_pedido dp
JOIN productos pr ON dp.producto_id = pr.id
WHERE dp.pedido_id = 20;

-- Ver productos más vendidos
SELECT p.nombre, SUM(dp.cantidad) AS total_vendidos
FROM detalles_pedido dp
JOIN productos p ON dp.producto_id = p.id
GROUP BY p.id, p.nombre
ORDER BY total_vendidos DESC
LIMIT 10;

/*SUSCRIPCIONES*/
-- Ver todas las suscripciones
SELECT id, email, fecha_suscripcion FROM suscripciones 
ORDER BY fecha_suscripcion DESC;

-- Contar suscripciones por día
SELECT 
  DATE(fecha_suscripcion) as fecha,
  COUNT(*) as suscripciones_del_dia
FROM suscripciones 
GROUP BY DATE(fecha_suscripcion)
ORDER BY fecha DESC;

-- Buscar una suscripción específica
SELECT * FROM suscripciones WHERE email = 'juanperez-prueba@yopmail.com';

-- Eliminar una suscripción
DELETE FROM suscripciones WHERE email = 'juanperez-prueba@yopmail.com';

-- Actualizar el estado de una reserva (por ejemplo, cuando un cliente cancela una reserva desde el frontend)
UPDATE reservas
SET estado = 'cancelada'
WHERE id = 15;

select * from reservas;

-- Actualizar el estado de un pedido (por ejemplo, marcarlo como entregado)
UPDATE pedidos
SET estado = 'pagado'
WHERE id = 19;

select * from pedidos;

-- Editar los datos de un usuario (cuando un usuario actualiza su perfil)
UPDATE usuarios
SET nombre = 'Sara',
    apellidos = 'Gutiérrez',
    email = 'sara@email.com'
WHERE id = 10;

select * from usuarios;

-- Actualizar el precio de un producto
UPDATE productos
SET precio = 6.50
WHERE id = 2;

select * from productos;

-- Modificar fecha u hora de una reserva (cuando el cliente cambia la hora)
UPDATE reservas
SET fecha_hora = '2025-07--1 18:30:00'
WHERE id = 16;

select * from reservas;

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

--  Ver productos de una categoría específica (por ejemplo, ‘Sushi’)
SELECT id, nombre, precio
FROM productos
WHERE tipo = 'Sushi'
ORDER BY nombre;

