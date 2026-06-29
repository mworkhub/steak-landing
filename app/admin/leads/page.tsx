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

  const total       = leads.length;
  const newCount    = leads.filter((l) => l.status === "new").length;
  const inProgress  = leads.filter((l) => l.status === "in_progress").length;
  const doneCount   = leads.filter((l) => l.status === "done").length;

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans">

      {/* ── Header ── */}
      <header className="bg-ink-800 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="leading-none select-none flex items-baseline gap-[1px]">
              <span className="font-mono text-[0.9375rem] font-bold tracking-[0.08em] uppercase text-white">
                STEAK
              </span>
              <span className="font-mono text-[0.8125rem] text-gold/55">./</span>
            </span>
            <span className="w-px h-4 bg-white/10 hidden sm:block" />
            <span className="text-[0.8125rem] text-white/35 hidden sm:block">Leads CRM</span>
          </div>
          <span className="text-[0.75rem] text-white/20 tabular-nums">
            {new Date().toLocaleDateString("uk-UA", {
              day: "2-digit", month: "long", year: "numeric", timeZone: "Europe/Kyiv",
            })}
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Title ── */}
        <div className="mb-8">
          <h1 className="font-serif text-2xl font-bold text-ink-800 mb-1">
            Заявки з лендінгу
          </h1>
          <p className="text-[0.875rem] text-ink-300">
            Сортуються від нових до старих · оновлюється при кожному завантаженні
          </p>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard label="Всього"    value={total}      />
          <StatCard label="Нові"      value={newCount}    accent="gold"    />
          <StatCard label="В обробці" value={inProgress}  accent="blue"    />
          <StatCard label="Виконано"  value={doneCount}   accent="green"   />
        </div>

        {/* ── Table or Empty ── */}
        {leads.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="bg-white border border-ink-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-ink-800 text-left">
                    {[
                      { label: "№",          w: "w-10"  },
                      { label: "Ім'я",       w: ""      },
                      { label: "Телефон",    w: ""      },
                      { label: "Сайт / Інст.", w: ""    },
                      { label: "Коментар",   w: "w-64"  },
                      { label: "Статус",     w: ""      },
                      { label: "Дата",       w: ""      },
                    ].map(({ label, w }) => (
                      <th
                        key={label}
                        className={`px-4 py-3 text-[0.6875rem] font-semibold uppercase
                                    tracking-[0.1em] text-white/45 whitespace-nowrap ${w}`}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-50">
                  {leads.map((lead, index) => (
                    <LeadRow key={lead.id} lead={lead} index={total - index} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 border-t border-ink-50 flex items-center justify-between bg-ink-50/40">
              <span className="text-[0.75rem] text-ink-300">
                Записів: <strong className="text-ink-600">{total}</strong>
              </span>
              <a
                href="/admin/leads"
                className="text-[0.75rem] text-gold hover:text-gold-dark transition-colors"
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

  // Determine if website looks like an Instagram handle or URL
  const websiteDisplay = (() => {
    if (!lead.website) return null;
    const w = lead.website.trim();
    if (w.startsWith("@")) {
      return {
        href: `https://instagram.com/${w.slice(1)}`,
        label: w,
        icon: "ig",
      };
    }
    try {
      const url = new URL(w.startsWith("http") ? w : `https://${w}`);
      return { href: url.href, label: url.hostname.replace("www.", ""), icon: "link" };
    } catch {
      return { href: `https://${w}`, label: w, icon: "link" };
    }
  })();

  return (
    <tr className="hover:bg-cream-light/60 transition-colors duration-100">
      {/* № */}
      <td className="px-4 py-3.5 text-ink-300 tabular-nums text-xs">{index}</td>

      {/* Name */}
      <td className="px-4 py-3.5 font-semibold text-ink-700 whitespace-nowrap">
        {lead.name}
      </td>

      {/* Phone */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        <a
          href={`tel:${lead.phone.replace(/\s/g, "")}`}
          className="text-gold hover:text-gold-dark transition-colors underline underline-offset-2 font-medium"
        >
          {lead.phone}
        </a>
      </td>

      {/* Website / Instagram */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        {websiteDisplay ? (
          <a
            href={websiteDisplay.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[0.8125rem] text-ink-500
                       hover:text-gold transition-colors underline underline-offset-2"
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
          <span className="text-ink-200 text-xs">—</span>
        )}
      </td>

      {/* Comment */}
      <td className="px-4 py-3.5 text-ink-400 max-w-[260px]">
        <span className="line-clamp-2 text-[0.8125rem] leading-snug">
          {lead.comment || <span className="text-ink-200">—</span>}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        <StatusBadge status={lead.status} />
      </td>

      {/* Date */}
      <td className="px-4 py-3.5 text-ink-300 whitespace-nowrap tabular-nums text-xs">
        {date}
      </td>
    </tr>
  );
}

// ─── StatusBadge ───────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<LeadStatus, { label: string; cls: string; dot: string }> = {
  new:         { label: "Новий",    cls: "bg-amber-50 text-amber-700 border border-amber-200",   dot: "bg-amber-400"   },
  in_progress: { label: "В обробці", cls: "bg-blue-50 text-blue-700 border border-blue-200",     dot: "bg-blue-400"    },
  done:        { label: "Виконано", cls: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-400" },
};

function StatusBadge({ status }: { status: LeadStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.new;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── StatCard ──────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "gold" | "blue" | "green";
}) {
  const colorMap: Record<string, string> = {
    gold:  "text-gold",
    blue:  "text-blue-600",
    green: "text-emerald-600",
  };
  const color = accent ? (colorMap[accent] ?? "text-ink-800") : "text-ink-800";

  return (
    <div className="bg-white border border-ink-100 px-5 py-4 shadow-sm">
      <div className={`font-serif text-[2rem] font-bold leading-none mb-1.5 ${color}`}>
        {value}
      </div>
      <div className="text-[0.6875rem] text-ink-300 uppercase tracking-[0.1em]">{label}</div>
    </div>
  );
}

// ─── EmptyState ────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="bg-white border border-ink-100 flex flex-col items-center justify-center py-20 text-center shadow-sm">
      <div className="w-14 h-14 border border-ink-100 flex items-center justify-center mb-5 text-ink-200">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M3 10h18M8 4v6M16 4v6" />
        </svg>
      </div>
      <p className="font-serif text-lg font-semibold text-ink-600 mb-2">Заявок ще немає</p>
      <p className="text-sm text-ink-300 max-w-xs leading-relaxed">
        Якщо таблиця щойно створена — заявки з'являться тут одразу після першого сабміту форми.
      </p>
      <p className="mt-4 text-xs text-ink-200">
        Перевірте що SQL-міграція виконана в Supabase Dashboard → SQL Editor
      </p>
    </div>
  );
}
