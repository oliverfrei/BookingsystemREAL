import { createClient } from '@supabase/supabase-js';

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || 'https://zswzttlhbutgwdbeezbs.supabase.co';
const supabaseKey: string = import.meta.env.VITE_SUPABASE_KEY ||  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzd3p0dGxoYnV0Z3dkYmVlemJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4NjAzNjIsImV4cCI6MjA0NzQzNjM2Mn0.eL5eYTlnOJcuB1hEp2EyrKkEG0hsCWF20O4SWWFDytQ';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL eller nøgle mangler i miljøvariablerne');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;