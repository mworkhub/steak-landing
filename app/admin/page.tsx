"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type LeadStatus = "new" | "in_progress" | "done";

interface Lead {
  id: string; name: string; phone: string;
  website: string | null; comment: string | null;
  status: LeadStatus; created_at: string;
}

interface CaseRow {
  id: string; title: string; description: string | null;
  client_niche: string | null; location: string | null;
  project_type: string | null; highlight: string | null;
  stats_text: string | null; mockup_type: string | null;
  accent_color: string | null; image_url: string | null;
  project_link: string | null; created_at: string;
}

interface ServiceRow {
  id: string; title: string; description: string | null;
  price_from: number; duration: string | null; icon_key: string;
  features: string[]; sort_order: number;
}

interface CalcType {
  id: string; label: string; description: string | null;
  base_price: number; duration: string | null; sort_order: number;
}

interface CalcAddon {
  id: string; label: string; price: number; sort_order: number;
}

interface FaqItem {
  id: string; question: string; answer: string; sort_order: number;
}

type Tab = "leads" | "cases" | "services" | "calculator" | "faq";

// ─── Config ──────────────────────────────────────────────────────────────────

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "admin123";

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "new",         label: "Новий"     },
  { value: "in_progress", label: "В обробці" },
  { value: "done",        label: "Виконано"  },
];

const STATUS_STYLE: Record<LeadStatus, { bg: string; text: string; border: string; dot: string }> = {
  new:         { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-400"   },
  in_progress: { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    dot: "bg-blue-400"    },
  done:        { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-400" },
};

const ICON_KEYS = ["landing", "corporate", "catalog", "crm"] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("uk-UA", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "Europe/Kyiv",
  });
}

function fmtWebsite(w: string | null) {
  if (!w) return null;
  const t = w.trim();
  if (t.startsWith("@")) return { href: `https://instagram.com/${t.slice(1)}`, label: t };
  try {
    const url = new URL(t.startsWith("http") ? t : `https://${t}`);
    return { href: url.href, label: url.hostname.replace("www.", "") };
  } catch { return { href: `https://${t}`, label: t }; }
}

// Generic CRUD helpers
async function apiFetch<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  return authed
    ? <Dashboard onLogout={() => setAuthed(false)} />
    : <LoginScreen onLogin={() => setAuthed(true)} />;
}

