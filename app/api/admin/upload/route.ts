import { createServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

const BUCKET = "case-images";
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = new Set([
  "image/jpeg", "image/jpg", "image/png", "image/webp",
  "image/gif", "image/avif", "image/svg+xml", "image/heic",
  "image/heif", "image/bmp", "image/tiff",
]);

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Поле 'file' відсутнє" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: `Тип файлу не підтримується: ${file.type}` },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `Файл занадто великий (максимум 10 МБ, у вас ${(file.size / 1024 / 1024).toFixed(1)} МБ)` },
      { status: 400 }
    );
  }

  // Build unique filename preserving extension
  const originalExt = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `${randomUUID()}.${originalExt}`;

  const supabase = createServerClient();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    // Give a helpful hint if the bucket doesn't exist yet
    const hint = uploadError.message.includes("not found") || uploadError.message.includes("does not exist")
      ? ' Переконайтеся що в Supabase Storage є публічний бакет "case-images".'
      : "";
    return NextResponse.json(
      { error: uploadError.message + hint },
      { status: 500 }
    );
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);

  return NextResponse.json({ url: data.publicUrl });
}
