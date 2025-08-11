# TFG - BOOK & BITE  
**Aplicación web para gestión de pedidos a domicilio y reservas de mesas para restaurantes**

**Estado del Proyecto**
Este proyecto está en constante evolución y mejora para ofrecer una mejor experiencia y funcionalidad. Algunas características pueden ser ajustadas o ampliadas en futuras versiones. Agradezco cualquier comentario o sugerencia que contribuya a su crecimiento.

---

## Descripción
**Book & Bite** es una aplicación web integral que optimiza la gestión de pedidos y reservas de mesa en restaurantes. Desarrollada como solución completa para la industria de la hostelería.

## ¿Qué problema resuelve?
- Automatiza la gestión de pedidos y reservas  
- Reduce errores humanos en la toma de pedidos  
- Mejora la experiencia del cliente con una interfaz intuitiva  

## ¿A quién va dirigido?
- **Clientes**: Usuarios que desean hacer pedidos a domicilio o reservar mesas  
- **Gerentes de restaurante**: Personal que gestiona pedidos, reservas y operaciones (FUTURAS MEJORAS)
- **Restaurantes**: Negocios que buscan digitalizar y optimizar sus procesos

---

## TECNOLOGÍAS UTILIZADAS

### Frontend
- **React** – Biblioteca para interfaces de usuario  
- **Bootstrap** – Framework CSS para diseño responsive  
- **React Router** – Enrutamiento para SPA  
- **React Bootstrap** – Componentes Bootstrap para React

### Backend
- **Node.js** – Entorno de ejecución JavaScript  
- **Express** – Framework web para Node.js  
- **PostgreSQL** – Base de datos relacional  
- **JWT** – Autenticación con tokens  
- **bcrypt** – Cifrado de contraseñas

### Herramientas adicionales
- **Docker** – Containerización de la aplicación  
- **Swagger** – Documentación de API  
- **Postman** – Testing de endpoints  
- **EmailJS** – Envío de correos electrónicos  
- **CORS** – Manejo de solicitudes entre dominios

---

## INSTALACIÓN Y CONFIGURACIÓN

### Requisitos Previos
- Docker (recomendado)  
O bien:
- Node.js (v14 o superior)  
- PostgreSQL  
- Git  

### Opción 1: Con Docker (Recomendado)

#### 1. Clonar el repositorio:
git clone https://github.com/BegoH-Dev/PFG
cd codigo

#### 2. Levantar todos los servicios:
docker-compose up --build

#### 3. Acceder a la aplicación:
Frontend: http://localhost:3000
Backend: http://localhost:5000
Swagger: http://localhost:5000/api-docs


### Opción 2: Instalación Manual

#### 1. Clonar el repositorio y crear la base de datos:
git clone https://github.com/BegoH-Dev/PFG
cd codigo
psql -U postgres
CREATE DATABASE restaurante_db;

#### 2. Configurar el Backend:
cd backend
npm install

Crear un archivo .env en la carpeta backend siguiendo este formato:
##### Configuración de base de datos
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=restaurante_db
##### Configuración de JWT
JWT_SECRET=tu_secreto_jwt
##### Configuración de EmailJS
REACT_APP_EMAILJS_SERVICE_ID=tu_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=tu_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=tu_public_key 

#### NOTA DE SEGURIDAD:
Las credenciales y claves API son únicas para cada instalación. No se comparten públicamente y deberás crearlas por tu cuenta.

Ejecutar el servidor:
npm run dev

#### 3. Configurar el Frontend:
cd ../frontend
npm install

Crear un archivo .env en la carpeta frontend:
REACT_APP_API_URL=http://localhost:5000

Iniciar el frontend:
npm start

### Estructura del Proyecto
codigo/
├── backend/    # Servidor Node.js + Express
│   ├── routes/ 
│   ├── config/
│   ├── middleware/ 
│   └── index.js
├── frontend/    # Aplicación React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
├── docker-compose.yml    # Orquestación de contenedores
├── Dockerfile    # Imagen Docker
└── README.md

## FUNCIONALIDADES PRINCIPALES
### Para Clientes
- Pedidos a domicilio: Selección de productos, totales automáticos
- Reservas de mesa: Consulta de disponibilidad en tiempo real
- Gestión de perfil: Registro, login y pedidos previos
- Interfaz responsive: Adaptada para móviles, tablets y escritorio
- Notificaciones: Confirmaciones por email

### Para Gerentes (FUTURAS MEJORAS)
- Panel de gestión: Pedidos y reservas en tiempo real
- Gestión del menú: CRUD completo de productos
- Reportes: Análisis de ventas y tendencias
- Confirmación de pedidos: Flujo de trabajo eficiente
- Acceso seguro: Autenticación con JWT

### Características Técnicas
- Seguridad: Cifrado de contraseñas, protección contra XSS
- Rendimiento: Consultas SQL optimizadas
- PWA Ready: Preparado para app móvil (FUTURAS MEJORAS) 
- Dockerizado: Despliegue y escalabilidad sencilla

### Acceso a pruebas:
- Swagger UI: http://localhost:5000/api-docs


## DOCUMENTACIÓN ADICIONAL A CARPETA DEL PROYECTO

### Problemas Comunes y Soluciones
Problema - Error de conexión a BD	
Solución - Verificar credenciales en .env

Problema - Puerto ocupado	
Solución - Cambiar puerto en docker-compose.yml

Problema - Dependencias faltantes	
Solución - Ejecutar npm install en cada carpeta

Problema - CORS errors	
Solución - Verificar configuración de CORS en backend


## AUTORÍA
Autora: Begoña Horgué Aldomán
Ciclo: Técnico Superior en Desarrollo de Aplicaciones Web


## ENLACES ÚTILES
- Documentación API: http://localhost:5000/api-docs
- Paleta de colores: Pokemon Palette - Persian
- EmailJS

## LICENCIA
Proyecto académico desarrollado como Trabajo Fin de Ciclo.
