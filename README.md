-- SPANISH --
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

---

---

-- ENGLISH --
# TFG - BOOK & BITE  
**Web application for managing home delivery orders and table reservations for restaurants**

**Project Status**  
This project is continuously evolving and improving to provide a better experience and functionality. Some features may be adjusted or expanded in future versions. I appreciate any feedback or suggestions that contribute to its growth.

---

## Description  
**Book & Bite** is a comprehensive web application that optimizes the management of orders and table reservations in restaurants. Developed as a complete solution for the hospitality industry.

## What problem does it solve?  
- Automates order and reservation management  
- Reduces human errors in order taking  
- Improves the customer experience with an intuitive interface  

## Who is it for?  
- **Customers**: Users who want to place home delivery orders or reserve tables  
- **Restaurant managers**: Staff who manage orders, reservations, and operations (FUTURE IMPROVEMENTS)  
- **Restaurants**: Businesses looking to digitalize and optimize their processes

---

## TECHNOLOGIES USED

### Frontend  
- **React** – User interface library  
- **Bootstrap** – CSS framework for responsive design  
- **React Router** – Routing for SPA  
- **React Bootstrap** – Bootstrap components for React  

### Backend  
- **Node.js** – JavaScript runtime environment  
- **Express** – Web framework for Node.js  
- **PostgreSQL** – Relational database  
- **JWT** – Token-based authentication  
- **bcrypt** – Password hashing  

### Additional Tools  
- **Docker** – Containerization of the application  
- **Swagger** – API documentation  
- **Postman** – Endpoint testing  
- **EmailJS** – Sending emails  
- **CORS** – Cross-origin request handling

---

## INSTALLATION AND SETUP

### Prerequisites  
- Docker (recommended)  
Or:  
- Node.js (v14 or higher)  
- PostgreSQL  
- Git  

### Option 1: Using Docker (Recommended)

#### 1. Clone the repository:  
git clone https://github.com/BegoH-Dev/PFG  
cd codigo

#### 2. Start all services:
docker-compose up --build

#### 3. Access the application:
Frontend: http://localhost:3000
Backend: http://localhost:5000
Swagger: http://localhost:5000/api-docs

### Option 2: Manual Installation

#### 1. Clone the repository and create the database:
git clone https://github.com/BegoH-Dev/PFG  
cd codigo  
psql -U postgres  
CREATE DATABASE restaurante_db;

#### 2. Configure the Backend:
cd backend  
npm install

Create a .env file in the backend folder with the following format:
##### Database configuration
DB_USER=your_user  
DB_PASSWORD=your_password  
DB_HOST=localhost  
DB_PORT=5432  
DB_NAME=restaurante_db  
##### JWT configuration  
JWT_SECRET=your_jwt_secret  
##### EmailJS configuration  
REACT_APP_EMAILJS_SERVICE_ID=your_service_id  
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id  
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key  

#### SECURITY NOTE:
Credentials and API keys are unique to each installation. They are not publicly shared and must be created by you.

Run the server:
npm run dev

#### 3. Configure the Frontend:
cd ../frontend  
npm install

Create a .env file in the frontend folder:
REACT_APP_API_URL=http://localhost:5000

Start the frontend:
npm start

### Project Structure
codigo/
├── backend/    # Node.js + Express server  
│   ├── routes/  
│   ├── config/  
│   ├── middleware/  
│   └── index.js  
├── frontend/   # React application  
│   ├── src/  
│   │   ├── components/  
│   │   ├── pages/  
│   │   └── App.js  
├── docker-compose.yml  # Container orchestration  
├── Dockerfile          # Docker image  
└── README.md

## MAIN FEATURES
### For Customers
- Home delivery orders: Product selection, automatic totals
- Table reservations: Real-time availability check
- Profile management: Registration, login, and previous orders
- Responsive interface: Adapted for mobile, tablet, and desktop
- Notifications: Email confirmations

### For Managers (FUTURE IMPROVEMENTS)
- Management dashboard: Real-time orders and reservations
- Menu management: Full CRUD of products
- Reports: Sales and trends analysis
- Order confirmation: Efficient workflow
- Secure access: JWT authentication

### Technical Features
- Security: Password hashing, XSS protection
- Performance: Optimized SQL queries
- PWA Ready: Prepared for mobile app (FUTURE IMPROVEMENTS)
- Dockerized: Easy deployment and scalability

### Testing Access:
- Swagger UI: http://localhost:5000/api-docs

## ADDITIONAL PROJECT DOCUMENTATION

### Common Issues and Solutions
Issue - Database connection error	
Solution - Check credentials in .env

Issue - Port already in use	
Solution - Change port in docker-compose.yml

Issue - Missing dependencies
Solution - Run npm install in each folder

Issue - CORS errors	
Solution - Verify CORS configuration in backend

## AUTHORSHIP
Author: Begoña Horgué Aldomán
Course: Higher Technician in Web Application Development

## USEFUL LINKS
- API Documentation: http://localhost:5000/api-docs
- Color Palette: Pokemon Palette - Persian
- EmailJS

## LICENSE
Academic project developed as a Final Degree Project.

