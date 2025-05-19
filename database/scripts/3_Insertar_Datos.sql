/* INSERTAR DATOS */

/* INSERTAR "ALERGENOS" */
INSERT INTO alergenos (nombre) VALUES
('Vegetariano'), ('Gluten'), ('Lácteos'), ('Huevo'), ('Pescado'), ('Marisco'), ('Frutos secos'), ('Picante');


/* INSERTAR "PRODUCTOS" */
INSERT INTO productos (nombre, precio, tipo) VALUES
('Jamón ibérico de bellota con pan de cristal y tomate', 16.90, 'Entrantes'),
('Croquetas caseras de cocido (6 uds.)', 9.50, 'Entrantes'),
('Gazpacho andaluz con virutas de jamón', 7.50, 'Entrantes'),
('Patatas bravas con alioli de ajo negro', 6.90, 'Aperitivos'),
('Tartar de atún rojo con aguacate', 14.50, 'Aperitivos'),
('Mejillones al vapor con limón', 8.90, 'Aperitivos'),
('Ensalada caprese con pesto de albahaca', 9.90, 'Ensaladas'),
('Ensalada César con pollo y lascas de parmesano', 11.50, 'Ensaladas'),
('Ensalada de quinoa con hummus y vinagreta cítrica', 10.50, 'Ensaladas'),
('Nigiri de anguila glaseada (4 uds.)', 9.90, 'Sushi'),
('Uramaki tempurizado de langostino y mayonesa picante', 11.90, 'Sushi'),
('Combo sushi del chef (16 piezas variadas)', 19.90, 'Sushi'),
('Tagliatelle a la carbonara tradicional', 12.90, 'Pastas'),
('Lasaña de verduras gratinada', 11.90, 'Pastas'),
('Espaguetis con mariscos al ajillo', 14.90, 'Pastas'),
('Solomillo de ternera con salsa de foie', 19.90, 'Carnes'),
('Pechuga de pollo rellena de espinacas y queso', 13.90, 'Carnes'),
('Costillas de cerdo a baja temperatura BBQ', 15.90, 'Carnes'),
('Lomo de bacalao al pil-pil', 17.50, 'Pescados'),
('Dorada a la sal con aceite de romero', 16.90, 'Pescados'),
('Tataki de atún rojo con sésamo', 18.00, 'Pescados'),
('Gambas al ajillo con guindilla', 14.90, 'Mariscos'),
('Zamburiñas gratinadas al horno', 13.50, 'Mariscos'),
('Langostinos a la plancha', 16.90, 'Mariscos'),
('Tarta de queso al horno con frutos rojos', 6.90, 'Postres'),
('Coulant de chocolate con helado de vainilla', 7.20, 'Postres'),
('Fruta fresca de temporada', 5.00, 'Postres'),
('Refrescos (cola, limón, naranja, tónica)', 2.50, 'Bebidas'),
('Agua mineral 0.5L', 1.80, 'Bebidas'),
('Cerveza', 2.70, 'Bebidas'),
('Zumos naturales', 3.50, 'Bebidas'),
('Vino tinto Rioja crianza (botella)', 16.00, 'Vinos'),
('Vino blanco Albariño (botella)', 17.50, 'Vinos'),
('Café solo / con leche / cortado', 1.80, 'Cafés e infusiones'),
('Infusiones (menta, té verde, manzanilla)', 2.00, 'Cafés e infusiones');

/* INSERTAR LOS ALÉRGENOS PARA CADA PRODUCTO */
INSERT INTO producto_alergenos (producto_id, alergeno_id)
VALUES 
(1, 2), (2, 2), (2, 3), (2, 4), (3, 1),
(4, 1), (4, 4), (5, 5), (6, 6),
(7, 3), (7, 7), (8, 2), (8, 3), (8, 4), (9, 1),
(10, 2), (10, 5), (11, 2), (11, 4), (11, 6), (11, 8), (12, 5), (12, 6), (12, 2), (12, 4),
(13, 2), (13, 4), (13, 3), (14, 1), (14, 2), (14, 3), (15, 6), (15, 2),
(16, 3), (17, 3), (18, 8), 
(19, 3), (19, 5), (20, 5), (21, 5), (21, 7), 
(22, 6), (22, 8), (23, 6), (23, 3), (24, 6),
(25, 2), (25, 3), (25, 4), (26, 2), (26, 3), (26, 4),(27, 1),
(34, 3);

