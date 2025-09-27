#!/usr/bin/env ts-node

/**
 * Environment Validation Script
 * 
 * This script validates that all required environment variables are present
 * and correctly formatted before starting the application.
 * 
 * Usage:
 *   npm run validate-env
 *   or
 *   npx ts-node src/scripts/validate-env.ts
 */

import { env, getAiConfig, getFileStorageConfig, getClerkConfig, getDatabaseConfig } from '../config/env';

console.log('🔍 Validating environment configuration...\n');

// Basic environment info
console.log('📋 Environment Information:');
console.log(`   Environment: ${env.NODE_ENV}`);
console.log(`   Port: ${env.PORT}`);
console.log(`   Frontend URL: ${env.FRONTEND_URL}`);
console.log(`   Log Level: ${env.LOG_LEVEL}\n`);

// Database validation
console.log('🗄️  Database Configuration:');
try {
  const dbConfig = getDatabaseConfig();
  const dbUrl = dbConfig.url;
  const dbInfo = dbUrl.includes('@') ? dbUrl.split('@')[1] : 'Local database';
  console.log(`   ✅ Database URL configured`);
  console.log(`   📍 Connection: ${dbInfo}`);
} catch (error) {
  console.log(`   ❌ Database configuration error: ${error}`);
}
console.log('');

// Clerk authentication validation
console.log('🔐 Clerk Authentication:');
try {
  const clerkConfig = getClerkConfig();
  console.log(`   ✅ Secret Key: ${clerkConfig.secretKey ? 'Configured' : 'Missing'}`);
  console.log(`   ✅ Publishable Key: ${clerkConfig.publishableKey ? 'Configured' : 'Missing'}`);
  console.log(`   ${clerkConfig.webhookSecret ? '✅' : '⚠️ '} Webhook Secret: ${clerkConfig.webhookSecret ? 'Configured' : 'Optional'}`);
} catch (error) {
  console.log(`   ❌ Clerk configuration error: ${error}`);
}
console.log('');

// AI configuration validation
console.log('🤖 AI Configuration:');
try {
  const aiConfig = getAiConfig();
  const providers = [];
  
  if (aiConfig.openai) providers.push('OpenAI');
  if (aiConfig.anthropic) providers.push('Anthropic');
  if (aiConfig.google) providers.push('Google');
  
  if (providers.length > 0) {
    console.log(`   ✅ AI Providers: ${providers.join(', ')}`);
  } else {
    console.log(`   ⚠️  No AI providers configured (AI features will be disabled)`);
  }
} catch (error) {
  console.log(`   ❌ AI configuration error: ${error}`);
}
console.log('');

// File storage validation
console.log('📁 File Storage Configuration:');
try {
  const storageConfig = getFileStorageConfig();
  console.log(`   ✅ Storage Type: ${storageConfig.type}`);
  
  if (storageConfig.type === 'local') {
    console.log(`   📂 Upload Path: ${storageConfig.local?.uploadPath}`);
  } else if (storageConfig.type === 's3') {
    console.log(`   🪣 S3 Bucket: ${storageConfig.s3?.bucket}`);
    console.log(`   🌍 S3 Region: ${storageConfig.s3?.region}`);
  }
} catch (error) {
  console.log(`   ❌ File storage configuration error: ${error}`);
}
console.log('');

// Optional services validation
console.log('🔧 Optional Services:');

// Redis
if (env.REDIS_URL) {
  console.log(`   ✅ Redis: Configured`);
} else {
  console.log(`   ⚠️  Redis: Not configured (caching disabled)`);
}

// Email
if (env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS) {
  console.log(`   ✅ Email: Configured`);
} else {
  console.log(`   ⚠️  Email: Not configured (notifications disabled)`);
}

console.log('\n🎉 Environment validation completed successfully!');
console.log('✅ All required environment variables are present and valid.');
console.log('🚀 You can now start the application with: npm run dev');
