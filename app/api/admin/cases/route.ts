import { createServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await createServerClient()
    .from("cases")
    .select("*")
    .order("created_at", { ascending: false });

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
    .from("cases")
    .insert({
      title:        body.title,
      description:  body.description  ?? null,
      client_niche: body.client_niche ?? null,
      location:     body.location     ?? null,
      project_type: body.project_type ?? null,
      highlight:    body.highlight    ?? null,
      stats_text:   body.stats_text   ?? null,
      mockup_type:  body.mockup_type  ?? "landing",
      accent_color: body.accent_color ?? "#C9A87C",
      image_url:    body.image_url    ?? null,
      project_link: body.project_link ?? null,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
