import { sql } from "@vercel/postgres";
import { ensureTable } from "../../../lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/orders            -> pending orders, ordered by requested time
// GET /api/orders?status=done -> completed orders (history), newest first
export async function GET(request) {
  await ensureTable();
  const status = new URL(request.url).searchParams.get("status");

  if (status === "done") {
    const { rows } = await sql`
      SELECT id, customer_name, items, status, requested_time, created_at
      FROM orders
      WHERE status = 'done'
      ORDER BY created_at DESC
      LIMIT 200
    `;
    return NextResponse.json(rows);
  }

  // Pending: order by the time the customer asked for (nulls = "now", treated as creation time)
  const { rows } = await sql`
    SELECT id, customer_name, items, status, requested_time, created_at
    FROM orders
    WHERE status = 'pending'
    ORDER BY COALESCE(requested_time, created_at) ASC
  `;
  return NextResponse.json(rows);
}

// POST /api/orders -> { customerName, items, requestedTime? (ISO string or null) }
export async function POST(request) {
  await ensureTable();
  const body = await request.json();
  const customerName = (body.customerName || "").trim() || "Cliente";
  const items = Array.isArray(body.items) ? body.items : [];
  const requestedTime = body.requestedTime || null; // ISO string or null = "now"
  if (items.length === 0) {
    return NextResponse.json({ error: "No items" }, { status: 400 });
  }
  const { rows } = await sql`
    INSERT INTO orders (customer_name, items, requested_time)
    VALUES (${customerName}, ${JSON.stringify(items)}, ${requestedTime})
    RETURNING id, customer_name, items, status, requested_time, created_at
  `;
  return NextResponse.json(rows[0], { status: 201 });
}
