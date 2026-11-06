import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cfxbajcbixatlw...supabase.co';
const SUPABASE_KEY = 'sb_publishable_2B278qTzyMZf7e3GGam6LQ_Det-Ze-r';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);