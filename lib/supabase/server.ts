import { createClient } from "@supabase/supabase-js";

// Повертає raw SupabaseClient без Database-generic.
// Причина: кастомні Database-типи (не згенеровані через "supabase gen types")
// конфліктують з complex-generic chain у .insert() / .select() і дають
// помилку "never[]". Типізацію результатів виконуємо явно через "as Lead[]"
// де потрібно — це чесніше, ніж боротися з TypeScript-inference.
//
// Якщо хочете повну типобезпеку — запустіть:
//   npx supabase gen types typescript --project-id YOUR_PROJECT_ID \
//     > lib/supabase/database.types.ts
// і передайте отриманий тип у createClient<Database>.

export function createServerClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Відсутні змінні SUPABASE_URL або SUPABASE_SERVICE_ROLE_KEY. " +
        "Перевірте файл .env.local"
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
