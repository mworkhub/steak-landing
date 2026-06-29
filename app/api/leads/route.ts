// ВАЖЛИВО: перед деплоєм виконайте у Supabase SQL Editor:
//   ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS website text;

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

interface LeadPayload {
  name:     string;
  phone:    string;
  website?: string;
  comment?: string;
}

export async function POST(req: NextRequest) {

  // 1. Parse body
  let body: LeadPayload;
  try {
    body = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json(
      { error: "Невалідний JSON у тілі запиту" },
      { status: 400 }
    );
  }

  const { name, phone, website, comment } = body;

  // 2. Server-side validation
  if (!name?.trim() || name.trim().length < 2) {
    return NextResponse.json(
      { error: "Поле name обов'язкове (мінімум 2 символи)" },
      { status: 422 }
    );
  }

  const phoneDigits = phone?.replace(/\D/g, "") ?? "";
  if (phoneDigits.length < 10) {
    return NextResponse.json(
      { error: "Поле phone обов'язкове (мінімум 10 цифр)" },
      { status: 422 }
    );
  }

  // 3. Insert into Supabase
  const supabase = createServerClient();

  const { error: dbError } = await supabase.from("leads").insert({
    name:    name.trim(),
    phone:   phone.trim(),
    website: website?.trim() || null,
    comment: comment?.trim() || null,
    // status defaults to 'new' at DB level
  });

  if (dbError) {
    console.error("[Leads API] Supabase insert error:", dbError.message);
    return NextResponse.json(
      { error: "Помилка збереження. Спробуйте ще раз." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
