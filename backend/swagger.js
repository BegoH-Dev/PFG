// Importa la librería para generar documentación Swagger/OpenAPI
const swaggerJSDoc = require('swagger-jsdoc');

// Configuración principal de la documentación OpenAPI 3.0
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API Book&Bite',
        version: '1.0.0',
        description: 'Documentación de la API del restaurante con Express y PostgreSQL',
    },
    // Define esquemas de seguridad disponibles en la API
    components: {
        securitySchemes: {
        bearerAuth: { 
            type: 'http', 
            scheme: 'bearer',
            bearerFormat: 'JWT',
        }
        }
    },
    // Aplica seguridad global a todas las rutas (puede sobrescribirse por ruta)
    security: [
        { 
            bearerAuth: [] 
        }
    ],
};

// Opciones de configuración para swagger-jsdoc
const options = {
    swaggerDefinition,    
    apis: ['./index.js'], 
};

// Genera la especificación Swagger combinando definición y anotaciones
const swaggerSpec = swaggerJSDoc(options);
// Exporta la especificación para usar en el servidor principal
module.exports = swaggerSpec;
