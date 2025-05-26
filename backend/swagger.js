const swaggerJSDoc = require('swagger-jsdoc');

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

const options = {
    swaggerDefinition,
    apis: ['./index.js'], // Lee anotaciones Swagger desde la ruta
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
