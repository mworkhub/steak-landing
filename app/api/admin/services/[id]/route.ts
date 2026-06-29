import { createServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { data, error } = await createServerClient()
    .from("services")
    .update({
      title:       body.title,
      description: body.description  ?? null,
      price_from:  Number(body.price_from)  || 0,
      duration:    body.duration     ?? null,
      icon_key:    body.icon_key     ?? "landing",
      features:    Array.isArray(body.features) ? body.features : [],
      sort_order:  Number(body.sort_order)  || 0,
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
    .from("services").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
