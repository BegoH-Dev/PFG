
# PFG
# Book & Bite  
**Aplicación web para gestión de pedidos a domicilio y reservas de mesas para restaurantes**

---

## Descripción
**Book & Bite** es una aplicación web integral que optimiza la gestión de pedidos y reservas en restaurantes. Desarrollada como solución completa para la industria de la hostelería, permite tanto a clientes como a gerentes gestionar eficientemente pedidos a domicilio, reservas de mesa y toda la operativa del restaurante.

### ¿Qué problema resuelve?
- Automatiza la gestión de pedidos y reservas  
- Reduce errores humanos en la toma de pedidos  
- Mejora la experiencia del cliente con una interfaz intuitiva  
- Proporciona herramientas de análisis para el negocio

### ¿A quién va dirigido?
- **Clientes**: Usuarios que desean hacer pedidos a domicilio o reservar mesas  
- **Gerentes de restaurante**: Personal que gestiona pedidos, reservas y operaciones  
- **Restaurantes**: Negocios que buscan digitalizar y optimizar sus procesos

---

## Tecnologías Utilizadas

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

## Instalación y Configuración

### Requisitos Previos
- Docker (recomendado)  
O bien:
- Node.js (v14 o superior)  
- PostgreSQL  
- Git  

### Opción 1: Con Docker (Recomendado)

Clonar el repositorio:
git clone https://github.com/BHA-FESAC/PFG
cd codigo

Levantar todos los servicios:
docker-compose up --build

Acceder a la aplicación:
Frontend: http://localhost:3000
Backend: http://localhost:5000
Swagger: http://localhost:5000/api-docs


# Opción 2: Instalación Manual

Clonar y configurar la base de datos:
git clone https://github.com/BHA-FESAC/PFG
cd codigo
psql -U postgres
CREATE DATABASE restaurante_db;

Configurar el Backend:
cd backend
npm install

Crear archivo .env con:
DB_USER=admin_user  
DB_PASSWORD=admin  
DB_HOST=localhost  
DB_PORT=5432  
DB_NAME=restaurante_db  
JWT_SECRET=secreto123  
REACT_APP_EMAILJS_SERVICE_ID=service_kx4rh4b  
REACT_APP_EMAILJS_TEMPLATE_ID=template_bubou3k  
REACT_APP_EMAILJS_PUBLIC_KEY=hXOVhDS7tdDuCAPoD  
Ejecutar el servidor:

npm run dev
Configurar el Frontend:

cd ../frontend
npm install

Crear archivo .env con:
REACT_APP_API_URL=http://localhost:5000

Iniciar el frontend:
npm start

# Estructura del Proyecto
codigo/
├── backend/               # Servidor Node.js + Express
│   ├── routes/            # Rutas de la API
│   ├── config/            # Configuración de BD
│   ├── middleware/        # Middlewares personalizados
│   └── index.js           # Punto de entrada del servidor
├── frontend/              # Aplicación React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas principales
│   │   └── App.js         # Componente principal
├── docker-compose.yml     # Orquestación de contenedores
├── Dockerfile             # Imagen Docker
└── README.md              # Este archivo

# Funcionalidades Principales
# Para Clientes
- Pedidos a domicilio: Selección de productos, totales automáticos
- Reservas de mesa: Consulta de disponibilidad en tiempo real
- Gestión de perfil: Registro, login y pedidos previos
- Interfaz responsive: Adaptada para móviles, tablets y escritorio
- Notificaciones: Confirmaciones por email

# Para Gerentes
- Panel de gestión: Pedidos y reservas en tiempo real
- Gestión del menú: CRUD completo de productos
- Reportes: Análisis de ventas y tendencias
- Confirmación de pedidos: Flujo de trabajo eficiente
- Acceso seguro: Autenticación con JWT

# Características Técnicas
- Seguridad: Cifrado de contraseñas, protección contra XSS
- Rendimiento: Consultas SQL optimizadas
- PWA Ready: Preparado para app móvil
- Dockerizado: Despliegue y escalabilidad sencilla

# Capturas de Pantalla
Las capturas están disponibles en la documentación del proyecto y en los anexos del TFG.
- Landing Page (PC y móvil)
- Wireflow

# Testing
El proyecto incluye documentación completa de pruebas:
- Postman: Testing de endpoints de API
- Swagger: Documentación interactiva de la API
- Pruebas manuales: Casos de uso para pedidos y reservas

# Acceso a pruebas:
- Swagger UI: http://localhost:5000/api-docs

# Documentación adicional en carpeta del proyecto

# Problemas Comunes y Soluciones
Problema
Error de conexión a BD	
Solución
Verificar credenciales en .env

Problema
Puerto ocupado	
Solución
Cambiar puerto en docker-compose.yml

Problema
Dependencias faltantes	
Solución
Ejecutar npm install en cada carpeta

Problema
CORS errors	
Solución
Verificar configuración de CORS en backend

# Documentación completa en el archivo "Problemas y Soluciones" del proyecto.
- Futuras Mejoras
- Despliegue en la nube (Render, Railway)
- Sistema de valoraciones de productos
- Notificaciones push en tiempo real
- Integración con PayPal y pagos seguros
- Ofertas y descuentos personalizados
- Dashboard avanzado para gerentes
- Modificación/cancelación de reservas por parte del cliente
- hCaptcha para protección contra bots

# Autoría
Autora: Begoña Horgué Aldomán
Tutor: Pablo Rodríguez
Fecha: 9 de junio de 2025
Ciclo: Técnico Superior en Desarrollo de Aplicaciones Multiplataforma

# Enlaces Útiles
- Repositorio en GitHub
- Documentación API: http://localhost:5000/api-docs
- Paleta de colores: Pokemon Palette - Persian
- EmailJS: Documentación oficial

# Licencia
Proyecto académico desarrollado como Trabajo Fin de Ciclo.
¿Encontraste algún problema o tienes sugerencias? ¡Abre un issue en el repositorio! 🚀