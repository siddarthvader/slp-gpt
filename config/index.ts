import { createClient } from "@supabase/supabase-js";
import { loadEnvConfig } from "@next/env";

loadEnvConfig("");

const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_PRIVATE_KEY!
);

const dbConfig = {
  client,
  tableName: "documents",
  embeddingColumnName: "embedding",
  queryName: "match_documents",
};

export { dbConfig, client as supabase_client };
