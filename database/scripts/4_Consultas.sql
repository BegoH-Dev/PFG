/* EXPLICACIÓN:
STRING_AGG -> Junta varios textos de diferentes filas en uno solo, separados por algo que tú elijas (como una coma).
Por ejemplo, si un producto tiene varios alérgenos, con STRING_AGG puedes mostrar todos juntos en una línea, separados por comas.
*/

-- Consulta para ver productos con o sin alérgenos:
SELECT p.id, p.nombre, STRING_AGG(a.nombre, ', ') AS alergenos
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

-- Consultar los alérgenos de cada producto, usando "string_agg()" para una cadena de palabras separadas por comas
SELECT p.id, p.nombre, STRING_AGG(a.nombre, ', ' ORDER BY a.nombre) AS alergenos
FROM productos p
JOIN producto_alergenos pa ON p.id = pa.producto_id
JOIN alergenos a ON pa.alergeno_id = a.id
GROUP BY p.id, p.nombre
ORDER BY p.id;

--Consultar los alérgenos de un determinado producto (EJEMPLO: PRODUCTO DEL ID "11") usando "string_agg()" para una cadena de palabras separadas por comas 
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
