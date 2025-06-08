/* PERMISOS */
-- Conceder acceso a la base de datos "restaurante_db"
GRANT CONNECT ON DATABASE restaurante_db TO gerente_user;
GRANT CONNECT ON DATABASE restaurante_db TO cliente_user;


/* ACCESO A ESQUEMA Y TABLAS */
-- Conceder USAGE sobre el esquema es necesario, porque sin este permiso, aunque 
-- tengan SELECT o INSERT sobre las tablas, los usuarios no podrán acceder al
-- contenido del esquema. Ni tablas, funciones, etc.
GRANT USAGE ON SCHEMA public TO gerente_user;
GRANT USAGE ON SCHEMA public TO cliente_user;


/* PERMISOS POR TABLA */
-- GERENTE: puede leer y escribir
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO gerente_user;

-- CLIENTE: solo puede consultar (menú o su historial)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO cliente_user;

-- Para que los permisos también se apliquen a futuras tablas
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO gerente_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON TABLES TO cliente_user;

-- PRIVILEGIOS
CREATE USER admin_user WITH PASSWORD 'admin';
GRANT ALL PRIVILEGES ON DATABASE restaurante_db TO admin_user;
