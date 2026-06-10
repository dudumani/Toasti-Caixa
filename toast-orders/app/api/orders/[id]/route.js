import { sql } from "@vercel/postgres";
import { ensureTable } from "../../../../lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// PATCH /api/orders/:id  -> mark as done
export async function PATCH(request, { params }) {
  await ensureTable();
  const id = parseInt(params.id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Bad id" }, { status: 400 });
  }
  await sql`UPDATE orders SET status = 'done' WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
