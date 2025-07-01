import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/types/database';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.server
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env.server');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    'Missing required environment variables. Please check .env.server file:\n' +
    `SUPABASE_URL: ${supabaseUrl ? 'present' : 'missing'}\n` +
    `SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceRoleKey ? 'present' : 'missing'}`
  );
}

console.log('Initializing Supabase client with URL:', supabaseUrl);

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey
);
