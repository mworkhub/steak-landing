import { createServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await createServerClient()
    .from("calc_types")
    .select("*")
    .order("sort_order");
  if (error) {
    if (error.message.includes("schema cache") || error.message.includes("does not exist")) {
      return NextResponse.json([]);
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await createServerClient()
    .from("calc_types")
    .insert({
      label:       body.label,
      description: body.description ?? null,
      base_price:  Number(body.base_price) || 0,
      duration:    body.duration    ?? null,
      sort_order:  Number(body.sort_order) || 0,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
