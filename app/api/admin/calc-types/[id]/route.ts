import { createServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { data, error } = await createServerClient()
    .from("calc_types")
    .update({
      label:       body.label,
      description: body.description ?? null,
      base_price:  Number(body.base_price) || 0,
      duration:    body.duration    ?? null,
      sort_order:  Number(body.sort_order) || 0,
    })
    .eq("id", params.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await createServerClient()
    .from("calc_types").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
