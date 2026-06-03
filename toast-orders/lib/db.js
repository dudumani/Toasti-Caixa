import { sql } from "@vercel/postgres";

let initialized = false;

export async function ensureTable() {
  if (initialized) return;
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      customer_name TEXT NOT NULL,
      items JSONB NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  initialized = true;
}
