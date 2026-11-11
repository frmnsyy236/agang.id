import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zvuwswmwiypwdalnhddi.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_PVeLGyyUzBh4eyRoF9d7Gg_EnoR5_zd';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
