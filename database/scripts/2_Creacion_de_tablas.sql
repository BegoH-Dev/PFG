/* CREACIÓN DE TABLAS */

/* TABLA "PRODUCTOS" */
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(8, 2) NOT NULL,
    tipo VARCHAR(50) CHECK (tipo IN (
        'Entrantes', 'Aperitivos', 'Ensaladas', 'Sushi', 'Pastas', 'Carnes', 'Pescados', 'Mariscos', 'Postres', 'Bebidas', 'Vinos', 'Cafés e infusiones'
    )) NOT NULL,
    alergenos TEXT
);


/* TABLA "USUARIOS" */
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    contraseña TEXT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/* TABLA "PEDIDOS" */
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    total DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(20) CHECK (estado IN ('pendiente', 'pagado', 'entregado', 'cancelado')) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/* TABLA "DETALLES_PEDIDO" */
CREATE TABLE detalles_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INT REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id INT REFERENCES productos(id) ON DELETE CASCADE,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(8, 2) NOT NULL
);


/* TABLA "MESAS" */
CREATE TABLE mesas (
    id SERIAL PRIMARY KEY,
    numero INT NOT NULL,
    capacidad INT NOT NULL,
    disponible BOOLEAN DEFAULT TRUE
);


/* TABLA "RESERVAS" */
CREATE TABLE reservas (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    mesa_id INT REFERENCES mesas(id) ON DELETE CASCADE,
    fecha_hora TIMESTAMP NOT NULL,
    num_comensales INT NOT NULL,
    estado VARCHAR(20) CHECK (estado IN ('confirmada', 'cancelada', 'pendiente')) NOT NULL
);

-- Evitar reservas duplicadas por la misma mesa en el mismo horario
CREATE UNIQUE INDEX idx_reserva_mesa_fecha 
ON reservas(mesa_id, fecha_hora);


/* TABLA "ALERGENOS" */
CREATE TABLE alergenos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL
);


/* TABLA "PRODUCTOS_ALERGENOS" */
CREATE TABLE producto_alergenos (
    producto_id INT REFERENCES productos(id) ON DELETE CASCADE,
    alergeno_id INT REFERENCES alergenos(id) ON DELETE CASCADE,
    PRIMARY KEY (producto_id, alergeno_id)
);