// ─── Login ───────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw]     = useState("");
  const [show, setShow] = useState(false);
  const [shake, setShake] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { onLogin(); }
    else { setShake(true); setTimeout(() => setShake(false), 600); }
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-baseline gap-[2px] justify-center mb-10 select-none">
          <span className="font-mono text-[1.125rem] font-bold tracking-[0.08em] uppercase text-white">STEAK</span>
          <span className="font-mono text-sm text-[#C9A87C]/55">./</span>
        </div>
        <p className="text-center text-xs text-white/30 tracking-[0.1em] uppercase mb-6">Адмін панель</p>
        <form onSubmit={submit} className={shake ? "animate-[shake_0.5s_ease]" : ""}>
          <div className="mb-4">
            <label className="block text-[0.6875rem] text-white/35 tracking-[0.1em] uppercase mb-2">Пароль</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"} value={pw}
                onChange={(e) => setPw(e.target.value)} autoFocus placeholder="••••••••"
                className={`w-full bg-white/[0.04] border px-4 py-3 text-white text-sm
                            placeholder-white/15 focus:outline-none transition-colors
                            ${shake ? "border-red-500/60" : "border-white/[0.08] focus:border-[#C9A87C]/50"}`}
              />
              <button type="button" tabIndex={-1} onClick={() => setShow(!show)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                  {show
                    ? <><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"/><circle cx="10" cy="10" r="2.5"/><path d="M3 3l14 14"/></>
                    : <><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"/><circle cx="10" cy="10" r="2.5"/></>
                  }
                </svg>
              </button>
            </div>
            {shake && <p className="mt-1.5 text-[0.75rem] text-red-400">Невірний пароль</p>}
          </div>
          <button type="submit"
                  className="w-full py-3 bg-[#C9A87C] text-[#0C0C0C] text-sm font-bold
                             tracking-[0.05em] uppercase hover:bg-[#b8976b] transition-colors">
            Увійти
          </button>
        </form>
        <p className="mt-8 text-center text-[0.625rem] text-white/14">© {new Date().getFullYear()} STEAK./</p>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("leads");
  const [seeding, setSeeding] = useState(false);

  async function handleSeed() {
    if (!confirm("Завантажити дані з сайту в БД? Таблиці, які вже мають записи, не будуть перезаписані.")) return;
    setSeeding(true);
    try {
      const res = await apiFetch<{ seeded: string[]; skipped: string[]; errors: Record<string, string> }>("/api/admin/seed", { method: "POST" });
      const msg = [
        res.seeded.length  ? `✓ Додано: ${res.seeded.join(", ")}`  : "",
        res.skipped.length ? `→ Пропущено (вже є): ${res.skipped.join(", ")}` : "",
        Object.keys(res.errors).length ? `✗ Помилки: ${JSON.stringify(res.errors)}` : "",
      ].filter(Boolean).join("\n");
      alert(msg || "Готово");
    } catch (e) { alert(e instanceof Error ? e.message : "Помилка"); }
    finally { setSeeding(false); }
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: "leads",      label: "Ліди"          },
    { id: "cases",      label: "Кейси"         },
    { id: "services",   label: "Послуги"        },
    { id: "calculator", label: "Калькулятор"   },
    { id: "faq",        label: "FAQ"            },
  ];

  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col">
      <header className="bg-[#0C0C0C] border-b border-white/[0.06] shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-baseline gap-[2px] select-none">
              <span className="font-mono text-[0.9375rem] font-bold tracking-[0.08em] uppercase text-white">STEAK</span>
              <span className="font-mono text-[0.8125rem] text-[#C9A87C]/55">./</span>
            </span>
            <span className="w-px h-4 bg-white/10 hidden sm:block" />
            <span className="text-[0.8125rem] text-white/35 hidden sm:block">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleSeed} disabled={seeding}
                    className="flex items-center gap-1.5 text-[0.75rem] text-[#C9A87C]/70 hover:text-[#C9A87C] disabled:opacity-40 transition-colors border border-[#C9A87C]/20 hover:border-[#C9A87C]/40 px-3 py-1.5"
                    title="Заповнити порожні таблиці даними з сайту">
              {seeding
                ? <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/></svg>
                : <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10 3v4m0 0l-2-2m2 2l2-2M4 10H2m2.93-4.07L3.51 4.51M10 17v-4m0 0l-2 2m2-2l2 2M16 10h2m-2.93-4.07l1.42-1.42M4.93 14.07l-1.42 1.42M15.07 14.07l1.42 1.42"/></svg>
              }
              Seed
            </button>
            <span className="text-[0.6875rem] text-white/20 tabular-nums hidden sm:block">
              {new Date().toLocaleDateString("uk-UA", { day: "2-digit", month: "long", year: "numeric", timeZone: "Europe/Kyiv" })}
            </span>
            <button onClick={onLogout}
                    className="flex items-center gap-1.5 text-[0.75rem] text-white/35 hover:text-white/70 transition-colors">
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 10H3m0 0l3-3m-3 3l3 3M8 6V5a2 2 0 012-2h6a2 2 0 012 2v10a2 2 0 01-2 2h-6a2 2 0 01-2-2v-1"/>
              </svg>
              Вийти
            </button>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200 shrink-0 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex min-w-max">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                      className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                        tab === t.id
                          ? "border-[#C9A87C] text-gray-900"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}>
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tab === "leads"      && <LeadsTab />}
        {tab === "cases"      && <CasesTab />}
        {tab === "services"   && <ServicesTab />}
        {tab === "calculator" && <CalculatorTab />}
        {tab === "faq"        && <FaqTab />}
      </main>
    </div>
  );
}

// ─── Leads Tab ────────────────────────────────────────────────────────────────

