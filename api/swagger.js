import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CBT Marketplace API',
      version: '1.0.0',
      description: 'API documentation for CBT Marketplace platform',
    },
    servers: [
      {
        url: 'https://kpt.arisweb.ru:8443',
        description: 'Production server',
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Promotion: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            type: { 
              type: 'string',
              enum: ['psychologist', 'institution']
            },
            entity_id: { type: 'string' },
            payment_id: { type: 'string' },
            amount: { type: 'number' },
            status: { 
              type: 'string',
              enum: ['pending', 'completed', 'failed']
            },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'psychologist', 'institute', 'client'] },
            avatar: { type: 'string' },
            is_verified: { type: 'boolean' },
            is_active: { type: 'boolean' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string' },
            password: { type: 'string' }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'name', 'role'],
          properties: {
            email: { type: 'string' },
            password: { type: 'string' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['psychologist', 'institute', 'client'] },
            phone: { type: 'string' }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./api/routes/*.js']
};

export const specs = swaggerJSDoc(options);