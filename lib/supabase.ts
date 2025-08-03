import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables: Url or AnonKey");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}
    