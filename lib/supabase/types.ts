// Типи для таблиці leads.
// Щоб згенерувати повні типи всіх таблиць автоматично — запустіть:
//   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/database.types.ts

export type LeadStatus = "new" | "in_progress" | "done";

export interface Lead {
  id:         string;
  name:       string;
  phone:      string;
  website:    string | null;
  comment:    string | null;
  status:     LeadStatus;
  created_at: string; // ISO 8601
}

// Database-тип для createClient<Database>().
// Структура відповідає GenericTable з @supabase/postgrest-js:
// обов'язкові поля: Row, Insert, Update, Relationships.
export interface Database {
  public: {
    Tables: {
      leads: {
        Row: Lead;
        Insert: {
          id?:         string;
          name:        string;
          phone:       string;
          website?:    string | null;
          comment?:    string | null;
          status?:     LeadStatus;
          created_at?: string;
        };
        Update: {
          id?:         string;
          name?:       string;
          phone?:      string;
          website?:    string | null;
          comment?:    string | null;
          status?:     LeadStatus;
          created_at?: string;
        };
        // Таблиця leads не має зовнішніх ключів
        Relationships: [];
      };
    };
    // Порожні схеми — {} сумісний з Record<string, GenericView | GenericFunction>
    Views:     { [_ in never]: never };
    Functions: { [_ in never]: never };
  };
}
