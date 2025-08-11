// IMPORTAR LA LIBRERÍA PARA GENERAR DOCUMENTACIÓN SWAGGER
const swaggerJSDoc = require('swagger-jsdoc');

// CONFIGURACIÓN DE LA DOCUMENTACIÓN OPENAPI 3.0
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API Book&Bite',
        version: '1.0.0',
        description: 'Documentación de la API del restaurante con Express y PostgreSQL',
    },
    components: {
        securitySchemes: {
        bearerAuth: { 
            type: 'http', 
            scheme: 'bearer',
            bearerFormat: 'JWT',
        }
        }
    },
    security: [
        { 
            bearerAuth: [] 
        }
    ],
};

// OPCIONES DE CONFIGURACIÓN PARA SWAGGER-JSDOC
const options = {
    swaggerDefinition,    
    apis: ['./index.js'], 
};

// GENERAR SWAGGER
const swaggerSpec = swaggerJSDoc(options);
// EXPORTAR ESPECIFICACIÓN
module.exports = swaggerSpec;
