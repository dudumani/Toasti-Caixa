import { sql } from "@vercel/postgres";
import { ensureTable } from "../../../lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/orders  -> all pending orders (oldest first)
export async function GET() {
  await ensureTable();
  const { rows } = await sql`
    SELECT id, customer_name, items, status, created_at
    FROM orders
    WHERE status = 'pending'
    ORDER BY created_at ASC
  `;
  return NextResponse.json(rows);
}

// POST /api/orders  -> create order { customerName, items: [{id,name,qty}] }
export async function POST(request) {
  await ensureTable();
  const body = await request.json();
  const customerName = (body.customerName || "").trim() || "Guest";
  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "No items" }, { status: 400 });
  }
  const { rows } = await sql`
    INSERT INTO orders (customer_name, items)
    VALUES (${customerName}, ${JSON.stringify(items)})
    RETURNING id, customer_name, items, status, created_at
  `;
  return NextResponse.json(rows[0], { status: 201 });
}
