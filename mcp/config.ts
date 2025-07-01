import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.server' });

export const config = {
  // Server configuration
  port: process.env.PORT ? parseInt(process.env.PORT) : 3100,
  host: process.env.HOST || 'localhost',
  
  // Supabase configuration
  supabase: {
    url: process.env.SUPABASE_URL!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },
  
  // API configuration
  api: {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    },
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true,
    },
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING !== 'false',
  },
};

// Validate required environment variables
export function validateConfig() {
  const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Export default configuration
export default config; 