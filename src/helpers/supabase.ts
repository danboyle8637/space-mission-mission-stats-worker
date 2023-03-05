import { createClient } from "@supabase/supabase-js";

import { Env, Database } from "../types";

export const db = (env: Env) =>
  createClient<Database>(env.SUPA_DB_URL, env.SUPA_DB_KEY);
