import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("leads")
    .select("id, name, phone, website, comment, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    if (error.message.includes("schema cache") || error.message.includes("does not exist")) {
      return NextResponse.json([]);
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}
