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
      requested_time TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  // For databases created before this column existed:
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS requested_time TIMESTAMPTZ`;
  initialized = true;
}
