import { createClient } from "@supabase/supabase-js";

// #######################################################
// MODIFY THESE VARIABLES, TO YOUR SUPABASE INSTALLATION.
// #######################################################
const SUPABASE_URL = "https://xyzcompany.supabase.co";
const PUBLIC_ANON_KEY = "public-anon-key";
// #######################################################

let supabaseClientSingletong = undefined;
export function getSupabaseClient() {
  if (supabaseClientSingletong == undefined) {
    supabaseClientSingletong = createClient(SUPABASE_URL, PUBLIC_ANON_KEY);
  }

  return supabaseClientSingletong;
}
