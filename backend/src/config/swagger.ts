import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Storix API',
      version: '1.0.0',
      description: 'A comprehensive writing platform API for collaborative story creation, AI assistance, and project management.',
      contact: {
        name: 'Storix Team',
        email: 'support@storix.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Development server'
      },
      {
        url: 'https://api.storix.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your Clerk JWT token'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID'
            },
            clerkId: {
              type: 'string',
              description: 'Clerk user ID'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email'
            },
            username: {
              type: 'string',
              description: 'Username'
            },
            firstName: {
              type: 'string',
              description: 'First name'
            },
            lastName: {
              type: 'string',
              description: 'Last name'
            },
            imageUrl: {
              type: 'string',
              format: 'uri',
              description: 'Profile image URL'
            },
            subscriptionTier: {
              type: 'string',
              enum: ['free', 'pro', 'enterprise'],
              description: 'Subscription tier'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation date'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date'
            }
          }
        },
        Project: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Project ID'
            },
            title: {
              type: 'string',
              description: 'Project title'
            },
            description: {
              type: 'string',
              description: 'Project description'
            },
            genre: {
              type: 'string',
              description: 'Project genre'
            },
            status: {
              type: 'string',
              enum: ['draft', 'published', 'archived'],
              description: 'Project status'
            },
            isPublic: {
              type: 'boolean',
              description: 'Whether project is public'
            },
            content: {
              type: 'string',
              description: 'Project content'
            },
            wordCount: {
              type: 'integer',
              description: 'Total word count'
            },
            characterCount: {
              type: 'integer',
              description: 'Total character count'
            },
            authorId: {
              type: 'string',
              description: 'Author user ID'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation date'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date'
            },
            author: {
              $ref: '#/components/schemas/User'
            },
            chapters: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Chapter'
              }
            },
            collaborators: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/ProjectCollaborator'
              }
            }
          }
        },
        Chapter: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Chapter ID'
            },
            title: {
              type: 'string',
              description: 'Chapter title'
            },
            content: {
              type: 'string',
              description: 'Chapter content'
            },
            order: {
              type: 'integer',
              description: 'Chapter order'
            },
            wordCount: {
              type: 'integer',
              description: 'Chapter word count'
            },
            characterCount: {
              type: 'integer',
              description: 'Chapter character count'
            },
            projectId: {
              type: 'string',
              description: 'Parent project ID'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation date'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date'
            }
          }
        },
        ProjectCollaborator: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Collaborator ID'
            },
            role: {
              type: 'string',
              enum: ['viewer', 'editor', 'co-author'],
              description: 'Collaborator role'
            },
            permissions: {
              type: 'object',
              description: 'Specific permissions'
            },
            userId: {
              type: 'string',
              description: 'User ID'
            },
            projectId: {
              type: 'string',
              description: 'Project ID'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation date'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        Chat: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Chat ID'
            },
            title: {
              type: 'string',
              description: 'Chat title'
            },
            projectId: {
              type: 'string',
              description: 'Project ID'
            },
            userId: {
              type: 'string',
              description: 'User ID'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation date'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date'
            },
            messages: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/ChatMessage'
              }
            }
          }
        },
        ChatMessage: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Message ID'
            },
            role: {
              type: 'string',
              enum: ['user', 'assistant'],
              description: 'Message role'
            },
            content: {
              type: 'string',
              description: 'Message content'
            },
            chatId: {
              type: 'string',
              description: 'Chat ID'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation date'
            }
          }
        },
        File: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'File ID'
            },
            filename: {
              type: 'string',
              description: 'File name'
            },
            originalName: {
              type: 'string',
              description: 'Original file name'
            },
            mimeType: {
              type: 'string',
              description: 'MIME type'
            },
            size: {
              type: 'integer',
              description: 'File size in bytes'
            },
            path: {
              type: 'string',
              description: 'File path'
            },
            url: {
              type: 'string',
              format: 'uri',
              description: 'File URL'
            },
            userId: {
              type: 'string',
              description: 'User ID'
            },
            projectId: {
              type: 'string',
              description: 'Project ID'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation date'
            }
          }
        },
        ResearchFile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Research file ID'
            },
            title: {
              type: 'string',
              description: 'Research title'
            },
            description: {
              type: 'string',
              description: 'Research description'
            },
            fileType: {
              type: 'string',
              enum: ['image', 'audio', 'video', 'text', 'link', 'document'],
              description: 'File type'
            },
            content: {
              type: 'string',
              description: 'Text content or link'
            },
            fileUrl: {
              type: 'string',
              format: 'uri',
              description: 'File URL'
            },
            metadata: {
              type: 'object',
              description: 'Additional metadata'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Research tags'
            },
            userId: {
              type: 'string',
              description: 'User ID'
            },
            projectId: {
              type: 'string',
              description: 'Project ID'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation date'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date'
            }
          }
        },
        AIModel: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'AI model ID'
            },
            name: {
              type: 'string',
              description: 'Model name'
            },
            provider: {
              type: 'string',
              enum: ['openai', 'anthropic', 'google', 'local'],
              description: 'Model provider'
            },
            modelId: {
              type: 'string',
              description: 'Model identifier'
            },
            isDefault: {
              type: 'boolean',
              description: 'Whether this is the default model'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the model is active'
            },
            userId: {
              type: 'string',
              description: 'User ID'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation date'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts'
  ]
};

export const swaggerSpec = swaggerJsdoc(options);