function LeadsTab() {
  const [leads, setLeads]     = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setErr(null);
    try { setLeads(await apiFetch<Lead[]>("/api/admin/leads")); }
    catch (e) { setErr(e instanceof Error ? e.message : "Помилка"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: LeadStatus) => {
    const prev = leads;
    setLeads(leads.map((l) => (l.id === id ? { ...l, status } : l)));
    try { await apiFetch(`/api/admin/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }); }
    catch { setLeads(prev); alert("Помилка оновлення статусу"); }
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Видалити заявку від «${name}»?`)) return;
    const prev = leads;
    setLeads(leads.filter((l) => l.id !== id));
    try { await apiFetch(`/api/admin/leads/${id}`, { method: "DELETE" }); }
    catch { setLeads(prev); alert("Помилка видалення"); }
  };

  const total = leads.length;

  return (
    <div>
      <PageHeader
        title="Заявки з лендінгу"
        sub="Від нових до старих"
        action={<RefreshBtn onClick={load} />}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Всього",    value: total,                                              cls: "text-gray-900"    },
          { label: "Нові",      value: leads.filter(l => l.status === "new").length,        cls: "text-amber-600"   },
          { label: "В обробці", value: leads.filter(l => l.status === "in_progress").length, cls: "text-blue-600"    },
          { label: "Виконано",  value: leads.filter(l => l.status === "done").length,        cls: "text-emerald-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 px-5 py-4 shadow-sm">
            <div className={`text-[2rem] font-bold leading-none mb-1.5 ${s.cls}`}>{s.value}</div>
            <div className="text-[0.6875rem] text-gray-400 uppercase tracking-[0.1em]">{s.label}</div>
          </div>
        ))}
      </div>

      {loading ? <Spinner /> : err ? <ErrorBox msg={err} onRetry={load} /> : leads.length === 0 ? (
        <EmptyBox title="Заявок ще немає" sub="З'являться після першого сабміту форми на лендінгу" />
      ) : (
        <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0C0C0C]">
                  {["№", "Ім'я", "Телефон", "Сайт / Інст.", "Коментар", "Статус", "Дата", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-white/40 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.map((lead, idx) => {
                  const ws = fmtWebsite(lead.website);
                  const sc = STATUS_STYLE[lead.status];
                  return (
                    <tr key={lead.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 py-3.5 text-gray-300 tabular-nums text-xs">{total - idx}</td>
                      <td className="px-4 py-3.5 font-semibold text-gray-800 whitespace-nowrap">{lead.name}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <a href={`tel:${lead.phone.replace(/\s/g,"")}`} className="text-[#C9A87C] hover:underline font-medium">{lead.phone}</a>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {ws ? (
                          <a href={ws.href} target="_blank" rel="noopener noreferrer"
                             className="text-xs text-gray-500 hover:text-[#C9A87C] underline underline-offset-2 transition-colors">{ws.label}</a>
                        ) : <span className="text-gray-200 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3.5 text-gray-400 max-w-[220px]">
                        <span className="line-clamp-2 text-xs leading-snug">{lead.comment ?? <span className="text-gray-200">—</span>}</span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${sc.bg} ${sc.text} ${sc.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${sc.dot}`} />
                          <select value={lead.status} onChange={(e) => updateStatus(lead.id, e.target.value as LeadStatus)}
                                  className={`bg-transparent cursor-pointer focus:outline-none ${sc.text}`}>
                            {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                          </select>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-300 whitespace-nowrap tabular-nums text-xs">{fmtDate(lead.created_at)}</td>
                      <td className="px-4 py-3.5">
                        <button onClick={() => remove(lead.id, lead.name)} className="text-gray-200 hover:text-red-400 transition-colors" title="Видалити">
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-50 bg-gray-50/40 text-xs text-gray-400">
            Записів: <strong className="text-gray-600">{total}</strong>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Cases Tab ────────────────────────────────────────────────────────────────

const EMPTY_CASE = {
  title: "", description: "", client_niche: "",
  location: "", project_type: "", highlight: "",
  stats_text: "", mockup_type: "landing", accent_color: "#C9A87C",
  image_url: "", project_link: "",
};
type CaseForm = typeof EMPTY_CASE;

const MOCKUP_TYPE_OPTIONS = ["landing", "shop", "corporate", "catalog", "crm"] as const;

function CasesTab() {
  const [items, setItems]     = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState<string | null>(null);
  const [modal, setModal]     = useState<{ open: boolean; editing: CaseRow | null }>({ open: false, editing: null });
  const [form, setForm]       = useState<CaseForm>(EMPTY_CASE);
  const [saving, setSaving]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setErr(null);
    try { setItems(await apiFetch<CaseRow[]>("/api/admin/cases")); }
    catch (e) { setErr(e instanceof Error ? e.message : "Помилка"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openAdd() { setForm(EMPTY_CASE); setModal({ open: true, editing: null }); }
  function openEdit(c: CaseRow) {
    setForm({
      title:        c.title         ?? "",
      description:  c.description   ?? "",
      client_niche: c.client_niche  ?? "",
      location:     c.location      ?? "",
      project_type: c.project_type  ?? "",
      highlight:    c.highlight     ?? "",
      stats_text:   c.stats_text    ?? "",
      mockup_type:  c.mockup_type   ?? "landing",
      accent_color: c.accent_color  ?? "#C9A87C",
      image_url:    c.image_url     ?? "",
      project_link: c.project_link  ?? "",
    });
    setModal({ open: true, editing: c });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const body = {
        title:        form.title.trim(),
        description:  form.description.trim()  || null,
        client_niche: form.client_niche.trim() || null,
        location:     form.location.trim()     || null,
        project_type: form.project_type.trim() || null,
        highlight:    form.highlight.trim()    || null,
        stats_text:   form.stats_text.trim()   || null,
        mockup_type:  form.mockup_type         || "landing",
        accent_color: form.accent_color        || "#C9A87C",
        image_url:    form.image_url.trim()    || null,
        project_link: form.project_link.trim() || null,
      };
      if (modal.editing) {
        const updated = await apiFetch<CaseRow>(`/api/admin/cases/${modal.editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        setItems((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      } else {
        const created = await apiFetch<CaseRow>("/api/admin/cases", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        setItems((prev) => [created, ...prev]);
      }
      setModal({ open: false, editing: null });
    } catch (e) { alert(e instanceof Error ? e.message : "Помилка"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Видалити кейс «${title}»?`)) return;
    const prev = items;
    setItems(items.filter((c) => c.id !== id));
    try { await apiFetch(`/api/admin/cases/${id}`, { method: "DELETE" }); }
    catch { setItems(prev); alert("Помилка видалення"); }
  }

  const FIELDS: { key: keyof CaseForm; label: string; placeholder: string; required?: boolean; textarea?: boolean; select?: string[] }[] = [
    { key: "title",        label: "Назва клієнта",    placeholder: "KitchenBox",                       required: true },
    { key: "client_niche", label: "Ніша",             placeholder: "Кухні на замовлення"                              },
    { key: "location",     label: "Локація / ніша",   placeholder: "Київ · кухні на замовлення"                       },
    { key: "project_type", label: "Тип проекту",      placeholder: "Лендінг"                                          },
    { key: "highlight",    label: "Ключова метрика",  placeholder: "6.3% конверсія"                                   },
    { key: "description",  label: "Опис",             placeholder: "Результати, ключові цифри...",      textarea: true  },
    { key: "stats_text",   label: "Статистика (3 рядки: значення|підпис)", placeholder: "6.3%|конверсія лідів\n7 дн.|до запуску\n$1.1|ціна ліда", textarea: true },
    { key: "mockup_type",  label: "Тип мокапу",       placeholder: "landing",                           select: [...MOCKUP_TYPE_OPTIONS] },
    { key: "accent_color", label: "Акцентний колір",  placeholder: "#C9A87C"                                          },
    { key: "image_url",    label: "URL зображення",   placeholder: "https://..."                                       },
    { key: "project_link", label: "Посилання",        placeholder: "https://kitchenbox.ua"                             },
  ];

  return (
    <div>
      <PageHeader title="Кейси / Портфоліо" sub="CRUD · відображаються на сайті"
                  action={<AddBtn label="Додати кейс" onClick={openAdd} />} />

      {loading ? <Spinner /> : err ? <ErrorBox msg={err} onRetry={load} /> : items.length === 0 ? (
        <EmptyBox title="Кейсів ще немає" sub="Натисніть «Додати кейс» щоб створити перший запис" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <div key={c.id} className="bg-white border border-gray-100 shadow-sm flex flex-col overflow-hidden">
              {c.image_url
                ? <div className="h-36 bg-gray-100 shrink-0"><img src={c.image_url} alt={c.title} className="w-full h-full object-cover" /></div>
                : <div className="h-1 shrink-0" style={{ background: c.accent_color ?? "#C9A87C" }} />
              }
              <div className="p-4 flex flex-col flex-1 gap-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  {c.client_niche && <span className="text-[0.625rem] text-amber-600 uppercase tracking-widest font-bold">{c.client_niche}</span>}
                  {c.project_type && <span className="text-[0.625rem] text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded">{c.project_type}</span>}
                </div>
                <h3 className="font-bold text-gray-900 text-[0.9375rem] leading-snug">{c.title}</h3>
                {c.location && <p className="text-[0.6875rem] text-gray-400">{c.location}</p>}
                {c.highlight && <p className="text-[0.75rem] font-semibold" style={{ color: c.accent_color ?? "#C9A87C" }}>{c.highlight}</p>}
                {c.description && <p className="text-xs text-gray-400 line-clamp-2 flex-1">{c.description}</p>}
                {c.mockup_type && <span className="text-[0.625rem] text-gray-300">мокап: {c.mockup_type}</span>}
                {c.project_link && <a href={c.project_link} target="_blank" rel="noopener noreferrer" className="text-[0.6875rem] text-[#C9A87C] hover:underline">{c.project_link.replace(/^https?:\/\/(www\.)?/, "")}</a>}
              </div>
              <div className="flex border-t border-gray-50">
                <button onClick={() => openEdit(c)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors border-r border-gray-50">
                  <EditIcon /> Редагувати
                </button>
                <button onClick={() => handleDelete(c.id, c.title)} className="px-4 flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors">
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.open && (
        <GenericModal heading={modal.editing ? "Редагувати кейс" : "Новий кейс"} onClose={() => setModal({ open: false, editing: null })} onSubmit={handleSave} saving={saving} disabled={!form.title.trim()}>
          {FIELDS.map((f) => (
            <ModalField key={f.key} label={f.label} required={f.required}
              input={f.select
                ? <select value={form[f.key]} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} className={IN_CLS}>
                    {f.select.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                : f.textarea
                ? <textarea value={form[f.key]} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} rows={f.key === "stats_text" ? 4 : 3} className={TA_CLS} />
                : <input type="text" value={form[f.key]} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} required={f.required} className={IN_CLS} />
              }
            />
          ))}
        </GenericModal>
      )}
    </div>
  );
}

// ─── Services Tab ─────────────────────────────────────────────────────────────

const EMPTY_SERVICE = { title: "", description: "", price_from: "200", duration: "7 днів", icon_key: "landing", features: "", sort_order: "0" };
type ServiceForm = typeof EMPTY_SERVICE;

function ServicesTab() {
  const [items, setItems]     = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState<string | null>(null);
  const [modal, setModal]     = useState<{ open: boolean; editing: ServiceRow | null }>({ open: false, editing: null });
  const [form, setForm]       = useState<ServiceForm>(EMPTY_SERVICE);
  const [saving, setSaving]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setErr(null);
    try { setItems(await apiFetch<ServiceRow[]>("/api/admin/services")); }
    catch (e) { setErr(e instanceof Error ? e.message : "Помилка"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openAdd() { setForm(EMPTY_SERVICE); setModal({ open: true, editing: null }); }
  function openEdit(s: ServiceRow) {
    setForm({ title: s.title, description: s.description ?? "", price_from: String(s.price_from), duration: s.duration ?? "", icon_key: s.icon_key, features: (s.features ?? []).join("\n"), sort_order: String(s.sort_order) });
    setModal({ open: true, editing: s });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const body = { title: form.title.trim(), description: form.description.trim() || null, price_from: Number(form.price_from) || 0, duration: form.duration.trim() || null, icon_key: form.icon_key, features: form.features.split("\n").map(s => s.trim()).filter(Boolean), sort_order: Number(form.sort_order) || 0 };
      if (modal.editing) {
        const updated = await apiFetch<ServiceRow>(`/api/admin/services/${modal.editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        setItems((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      } else {
        const created = await apiFetch<ServiceRow>("/api/admin/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        setItems((prev) => [...prev, created].sort((a, b) => a.sort_order - b.sort_order));
      }
      setModal({ open: false, editing: null });
    } catch (e) { alert(e instanceof Error ? e.message : "Помилка"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Видалити послугу «${title}»?`)) return;
    const prev = items;
    setItems(items.filter((s) => s.id !== id));
    try { await apiFetch(`/api/admin/services/${id}`, { method: "DELETE" }); }
    catch { setItems(prev); alert("Помилка видалення"); }
  }

  function setF(k: keyof ServiceForm, v: string) { setForm((p) => ({ ...p, [k]: v })); }

  return (
    <div>
      <PageHeader title="Послуги" sub="Відображаються на сайті в секції «Що ми робимо»"
                  action={<AddBtn label="Додати послугу" onClick={openAdd} />} />

      {loading ? <Spinner /> : err ? <ErrorBox msg={err} onRetry={load} /> : items.length === 0 ? (
        <EmptyBox title="Послуг ще немає" sub="Сайт показує вбудовані дані. Додайте послуги щоб керувати ними звідси." />
      ) : (
        <div className="space-y-3">
          {items.map((s, idx) => (
            <div key={s.id} className="bg-white border border-gray-100 shadow-sm p-5 flex items-start gap-5">
              <div className="w-8 h-8 rounded bg-gray-50 border border-gray-100 flex items-center justify-center text-[0.625rem] font-bold text-gray-400 shrink-0">
                {String(idx + 1).padStart(2, "0")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h3 className="font-bold text-gray-900">{s.title}</h3>
                  <span className="text-[#C9A87C] font-semibold text-sm shrink-0">від ${s.price_from}</span>
                </div>
                {s.duration && <span className="text-xs text-gray-400 mr-3">{s.duration}</span>}
                <span className="text-xs text-gray-300">icon: {s.icon_key} · порядок: {s.sort_order}</span>
                {s.description && <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">{s.description}</p>}
                {s.features.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {s.features.slice(0, 3).map((f) => (
                      <span key={f} className="text-[0.625rem] bg-gray-50 border border-gray-100 px-2 py-0.5 text-gray-500">{f}</span>
                    ))}
                    {s.features.length > 3 && <span className="text-[0.625rem] text-gray-300">+{s.features.length - 3} ще</span>}
                  </div>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(s)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors border border-gray-100"><EditIcon /></button>
                <button onClick={() => handleDelete(s.id, s.title)} className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors border border-gray-100"><TrashIcon /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.open && (
        <GenericModal heading={modal.editing ? "Редагувати послугу" : "Нова послуга"} onClose={() => setModal({ open: false, editing: null })} onSubmit={handleSave} saving={saving} disabled={!form.title.trim()}>
          <ModalField label="Назва" required input={<input type="text" value={form.title} onChange={e => setF("title", e.target.value)} placeholder="Лендінги для лідогенерації" required className={IN_CLS} />} />
          <div className="grid grid-cols-2 gap-3">
            <ModalField label="Ціна від ($)" input={<input type="number" value={form.price_from} onChange={e => setF("price_from", e.target.value)} placeholder="200" className={IN_CLS} />} />
            <ModalField label="Термін" input={<input type="text" value={form.duration} onChange={e => setF("duration", e.target.value)} placeholder="7 днів" className={IN_CLS} />} />
          </div>
          <ModalField label="Іконка" input={
            <select value={form.icon_key} onChange={e => setF("icon_key", e.target.value)} className={IN_CLS}>
              {ICON_KEYS.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          } />
          <ModalField label="Опис" input={<textarea value={form.description} onChange={e => setF("description", e.target.value)} placeholder="Короткий опис послуги..." rows={3} className={TA_CLS} />} />
          <ModalField label="Переваги (кожна з нового рядка)" input={<textarea value={form.features} onChange={e => setF("features", e.target.value)} placeholder={"Розробка під конкретний оффер\nPageSpeed 95+"} rows={4} className={TA_CLS} />} />
          <ModalField label="Порядок (sort)" input={<input type="number" value={form.sort_order} onChange={e => setF("sort_order", e.target.value)} placeholder="0" className={IN_CLS} />} />
        </GenericModal>
      )}
    </div>
  );
}

// ─── Calculator Tab ───────────────────────────────────────────────────────────

const EMPTY_CALC_TYPE  = { label: "", description: "", base_price: "200",  duration: "7 днів", sort_order: "0" };
const EMPTY_CALC_ADDON = { label: "", price: "80", sort_order: "0" };
type CalcTypeForm  = typeof EMPTY_CALC_TYPE;
type CalcAddonForm = typeof EMPTY_CALC_ADDON;

function CalculatorTab() {
  const [types,    setTypes]    = useState<CalcType[]>([]);
  const [addons,   setAddons]   = useState<CalcAddon[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [err,      setErr]      = useState<string | null>(null);
  const [typeModal,  setTypeModal]  = useState<{ open: boolean; editing: CalcType  | null }>({ open: false, editing: null });
  const [addonModal, setAddonModal] = useState<{ open: boolean; editing: CalcAddon | null }>({ open: false, editing: null });
  const [typeForm,  setTypeForm]  = useState<CalcTypeForm>(EMPTY_CALC_TYPE);
  const [addonForm, setAddonForm] = useState<CalcAddonForm>(EMPTY_CALC_ADDON);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setErr(null);
    try {
      const [t, a] = await Promise.all([
        apiFetch<CalcType[]>("/api/admin/calc-types"),
        apiFetch<CalcAddon[]>("/api/admin/calc-addons"),
      ]);
      setTypes(t); setAddons(a);
    } catch (e) { setErr(e instanceof Error ? e.message : "Помилка"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Type CRUD ──
  async function saveType(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const body = { label: typeForm.label.trim(), description: typeForm.description.trim() || null, base_price: Number(typeForm.base_price) || 0, duration: typeForm.duration.trim() || null, sort_order: Number(typeForm.sort_order) || 0 };
      if (typeModal.editing) {
        const u = await apiFetch<CalcType>(`/api/admin/calc-types/${typeModal.editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        setTypes(prev => prev.map(t => t.id === u.id ? u : t));
      } else {
        const c = await apiFetch<CalcType>("/api/admin/calc-types", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        setTypes(prev => [...prev, c].sort((a, b) => a.sort_order - b.sort_order));
      }
      setTypeModal({ open: false, editing: null });
    } catch (e) { alert(e instanceof Error ? e.message : "Помилка"); }
    finally { setSaving(false); }
  }

  async function deleteType(id: string, label: string) {
    if (!confirm(`Видалити тип «${label}»?`)) return;
    const prev = types;
    setTypes(types.filter(t => t.id !== id));
    try { await apiFetch(`/api/admin/calc-types/${id}`, { method: "DELETE" }); }
    catch { setTypes(prev); alert("Помилка видалення"); }
  }

  // ── Addon CRUD ──
  async function saveAddon(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const body = { label: addonForm.label.trim(), price: Number(addonForm.price) || 0, sort_order: Number(addonForm.sort_order) || 0 };
      if (addonModal.editing) {
        const u = await apiFetch<CalcAddon>(`/api/admin/calc-addons/${addonModal.editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        setAddons(prev => prev.map(a => a.id === u.id ? u : a));
      } else {
        const c = await apiFetch<CalcAddon>("/api/admin/calc-addons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        setAddons(prev => [...prev, c].sort((a, b) => a.sort_order - b.sort_order));
      }
      setAddonModal({ open: false, editing: null });
    } catch (e) { alert(e instanceof Error ? e.message : "Помилка"); }
    finally { setSaving(false); }
  }

  async function deleteAddon(id: string, label: string) {
    if (!confirm(`Видалити опцію «${label}»?`)) return;
    const prev = addons;
    setAddons(addons.filter(a => a.id !== id));
    try { await apiFetch(`/api/admin/calc-addons/${id}`, { method: "DELETE" }); }
    catch { setAddons(prev); alert("Помилка видалення"); }
  }

  if (loading) return <Spinner />;
  if (err)     return <ErrorBox msg={err} onRetry={load} />;

  return (
    <div className="space-y-8">
      <PageHeader title="Калькулятор" sub="Типи проектів та додаткові опції" />

      {/* ── Types ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800">Типи проектів</h2>
          <AddBtn label="Додати тип" onClick={() => { setTypeForm(EMPTY_CALC_TYPE); setTypeModal({ open: true, editing: null }); }} />
        </div>
        {types.length === 0 ? (
          <EmptyBox title="Типів ще немає" sub="Сайт показує вбудовані дані" />
        ) : (
          <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-[#0C0C0C]">
                {["Назва", "Ціна", "Термін", "Порядок", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-white/40">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {types.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-gray-800">{t.label}</div>
                      {t.description && <div className="text-xs text-gray-400 line-clamp-1 mt-0.5">{t.description}</div>}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-[#C9A87C] whitespace-nowrap">${t.base_price}</td>
                    <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">{t.duration ?? "—"}</td>
                    <td className="px-4 py-3.5 text-gray-300 tabular-nums text-xs">{t.sort_order}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => { setTypeForm({ label: t.label, description: t.description ?? "", base_price: String(t.base_price), duration: t.duration ?? "", sort_order: String(t.sort_order) }); setTypeModal({ open: true, editing: t }); }} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors border border-gray-100"><EditIcon /></button>
                        <button onClick={() => deleteType(t.id, t.label)} className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors border border-gray-100"><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Addons ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800">Додаткові опції</h2>
          <AddBtn label="Додати опцію" onClick={() => { setAddonForm(EMPTY_CALC_ADDON); setAddonModal({ open: true, editing: null }); }} />
        </div>
        {addons.length === 0 ? (
          <EmptyBox title="Опцій ще немає" sub="Сайт показує вбудовані дані" />
        ) : (
          <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-[#0C0C0C]">
                {["Назва", "Ціна", "Порядок", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-white/40">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {addons.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-gray-800">{a.label}</td>
                    <td className="px-4 py-3.5 font-semibold text-[#C9A87C] whitespace-nowrap">+${a.price}</td>
                    <td className="px-4 py-3.5 text-gray-300 tabular-nums text-xs">{a.sort_order}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => { setAddonForm({ label: a.label, price: String(a.price), sort_order: String(a.sort_order) }); setAddonModal({ open: true, editing: a }); }} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors border border-gray-100"><EditIcon /></button>
                        <button onClick={() => deleteAddon(a.id, a.label)} className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors border border-gray-100"><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Type modal */}
      {typeModal.open && (
        <GenericModal heading={typeModal.editing ? "Редагувати тип" : "Новий тип проекту"} onClose={() => setTypeModal({ open: false, editing: null })} onSubmit={saveType} saving={saving} disabled={!typeForm.label.trim()}>
          <ModalField label="Назва" required input={<input type="text" value={typeForm.label} onChange={e => setTypeForm(p => ({ ...p, label: e.target.value }))} placeholder="Лендінг" required className={IN_CLS} />} />
          <div className="grid grid-cols-2 gap-3">
            <ModalField label="Базова ціна ($)" input={<input type="number" value={typeForm.base_price} onChange={e => setTypeForm(p => ({ ...p, base_price: e.target.value }))} placeholder="200" className={IN_CLS} />} />
            <ModalField label="Термін" input={<input type="text" value={typeForm.duration} onChange={e => setTypeForm(p => ({ ...p, duration: e.target.value }))} placeholder="7 днів" className={IN_CLS} />} />
          </div>
          <ModalField label="Опис" input={<textarea value={typeForm.description} onChange={e => setTypeForm(p => ({ ...p, description: e.target.value }))} placeholder="Короткий опис типу проекту..." rows={2} className={TA_CLS} />} />
          <ModalField label="Порядок (sort)" input={<input type="number" value={typeForm.sort_order} onChange={e => setTypeForm(p => ({ ...p, sort_order: e.target.value }))} placeholder="0" className={IN_CLS} />} />
        </GenericModal>
      )}

      {/* Addon modal */}
      {addonModal.open && (
        <GenericModal heading={addonModal.editing ? "Редагувати опцію" : "Нова опція"} onClose={() => setAddonModal({ open: false, editing: null })} onSubmit={saveAddon} saving={saving} disabled={!addonForm.label.trim()}>
          <ModalField label="Назва опції" required input={<input type="text" value={addonForm.label} onChange={e => setAddonForm(p => ({ ...p, label: e.target.value }))} placeholder="SEO оптимізація" required className={IN_CLS} />} />
          <div className="grid grid-cols-2 gap-3">
            <ModalField label="Ціна ($)" input={<input type="number" value={addonForm.price} onChange={e => setAddonForm(p => ({ ...p, price: e.target.value }))} placeholder="80" className={IN_CLS} />} />
            <ModalField label="Порядок (sort)" input={<input type="number" value={addonForm.sort_order} onChange={e => setAddonForm(p => ({ ...p, sort_order: e.target.value }))} placeholder="0" className={IN_CLS} />} />
          </div>
        </GenericModal>
      )}
    </div>
  );
}

// ─── FAQ Tab ──────────────────────────────────────────────────────────────────

const EMPTY_FAQ = { question: "", answer: "", sort_order: "0" };
type FaqForm = typeof EMPTY_FAQ;

function FaqTab() {
  const [items, setItems]     = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState<string | null>(null);
  const [modal, setModal]     = useState<{ open: boolean; editing: FaqItem | null }>({ open: false, editing: null });
  const [form, setForm]       = useState<FaqForm>(EMPTY_FAQ);
  const [saving, setSaving]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setErr(null);
    try { setItems(await apiFetch<FaqItem[]>("/api/admin/faq")); }
    catch (e) { setErr(e instanceof Error ? e.message : "Помилка"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openAdd() { setForm(EMPTY_FAQ); setModal({ open: true, editing: null }); }
  function openEdit(item: FaqItem) {
    setForm({ question: item.question, answer: item.answer, sort_order: String(item.sort_order) });
    setModal({ open: true, editing: item });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const body = { question: form.question.trim(), answer: form.answer.trim(), sort_order: Number(form.sort_order) || 0 };
      if (modal.editing) {
        const u = await apiFetch<FaqItem>(`/api/admin/faq/${modal.editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        setItems(prev => prev.map(i => i.id === u.id ? u : i));
      } else {
        const c = await apiFetch<FaqItem>("/api/admin/faq", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        setItems(prev => [...prev, c].sort((a, b) => a.sort_order - b.sort_order));
      }
      setModal({ open: false, editing: null });
    } catch (e) { alert(e instanceof Error ? e.message : "Помилка"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string, q: string) {
    if (!confirm(`Видалити питання «${q.slice(0, 40)}...»?`)) return;
    const prev = items;
    setItems(items.filter(i => i.id !== id));
    try { await apiFetch(`/api/admin/faq/${id}`, { method: "DELETE" }); }
    catch { setItems(prev); alert("Помилка видалення"); }
  }

  return (
    <div>
      <PageHeader title="FAQ" sub="Питання та відповіді на лендінгу"
                  action={<AddBtn label="Додати питання" onClick={openAdd} />} />

      {loading ? <Spinner /> : err ? <ErrorBox msg={err} onRetry={load} /> : items.length === 0 ? (
        <EmptyBox title="Питань ще немає" sub="Сайт показує вбудовані дані. Додайте питання щоб керувати ними звідси." />
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={item.id} className="bg-white border border-gray-100 shadow-sm p-5">
              <div className="flex items-start gap-4">
                <span className="w-7 h-7 rounded bg-gray-50 border border-gray-100 flex items-center justify-center text-[0.625rem] font-bold text-gray-400 shrink-0 mt-0.5">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 mb-1.5">{item.question}</p>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{item.answer}</p>
                  <span className="text-[0.625rem] text-gray-300 mt-1 block">порядок: {item.sort_order}</span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors border border-gray-100"><EditIcon /></button>
                  <button onClick={() => handleDelete(item.id, item.question)} className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors border border-gray-100"><TrashIcon /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.open && (
        <GenericModal heading={modal.editing ? "Редагувати питання" : "Нове питання"} onClose={() => setModal({ open: false, editing: null })} onSubmit={handleSave} saving={saving} disabled={!form.question.trim() || !form.answer.trim()}>
          <ModalField label="Питання" required input={<textarea value={form.question} onChange={e => setForm(p => ({ ...p, question: e.target.value }))} placeholder="Чому такі ціни на лендінг від $200?" rows={2} required className={TA_CLS} />} />
          <ModalField label="Відповідь" required input={<textarea value={form.answer} onChange={e => setForm(p => ({ ...p, answer: e.target.value }))} placeholder="Ми спеціалізуємось виключно..." rows={5} required className={TA_CLS} />} />
          <ModalField label="Порядок (sort)" input={<input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))} placeholder="0" className={IN_CLS} />} />
        </GenericModal>
      )}
    </div>
  );
}

// ─── Shared UI primitives ─────────────────────────────────────────────────────

const IN_CLS = "w-full border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors";
const TA_CLS = `${IN_CLS} resize-none`;

function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {sub && <p className="text-sm text-gray-400 mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function AddBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
            className="flex items-center gap-2 bg-[#C9A87C] text-[#0C0C0C] text-sm font-bold px-4 py-2.5 hover:bg-[#b8976b] transition-colors shrink-0">
      <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M10 4v12M4 10h12"/></svg>
      {label}
    </button>
  );
}

function RefreshBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
            className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 px-3 py-2 hover:bg-gray-50 hover:text-gray-800 transition-colors">
      <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4v5h5"/><path d="M16 16v-5h-5"/><path d="M17.5 8.5A7.5 7.5 0 104.5 15"/>
      </svg>
      Оновити
    </button>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
    </div>
  );
}

function ErrorBox({ msg, onRetry }: { msg: string; onRetry: () => void }) {
  return (
    <div className="bg-white border border-red-100 shadow-sm flex flex-col items-center justify-center py-16 text-center">
      <p className="text-red-500 font-medium mb-2">Помилка: {msg}</p>
      <button onClick={onRetry} className="text-sm text-gray-500 underline">Спробувати ще раз</button>
    </div>
  );
}

function EmptyBox({ title, sub, children }: { title: string; sub: string; children?: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 shadow-sm flex flex-col items-center justify-center py-16 text-center">
      <p className="font-semibold text-gray-700 mb-1">{title}</p>
      <p className="text-sm text-gray-400 max-w-xs leading-relaxed">{sub}</p>
      {children}
    </div>
  );
}

function GenericModal({
  heading, onClose, onSubmit, saving, disabled, children,
}: {
  heading: string; onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean; disabled?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
         onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="font-bold text-gray-900">{heading}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors" aria-label="Закрити">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 4l12 12M16 4L4 16"/></svg>
          </button>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">{children}</div>
          <div className="px-6 py-4 border-t border-gray-100 flex gap-3 shrink-0">
            <button type="button" onClick={onClose}
                    className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Скасувати
            </button>
            <button type="submit" disabled={saving || disabled}
                    className="flex-1 py-2.5 bg-[#C9A87C] text-[#0C0C0C] text-sm font-bold hover:bg-[#b8976b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {saving ? "Збереження..." : "Зберегти"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModalField({ label, required, input }: { label: string; required?: boolean; input: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {input}
    </div>
  );
}

function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5l4 4L5 19l-4 1 1-4z"/><path d="M14 2l4 4"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h14M8 6V4h4v2M19 6l-1 12a2 2 0 01-2 2H4a2 2 0 01-2-2L3 6"/>
    </svg>
  );
}
