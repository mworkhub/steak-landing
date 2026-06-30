import { createServerClient } from "@/lib/supabase/server";
import type { Lead, LeadStatus } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

// ─── Data ──────────────────────────────────────────────────────────────────

async function getLeads(): Promise<Lead[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("leads")
    .select("id, name, phone, website, comment, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Admin/Leads] Supabase error:", error.message);
    return [];
  }

  return (data ?? []) as Lead[];
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  const total      = leads.length;
  const newCount   = leads.filter((l) => l.status === "new").length;
  const inProgress = leads.filter((l) => l.status === "in_progress").length;
  const doneCount  = leads.filter((l) => l.status === "done").length;

  return (
    <div className="min-h-screen bg-[#120E0B] font-sans">

      {/* ── Header ── */}
      <header className="bg-[#0e0b08] border-b border-amber-900/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/admin" className="leading-none select-none flex items-baseline gap-[1px]">
              <span className="font-mono text-[0.9375rem] font-black tracking-[0.08em] uppercase text-white">СТЕК</span>
              <span className="font-mono text-[0.8125rem] text-[#FF6B00]/50">./</span>
            </a>
            <span className="w-px h-4 bg-amber-900/40 hidden sm:block" />
            <span className="text-[0.75rem] text-amber-100/25 hidden sm:block">Leads CRM</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[0.6875rem] text-amber-100/15 tabular-nums hidden sm:block">
              {new Date().toLocaleDateString("uk-UA", {
                day: "2-digit", month: "long", year: "numeric", timeZone: "Europe/Kyiv",
              })}
            </span>
            <a
              href="/admin"
              className="flex items-center gap-1.5 text-[0.75rem] text-amber-100/30
                         hover:text-amber-100/70 transition-colors"
            >
              ← Адмін панель
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Title ── */}
        <div className="mb-8">
          <span className="text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-[#FF6B00] block mb-2">
            Leads CRM
          </span>
          <h1 className="font-black text-[1.75rem] uppercase tracking-tight text-white">
            Заявки з лендінгу
          </h1>
          <p className="text-[0.8125rem] text-amber-100/25 mt-1">
            Сортуються від нових до старих · оновлюється при кожному завантаженні
          </p>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Всього",    value: total,      cls: "text-white"     },
            { label: "Нові",      value: newCount,   cls: "text-amber-400" },
            { label: "В обробці", value: inProgress, cls: "text-blue-400"  },
            { label: "Виконано",  value: doneCount,  cls: "text-[#FF6B00]" },
          ].map((s) => (
            <div key={s.label}
                 className="bg-[#1a1412] border border-amber-900/25 px-5 py-4
                            hover:border-[#FF6B00]/30 transition-colors">
              <div className={`text-[2rem] font-black leading-none mb-1.5 ${s.cls}`}>{s.value}</div>
              <div className="text-[0.6875rem] text-amber-100/25 uppercase tracking-[0.1em]">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Table or Empty ── */}
        {leads.length === 0 ? (
          <div className="bg-[#1a1412] border border-amber-900/25 flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 border border-amber-900/30 flex items-center justify-center mb-5 text-amber-100/15">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M3 10h18M8 4v6M16 4v6" />
              </svg>
            </div>
            <p className="text-[1.0625rem] font-black uppercase tracking-tight text-white mb-2">
              Заявок ще немає
            </p>
            <p className="text-[0.8125rem] text-amber-100/30 max-w-xs leading-relaxed">
              З'являться тут одразу після першого сабміту форми на лендінгу.
            </p>
            <p className="mt-4 text-[0.6875rem] text-amber-100/15">
              Перевірте SQL-міграцію в Supabase Dashboard → SQL Editor
            </p>
          </div>
        ) : (
          <div className="bg-[#1a1412] border border-amber-900/25 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0e0b08] border-b border-amber-900/25">
                    {["№", "Ім'я", "Телефон", "Сайт / Інст.", "Коментар", "Статус", "Дата"].map((h) => (
                      <th key={h}
                          className="px-4 py-3 text-left text-[0.625rem] font-bold uppercase
                                     tracking-[0.12em] text-amber-100/28 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-900/15">
                  {leads.map((lead, index) => (
                    <LeadRow key={lead.id} lead={lead} index={total - index} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 border-t border-amber-900/20 flex items-center justify-between">
              <span className="text-[0.75rem] text-amber-100/25">
                Записів: <strong className="text-amber-400 font-black">{total}</strong>
              </span>
              <a
                href="/admin/leads"
                className="text-[0.75rem] text-[#FF6B00]/60 hover:text-[#FF6B00] transition-colors"
              >
                Оновити ↻
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── LeadRow ───────────────────────────────────────────────────────────────

function LeadRow({ lead, index }: { lead: Lead; index: number }) {
  const date = new Date(lead.created_at).toLocaleString("uk-UA", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
    timeZone: "Europe/Kyiv",
  });

  const websiteDisplay = (() => {
    if (!lead.website) return null;
    const w = lead.website.trim();
    if (w.startsWith("@")) {
      return { href: `https://instagram.com/${w.slice(1)}`, label: w, icon: "ig" };
    }
    try {
      const url = new URL(w.startsWith("http") ? w : `https://${w}`);
      return { href: url.href, label: url.hostname.replace("www.", ""), icon: "link" };
    } catch {
      return { href: `https://${w}`, label: w, icon: "link" };
    }
  })();

  return (
    <tr className="hover:bg-[#221a14] transition-colors duration-150">
      <td className="px-4 py-3.5 text-amber-100/20 tabular-nums text-xs">{index}</td>

      <td className="px-4 py-3.5 font-semibold text-white whitespace-nowrap">{lead.name}</td>

      <td className="px-4 py-3.5 whitespace-nowrap">
        <a
          href={`tel:${lead.phone.replace(/\s/g, "")}`}
          className="text-[#FF6B00] hover:underline font-medium"
        >
          {lead.phone}
        </a>
      </td>

      <td className="px-4 py-3.5 whitespace-nowrap">
        {websiteDisplay ? (
          <a
            href={websiteDisplay.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[0.8125rem] text-amber-100/45
                       hover:text-amber-400 transition-colors underline underline-offset-2"
          >
            {websiteDisplay.icon === "ig" ? (
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
                <rect x="2" y="2" width="16" height="16" rx="4.5" />
                <circle cx="10" cy="10" r="3.5" />
                <circle cx="14.5" cy="5.5" r="0.75" fill="currentColor" stroke="none" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
                <path d="M10 3H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-5" />
                <path d="M15 3h2v2M11 9l6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {websiteDisplay.label}
          </a>
        ) : (
          <span className="text-amber-100/15 text-xs">—</span>
        )}
      </td>

      <td className="px-4 py-3.5 text-amber-100/40 max-w-[260px]">
        <span className="line-clamp-2 text-[0.8125rem] leading-snug">
          {lead.comment || <span className="text-amber-100/15">—</span>}
        </span>
      </td>

      <td className="px-4 py-3.5 whitespace-nowrap">
        <StatusBadge status={lead.status} />
      </td>

      <td className="px-4 py-3.5 text-amber-100/25 whitespace-nowrap tabular-nums text-xs">
        {date}
      </td>
    </tr>
  );
}

// ─── StatusBadge ───────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<LeadStatus, { label: string; bg: string; text: string; border: string; dot: string }> = {
  new:         { label: "Новий",     bg: "bg-amber-900/20",  text: "text-amber-400",  border: "border-amber-500/30",  dot: "bg-amber-400"   },
  in_progress: { label: "В обробці", bg: "bg-blue-900/20",   text: "text-blue-400",   border: "border-blue-500/30",   dot: "bg-blue-400"    },
  done:        { label: "Виконано",  bg: "bg-orange-900/20", text: "text-orange-400", border: "border-orange-500/30", dot: "bg-[#FF6B00]"   },
};

function StatusBadge({ status }: { status: LeadStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.new;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[0.6875rem] font-bold
                      border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
