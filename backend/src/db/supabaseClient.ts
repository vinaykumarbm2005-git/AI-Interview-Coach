import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'example-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
