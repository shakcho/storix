import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Environment schema validation
const envSchema = z.object({
  // Server configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3001'),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),

  // Database
  DATABASE_URL: z.string().min(1, 'Database URL is required'),

  // Clerk Authentication
  CLERK_SECRET_KEY: z.string().min(1, 'Clerk secret key is required'),
  CLERK_PUBLISHABLE_KEY: z.string().min(1, 'Clerk publishable key is required'),
  CLERK_WEBHOOK_SECRET: z.string().optional(),

  // AI Configuration
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GOOGLE_API_KEY: z.string().optional(),

  // File Storage
  FILE_STORAGE_TYPE: z.enum(['local', 's3']).default('local'),
  UPLOAD_PATH: z.string().default('uploads'),

  // S3 Configuration (required if FILE_STORAGE_TYPE is 's3')
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),

  // Redis (optional)
  REDIS_URL: z.string().optional(),

  // Email Configuration (optional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

// Validate environment variables
const parseEnv = () => {
  try {
    const env = envSchema.parse(process.env);
    
    // Additional validation for S3 configuration
    if (env.FILE_STORAGE_TYPE === 's3') {
      const s3Required = ['S3_BUCKET', 'S3_REGION', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY'];
      const missingS3Vars = s3Required.filter(key => !process.env[key]);
      
      if (missingS3Vars.length > 0) {
        throw new Error(
          `S3 storage is enabled but missing required environment variables: ${missingS3Vars.join(', ')}`
        );
      }
    }

    // Validate that at least one AI API key is provided
    const aiKeys = [env.OPENAI_API_KEY, env.ANTHROPIC_API_KEY, env.GOOGLE_API_KEY];
    const hasAiKey = aiKeys.some(key => key && key.length > 0);
    
    if (!hasAiKey) {
      console.warn('⚠️  No AI API keys provided. AI features will be disabled.');
    }

    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .filter(err => err.code === 'too_small' && err.minimum === 1)
        .map(err => err.path.join('.'));
      
      const invalidVars = error.errors
        .filter(err => err.code !== 'too_small')
        .map(err => `${err.path.join('.')}: ${err.message}`);

      console.error('❌ Environment validation failed:');
      
      if (missingVars.length > 0) {
        console.error('Missing required environment variables:');
        missingVars.forEach(varName => console.error(`  - ${varName}`));
      }
      
      if (invalidVars.length > 0) {
        console.error('Invalid environment variables:');
        invalidVars.forEach(varName => console.error(`  - ${varName}`));
      }
      
      console.error('\nPlease check your .env file and ensure all required variables are set.');
      process.exit(1);
    }
    
    console.error('❌ Environment validation failed:', error);
    process.exit(1);
  }
};

// Parse and export validated environment variables
export const env = parseEnv();

// Type-safe environment configuration
export type EnvConfig = z.infer<typeof envSchema>;

// Helper functions
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

// AI Configuration helpers
export const getAiConfig = () => ({
  openai: env.OPENAI_API_KEY ? { apiKey: env.OPENAI_API_KEY } : null,
  anthropic: env.ANTHROPIC_API_KEY ? { apiKey: env.ANTHROPIC_API_KEY } : null,
  google: env.GOOGLE_API_KEY ? { apiKey: env.GOOGLE_API_KEY } : null,
});

// File Storage Configuration
export const getFileStorageConfig = () => ({
  type: env.FILE_STORAGE_TYPE,
  local: {
    uploadPath: env.UPLOAD_PATH,
  },
  s3: env.FILE_STORAGE_TYPE === 's3' ? {
    bucket: env.S3_BUCKET!,
    region: env.S3_REGION!,
    accessKeyId: env.S3_ACCESS_KEY_ID!,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY!,
  } : null,
});

// Database Configuration
export const getDatabaseConfig = () => ({
  url: env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

// Clerk Configuration
export const getClerkConfig = () => ({
  secretKey: env.CLERK_SECRET_KEY,
  publishableKey: env.CLERK_PUBLISHABLE_KEY,
  webhookSecret: env.CLERK_WEBHOOK_SECRET,
});

// Email Configuration
export const getEmailConfig = () => ({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  user: env.SMTP_USER,
  pass: env.SMTP_PASS,
  enabled: !!(env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS),
});

// Redis Configuration
export const getRedisConfig = () => ({
  url: env.REDIS_URL,
  enabled: !!env.REDIS_URL,
});

// Log configuration
export const getLogConfig = () => ({
  level: env.LOG_LEVEL,
  enableConsole: isDevelopment,
  enableFile: isProduction,
});
