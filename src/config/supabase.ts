import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://obceibzgguikdlaoueli.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_oAIY88MIpb2jrb8kcUlGJQ_HB7wLYqp';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
