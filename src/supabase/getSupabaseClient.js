import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zswzttlhbutgwdbeezbs.supabase.co'; // Your Supabase URL
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzd3p0dGxoYnV0Z3dkYmVlemJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4NjAzNjIsImV4cCI6MjA0NzQzNjM2Mn0.eL5eYTlnOJcuB1hEp2EyrKkEG0hsCWF20O4SWWFDytQ'; // Your API key

export const getSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseKey);
};
