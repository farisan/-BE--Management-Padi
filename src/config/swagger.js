const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Management Padi API',
      version: '1.0.0',
      description: 'Dokumentasi API untuk Aplikasi Management Padi',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path ke file route untuk membaca anotasi swagger
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
