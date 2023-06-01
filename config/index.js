"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase_client = exports.dbConfig = void 0;
var supabase_js_1 = require("@supabase/supabase-js");
var env_1 = require("@next/env");
(0, env_1.loadEnvConfig)("");
var client = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_PRIVATE_KEY);
exports.supabase_client = client;
var dbConfig = {
    client: client,
    tableName: "documents",
    embeddingColumnName: "embedding",
    queryName: "match_documents",
};
exports.dbConfig = dbConfig;
