import { createClient } from '@supabase/supabase-js';

// Usamos la variable de entorno si existe, o las credenciales directas de respaldo
const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  'https://jjamckmevzmccpqzowxs.supabase.co';

const supabaseAnonKey = 
  //import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqYW1ja21ldnptY2NwcXpvd3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NDUxOTIsImV4cCI6MjEwMjAyMTE5Mn0.FOleujgV877aI8VNzoLE2hiPoQU4H-lDuHpvArvEGeU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);