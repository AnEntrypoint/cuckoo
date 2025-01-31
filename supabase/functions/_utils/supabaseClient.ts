import { createClient } from "https://esm.sh/@supabase/supabase-js@2.10.0";
import { getEnvironmentVariable } from "./environment.ts";

const supabaseUrl = getEnvironmentVariable("SUPABASE_URL");
const supabaseAnonKey = getEnvironmentVariable("SUPABASE_ANON_KEY");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
