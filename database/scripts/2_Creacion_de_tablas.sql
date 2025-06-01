/* CREACIÓN DE TABLAS */

/* TABLA "PRODUCTOS" */
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(8, 2) NOT NULL,
    tipo VARCHAR(50) CHECK (tipo IN (
        'Entrantes', 'Aperitivos', 'Ensaladas', 'Sushi', 'Pastas', 'Carnes', 'Pescados', 'Mariscos', 'Postres', 'Bebidas', 'Vinos', 'Cafés e infusiones'
    )) NOT NULL
);

/* TABLA "USUARIOS" */
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
	nombre_usuario VARCHAR(100) UNIQUE,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
	fecha_nacimiento DATE,
    contraseña VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	rol VARCHAR(20) DEFAULT 'cliente' CHECK (rol IN ('cliente', 'admin', 'gerente')), -- Para manejar administradores/gerentes
	acepta_terminos BOOLEAN NOT NULL
);

/* TABLA "PEDIDOS" */
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    total DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(20) CHECK (estado IN ('pendiente', 'pagado', 'entregado', 'cancelado')) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	direccion_entrega TEXT, -- Así el usuario puede cambiar la dirección por pedido.
	metodo_pago VARCHAR(50)
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
    estado VARCHAR(20) CHECK (estado IN ('confirmada', 'cancelada', 'pendiente')) NOT NULL,
	email_envio VARCHAR(100), -- Para poder registrar si la reserva se envió al correo alternativo
	comentarios VARCHAR (255)
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

/* TABLA "SUSCRIPCIONES" */
CREATE TABLE suscripciones (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  fecha_suscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* TABLA "VALORACIONES" */
CREATE TABLE valoraciones (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
  producto_id INT REFERENCES productos(id) ON DELETE CASCADE,
  puntuacion INT CHECK (puntuacion BETWEEN 1 AND 5),
  comentario TEXT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

