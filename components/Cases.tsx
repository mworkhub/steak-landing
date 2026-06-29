"use client";

import { useState, useEffect } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DbCase {
  id: string;
  title: string;
  description: string | null;
  client_niche: string | null;
  location: string | null;
  project_type: string | null;
  highlight: string | null;
  stats_text: string | null;
  mockup_type: string | null;
  accent_color: string | null;
  image_url: string | null;
  project_link: string | null;
}

interface DisplayCase {
  slug: string;
  client: string;
  location: string;
  type: string;
  highlight: string;
  desc: string;
  stats: { value: string; label: string }[];
  mockupType: string;
  accentColor: string;
}

// ─── Hardcoded defaults ───────────────────────────────────────────────────────

const DEFAULT_CASES: DisplayCase[] = [
  {
    slug: "roble",
    client: "Roble Furniture",
    location: "Львів · виробництво меблів",
    type: "ERP-система",
    highlight: "+38% маржа",
    mockupType: "crm",
    accentColor: "#C9A87C",
    desc: "ERP для меблевого виробника: єдина система складу, виробничих замовлень і фінансового обліку. Інтеграція з 1С і банківськими API. Більше жодних Excel-таблиць і втрачених замовлень.",
    stats: [{ value: "+38%", label: "зростання маржі" }, { value: "12 тиж.", label: "розробка" }, { value: "1С", label: "інтеграція" }],
  },
  {
    slug: "atelier-od",
    client: "Atelier OD",
    location: "Одеса · пошиття та ательє",
    type: "CRM + Інтернет-магазин",
    highlight: "−65% час обробки",
    mockupType: "shop",
    accentColor: "#C9A87C",
    desc: "Система управління замовленнями з 4-етапною воронкою, інтеграцією Нової Пошти і Telegram-ботом для клієнтів. Жодне замовлення більше не губиться — від заявки до видачі.",
    stats: [{ value: "−65%", label: "час обробки" }, { value: "4 тиж.", label: "розробка" }, { value: "Nova Post", label: "інтеграція" }],
  },
  {
    slug: "dent-svitlo",
    client: "Дент.Світло",
    location: "Київ · стоматологія",
    type: "Лендінг",
    highlight: "4.2× конверсія",
    mockupType: "landing",
    accentColor: "#60a5fa",
    desc: "Лендінг для запису на консультацію. До запуску форма була захована в Instagram — заявок майже не надходило. Після — конверсія виросла у 4.2 рази, і клініка запустила другий кабінет.",
    stats: [{ value: "4.2×", label: "конверсія" }, { value: "6 дн.", label: "до запуску" }, { value: "CRM", label: "для лікарів" }],
  },
  {
    slug: "luka-coffee",
    client: "Luka Coffee",
    location: "Львів · мережа кав'ярень",
    type: "Лендінг + Telegram-бот",
    highlight: "+1 200 замовлень / міс",
    mockupType: "landing",
    accentColor: "#f59e0b",
    desc: "Сайт мережі кав'ярень з Telegram-ботом для попередніх замовлень. Черги у пікові години скоротились, а лояльність постійних клієнтів зросла за рахунок персоналізованих знижок.",
    stats: [{ value: "+1 200", label: "замовлень / міс" }, { value: "9 дн.", label: "до запуску" }, { value: "Telegram", label: "бот замовлень" }],
  },
  {
    slug: "bridge-academy",
    client: "Bridge Academy",
    location: "Дніпро · онлайн-освіта",
    type: "Автоматизація",
    highlight: "×3.1 активація",
    mockupType: "crm",
    accentColor: "#a78bfa",
    desc: "Telegram-бот для автоматичного онбордингу студентів: видача доступів, нагадування про оплату, welcome-серія. Активація учнів після покупки зросла у 3.1 рази — без участі менеджера.",
    stats: [{ value: "×3.1", label: "активація студентів" }, { value: "2 тиж.", label: "розробка" }, { value: "0 руч.", label: "операцій" }],
  },
  {
    slug: "avia-cargo",
    client: "Avia Cargo",
    location: "Київ · авіа-логістика",
    type: "CRM + Автоматизація",
    highlight: "×2 швидкість КП",
    mockupType: "crm",
    accentColor: "#34d399",
    desc: "CRM для відділу продажів з автоматичним розрахунком тарифів через API авіаперевізників. Менеджери готують комерційну пропозицію вдвічі швидше — без ручного запиту ставок.",
    stats: [{ value: "×2", label: "швидкість КП" }, { value: "5 тиж.", label: "розробка" }, { value: "API", label: "авіаперевізники" }],
  },
];

function dbToDisplay(row: DbCase): DisplayCase {
  const stats = (row.stats_text ?? "")
    .split("\n")
    .filter(Boolean)
    .slice(0, 3)
    .map((line) => {
      const sep = line.indexOf("|");
      if (sep === -1) return { value: line.trim(), label: "" };
      return { value: line.slice(0, sep).trim(), label: line.slice(sep + 1).trim() };
    });
  return {
    slug:        row.id,
    client:      row.title,
    location:    row.location    ?? row.client_niche ?? "",
    type:        row.project_type ?? "",
    highlight:   row.highlight   ?? "",
    desc:        row.description ?? "",
    stats:       stats.length > 0 ? stats : [],
    mockupType:  row.mockup_type  ?? "landing",
    accentColor: row.accent_color ?? "#C9A87C",
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Cases() {
  const [cases, setCases] = useState<DisplayCase[]>(DEFAULT_CASES);

  useEffect(() => {
    fetch("/api/admin/cases")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: DbCase[] | null) => {
        if (Array.isArray(data) && data.length > 0) {
          setCases(data.map(dbToDisplay));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="cases" className="bg-ink-900 section-padding">
      <div className="container-wide">

        {/* Header */}
        <div data-reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <span className="label-text block mb-4">Наші роботи</span>
            <h2 className="heading-section text-white max-w-sm">
              Кейси з меблевої та ремонтної ніші
            </h2>
          </div>
          <p className="text-[0.875rem] text-white/35 max-w-[240px] leading-relaxed">
            {cases.length} реальних проектів — реальні метрики, реальні клієнти.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cases.map((c, i) => (
            <CaseCard key={c.slug} item={c} index={i} delay={i * 90} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function CaseCard({ item, index, delay }: { item: DisplayCase; index: number; delay: number }) {
  // Prefer slug-specific mockup, fall back to generic type
  const MockupComp = MOCKUP_MAP[item.slug] ?? MOCKUP_MAP[item.mockupType] ?? MOCKUP_MAP.landing;

  return (
    <article
      data-reveal
      data-delay={delay}
      className="group relative bg-ink-800 border border-white/[0.06] overflow-hidden
                 hover:border-gold/20 transition-colors duration-300 flex flex-col"
    >
      {/* Screen mockup */}
      <div className="relative shrink-0 h-52 border-b border-white/[0.05] overflow-hidden">
        <div className="absolute inset-2.5 flex flex-col border border-white/[0.06] overflow-hidden">
          {/* Browser chrome */}
          <div className="flex items-center gap-1.5 px-2.5 py-[6px] border-b border-black/20 shrink-0 bg-black/30 backdrop-blur-sm">
            <span className="w-[7px] h-[7px] rounded-full bg-red-500/60" />
            <span className="w-[7px] h-[7px] rounded-full bg-yellow-400/60" />
            <span className="w-[7px] h-[7px] rounded-full bg-green-500/60" />
            <div className="ml-1.5 flex-1 h-[9px] rounded-sm bg-white/[0.06] flex items-center px-2">
              <div className="h-[3px] w-24 rounded-full bg-white/20" />
            </div>
          </div>
          <div className="flex-1 overflow-hidden relative">
            <MockupComp accent={item.accentColor} />
          </div>
        </div>

        {/* Metric badge */}
        {item.highlight && (
          <div className="absolute bottom-4 right-4 bg-[#0C0C0C]/80 backdrop-blur-sm border border-gold/30 px-2.5 py-1.5">
            <span className="text-[0.625rem] font-bold text-gold whitespace-nowrap tracking-wide">
              {item.highlight}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[0.6875rem] text-white/18 font-medium tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="w-3 h-px bg-white/10" />
          {item.type && (
            <span className="text-[0.6875rem] text-gold/55 uppercase tracking-[0.15em] font-medium">
              {item.type}
            </span>
          )}
        </div>

        <h3 className="font-serif text-[1.0625rem] font-bold text-white mb-1 leading-snug
                       group-hover:text-white/85 transition-colors duration-200">
          {item.client}
        </h3>
        {item.location && <p className="text-[0.75rem] text-white/28 mb-3">{item.location}</p>}

        <p className="text-[0.8125rem] text-white/42 leading-relaxed mb-5 flex-1">{item.desc}</p>

        {item.stats.length > 0 && (
          <div className="flex items-center gap-5 pt-4 border-t border-white/[0.06]">
            {item.stats.map((s) => (
              <div key={s.label}>
                <div className="text-[1.0625rem] font-bold text-gold leading-none tabular-nums">{s.value}</div>
                <div className="text-[0.625rem] text-white/22 mt-0.5 whitespace-nowrap">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gold left bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gold origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out" />
    </article>
  );
}

// ─── Mockup map (slug-specific first, type fallback) ─────────────────────────

const MOCKUP_MAP: Record<string, ({ accent }: { accent: string }) => React.ReactElement> = {
  // Slug-specific realistic mockups
  "roble":          ({ accent }) => <RobleMockup       accent={accent} />,
  "atelier-od":     ({ accent }) => <AtelierMockup     accent={accent} />,
  "dent-svitlo":    ({ accent }) => <DentSvitloMockup  accent={accent} />,
  "luka-coffee":    ({ accent }) => <LukaMockup        accent={accent} />,
  "bridge-academy": ({ accent }) => <BridgeMockup      accent={accent} />,
  "avia-cargo":     ({ accent }) => <AviaMockup        accent={accent} />,
  // Generic type fallbacks for DB cases
  landing:   ({ accent }) => <GenericLandingMockup accent={accent} />,
  shop:      ({ accent }) => <GenericShopMockup    accent={accent} />,
  corporate: ({ accent }) => <GenericLandingMockup accent={accent} />,
  catalog:   ({ accent }) => <GenericShopMockup    accent={accent} />,
  crm:       ({ accent }) => <GenericCrmMockup     accent={accent} />,
};

// ─── Realistic mockups ────────────────────────────────────────────────────────

// 1. Roble Furniture — ERP dashboard (dark, gold accents)
function RobleMockup({ accent }: { accent: string }) {
  return (
    <div className="absolute inset-0 flex text-[0px]" style={{ background: "#111827", fontFamily: "system-ui" }}>
      {/* Sidebar */}
      <div className="w-[52px] shrink-0 flex flex-col border-r" style={{ borderColor: "rgba(255,255,255,0.06)", background: "#0d1117" }}>
        <div className="px-2 py-2.5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="h-[10px] w-full rounded" style={{ background: accent, opacity: 0.7 }} />
        </div>
        {[
          { active: false, w: "75%" }, { active: true, w: "85%" }, { active: false, w: "70%" },
          { active: false, w: "80%" }, { active: false, w: "65%" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 px-2 py-[5px]" style={{ background: item.active ? "rgba(201,168,124,0.1)" : "transparent", borderLeft: item.active ? `2px solid ${accent}` : "2px solid transparent" }}>
            <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: item.active ? accent : "rgba(255,255,255,0.12)", opacity: item.active ? 0.9 : 1 }} />
            <div className="h-[3px] rounded-full" style={{ width: item.w, background: item.active ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.12)" }} />
          </div>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="flex items-center justify-between px-3 py-2 border-b shrink-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex gap-3">
            {["Склад", "Виробництво", "Фінанси"].map((t, i) => (
              <div key={t} className="text-[5px] font-semibold px-1.5 py-0.5 rounded" style={{ background: i === 0 ? "rgba(201,168,124,0.15)" : "transparent", color: i === 0 ? accent : "rgba(255,255,255,0.3)" }}>
                {t}
              </div>
            ))}
          </div>
          <div className="w-3 h-3 rounded-full" style={{ background: accent, opacity: 0.5 }} />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-1.5 p-2 shrink-0">
          {[
            { label: "Заготовок", val: "284", color: "rgba(255,255,255,0.6)" },
            { label: "Виробів",   val: "47",  color: "rgba(255,255,255,0.6)" },
            { label: "Постачань", val: "12",  color: "#60a5fa" },
            { label: "Маржа",     val: "+38%", color: accent },
          ].map((s) => (
            <div key={s.label} className="rounded p-1.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-[7px] font-bold leading-none mb-0.5" style={{ color: s.color }}>{s.val}</div>
              <div className="text-[4px] leading-none" style={{ color: "rgba(255,255,255,0.25)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-hidden mx-2 mb-2 rounded" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2 px-2 py-1" style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            {["Замовлення", "Виріб", "Кількість", "Статус"].map((h, i) => (
              <div key={h} className="text-[4px] font-semibold uppercase" style={{ color: "rgba(255,255,255,0.25)", flex: i === 1 ? 2 : 1 }}>{h}</div>
            ))}
          </div>
          {[
            { num: "#5821", name: "Шафа-купе",    qty: "2шт", status: "В роботі", sc: "#f59e0b" },
            { num: "#5820", name: "Диван кутовий", qty: "1шт", status: "Готово",   sc: "#34d399" },
            { num: "#5819", name: "Стіл обідній",  qty: "4шт", status: "Відвант.", sc: "#60a5fa" },
          ].map((row) => (
            <div key={row.num} className="flex items-center gap-2 px-2 py-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
              <div className="text-[4.5px] font-mono" style={{ color: accent, flex: 1 }}>{row.num}</div>
              <div className="text-[4.5px]" style={{ color: "rgba(255,255,255,0.5)", flex: 2 }}>{row.name}</div>
              <div className="text-[4.5px]" style={{ color: "rgba(255,255,255,0.3)", flex: 1 }}>{row.qty}</div>
              <div className="text-[4px] px-1 py-0.5 rounded" style={{ background: `${row.sc}20`, color: row.sc, flex: 1 }}>{row.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 2. Atelier OD — Kanban CRM (beige/cream like the screenshot)
function AtelierMockup({ accent }: { accent: string }) {
  const bg = "#f5ede3";
  const colBg = "#ede3d7";
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: bg, fontFamily: "system-ui" }}>
      {/* Topbar */}
      <div className="flex items-center gap-2 px-3 py-[7px] border-b shrink-0" style={{ background: "#fff", borderColor: "#ddd" }}>
        <div className="text-[6px] font-black tracking-widest" style={{ color: "#1a1a1a" }}>ATELIER OD</div>
        <div className="flex gap-2 ml-1">
          {[{ l: "Замовлення", a: true }, { l: "Клієнти", a: false }, { l: "Звіти", a: false }].map((t) => (
            <div key={t.l} className="text-[4.5px] font-semibold pb-0.5" style={{ color: t.a ? "#1a1a1a" : "#999", borderBottom: t.a ? "1.5px solid #1a1a1a" : "1.5px solid transparent" }}>
              {t.l}
            </div>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="text-[4.5px] px-1.5 py-0.5 rounded" style={{ background: "#f0ebe5", color: "#666" }}>🔍 Пошук</div>
          <div className="w-[14px] h-[14px] rounded-full flex items-center justify-center text-[5px] font-bold text-white" style={{ background: "#7c6f64" }}>МК</div>
        </div>
      </div>

      {/* Kanban columns */}
      <div className="flex gap-2 p-2 flex-1 overflow-hidden">
        {[
          {
            title: "Нові", count: "12", countBg: "#e07b39", countClr: "#fff",
            cards: [
              { num: "#1247", name: "О. Гордієнко", tag: "NP",  tagC: "#e07b39", amt: "3 365" },
              { num: "#1246", name: "М. Шевчук",    tag: "TG",  tagC: "#52a8d4", amt: "1 220" },
            ],
          },
          {
            title: "В роботі", count: "5", countBg: "#999", countClr: "#fff",
            cards: [
              { num: "#1241", name: "К. Іваненко", tag: "NP",  tagC: "#e07b39", amt: "5 800" },
              { num: "#1238", name: "А. Петренко", tag: "TG",  tagC: "#52a8d4", amt: "920" },
            ],
          },
          {
            title: "Відправлено", count: "28", countBg: "#999", countClr: "#fff",
            cards: [
              { num: "#1232", name: "А. Кузьменко", tag: "NP-59421", tagC: "#aaa", amt: "6 200" },
              { num: "#1228", name: "Д. Лісовий",   tag: "NP-59384", tagC: "#aaa", amt: "2 480" },
            ],
          },
        ].map((col) => (
          <div key={col.title} className="flex-1 flex flex-col gap-1.5 overflow-hidden">
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[5px] font-bold" style={{ color: "#333" }}>{col.title}</span>
              <span className="text-[4px] font-bold px-1 py-0.5 rounded-full leading-none" style={{ background: col.countBg, color: col.countClr }}>{col.count}</span>
            </div>
            {col.cards.map((card) => (
              <div key={card.num} className="rounded-sm p-1.5 flex flex-col gap-0.5" style={{ background: "#fff", border: "1px solid #e8ddd4" }}>
                <div className="flex items-center justify-between">
                  <span className="text-[4px]" style={{ color: "#aaa" }}>{card.num}</span>
                  <span className="text-[3.5px]" style={{ color: "#aaa" }}>23 хв</span>
                </div>
                <div className="text-[5px] font-semibold" style={{ color: "#222" }}>{card.name}</div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[3.5px] px-1 py-px rounded" style={{ background: `${card.tagC}25`, color: card.tagC, border: `0.5px solid ${card.tagC}60` }}>{card.tag}</span>
                  <span className="text-[4.5px] font-semibold" style={{ color: "#333" }}>{card.amt} ₴</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. Дент.Світло — Landing (light blue, like screenshot)
function DentSvitloMockup({ accent }: { accent: string }) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "#f0f6ff", fontFamily: "system-ui" }}>
      {/* Nav */}
      <div className="flex items-center justify-between px-3 py-[6px] border-b shrink-0" style={{ background: "#fff", borderColor: "#e5eaf0" }}>
        <div className="text-[5.5px] font-black" style={{ color: "#1a3a6b" }}>Дент.Світло</div>
        <div className="flex gap-2">
          {["Послуги", "Лікарі", "Ціни", "Контакти"].map((t) => (
            <div key={t} className="text-[4px]" style={{ color: "#555" }}>{t}</div>
          ))}
        </div>
        <div className="text-[4.5px] font-bold px-2 py-0.5 rounded" style={{ background: accent, color: "#fff" }}>Записатись</div>
      </div>

      {/* Hero */}
      <div className="flex-1 flex gap-2 p-2 overflow-hidden">
        {/* Left */}
        <div className="flex-1 flex flex-col justify-center gap-1.5">
          <div className="flex items-center gap-0.5">
            <span className="text-[4px]" style={{ color: "#f59e0b" }}>★ 4.9</span>
            <span className="text-[4px]" style={{ color: "#aaa" }}>· 248 відгуків</span>
          </div>
          <div>
            <div className="text-[8px] font-black leading-tight" style={{ color: "#1a1a1a" }}>Здорова усмішка</div>
            <div className="text-[8px] font-black leading-tight" style={{ color: accent }}>за 3 візити</div>
          </div>
          <div className="text-[4px] leading-relaxed" style={{ color: "#666" }}>Безкоштовна консультація.<br/>Перший прийом — за 3 дні.</div>
          <div className="flex gap-1.5 mt-1">
            <div className="text-[4.5px] font-bold px-2 py-1 rounded" style={{ background: accent, color: "#fff" }}>Записатись →</div>
            <div className="text-[4.5px] font-medium px-2 py-1 rounded" style={{ border: `1px solid ${accent}`, color: accent }}>Подивитись ціни</div>
          </div>
        </div>
        {/* Right — Doctor card */}
        <div className="w-[68px] shrink-0 rounded-lg p-2 flex flex-col items-center gap-1" style={{ background: "#fff", border: "1px solid #dde8f5" }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0" style={{ background: accent }}>СП</div>
          <div className="text-[5px] font-bold text-center leading-tight" style={{ color: "#1a1a1a" }}>Світла Петренко</div>
          <div className="text-[3.5px] text-center" style={{ color: "#888" }}>Головний лікар · 20 р. досвіду</div>
          <div className="flex flex-wrap gap-0.5 justify-center mt-0.5">
            {["Імплантація", "Брекети", "Чистка"].map((t) => (
              <span key={t} className="text-[3px] px-1 py-px rounded-full" style={{ background: "#f0f6ff", color: "#1a3a6b", border: "0.5px solid #c5d9f0" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Luka Coffee — Landing + Bot (warm amber)
function LukaMockup({ accent }: { accent: string }) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "#fdf6ee", fontFamily: "system-ui" }}>
      {/* Nav */}
      <div className="flex items-center justify-between px-3 py-[6px] border-b shrink-0" style={{ background: "#fff9f2", borderColor: "#f0e0cc" }}>
        <div className="flex items-center gap-1">
          <div className="text-[7px]">☕</div>
          <div className="text-[6px] font-black" style={{ color: "#3d1f00" }}>Luka</div>
        </div>
        <div className="flex gap-2">
          {["Меню", "Локації", "Про нас"].map((t) => (
            <div key={t} className="text-[4px]" style={{ color: "#7a4a1a" }}>{t}</div>
          ))}
        </div>
        <div className="text-[4px] font-bold px-1.5 py-0.5 rounded" style={{ background: accent, color: "#fff" }}>Замовити</div>
      </div>

      {/* Body */}
      <div className="flex-1 flex gap-2 p-2 overflow-hidden">
        {/* Left hero */}
        <div className="flex-1 flex flex-col justify-center gap-1.5">
          <div className="text-[7.5px] font-black leading-tight" style={{ color: "#3d1f00" }}>Улюблена кава<br/>без черги</div>
          <div className="text-[4px]" style={{ color: "#8a5a2a" }}>Замовляй у боті — готово за 5 хв</div>
          <div className="flex items-center gap-1 mt-1 px-1.5 py-1 rounded" style={{ background: "#2ca5e020", border: `1px solid #2ca5e050` }}>
            <div className="text-[7px]">✈️</div>
            <div>
              <div className="text-[4.5px] font-bold" style={{ color: "#2ca5e0" }}>Замовити в Telegram</div>
              <div className="text-[3.5px]" style={{ color: "#888" }}>@luka_coffee_bot</div>
            </div>
          </div>
        </div>
        {/* Right — bot stat */}
        <div className="w-[60px] shrink-0 rounded-lg p-2 flex flex-col gap-1" style={{ background: "#fff", border: "1px solid #f0e0cc" }}>
          <div className="text-[4px] font-semibold" style={{ color: "#aaa" }}>Цього місяця</div>
          <div className="text-[13px] font-black leading-none" style={{ color: accent }}>+1.2k</div>
          <div className="text-[4px]" style={{ color: "#8a5a2a" }}>замовлень через бот</div>
          <div className="mt-1 h-[3px] w-full rounded-full" style={{ background: "#f0e0cc" }}>
            <div className="h-full rounded-full" style={{ width: "78%", background: accent }} />
          </div>
        </div>
      </div>

      {/* Menu strip */}
      <div className="flex gap-1.5 px-2 pb-2 shrink-0">
        {[
          { n: "Еспресо", p: "45₴" }, { n: "Латте", p: "65₴" }, { n: "Капучино", p: "60₴" },
        ].map((item) => (
          <div key={item.n} className="flex-1 rounded p-1 text-center" style={{ background: "#fff", border: "1px solid #f0e0cc" }}>
            <div className="text-[4.5px] font-semibold" style={{ color: "#3d1f00" }}>{item.n}</div>
            <div className="text-[4px]" style={{ color: accent }}>{item.p}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. Bridge Academy — Telegram bot chat (purple, dark)
function BridgeMockup({ accent }: { accent: string }) {
  const msgs = [
    { bot: true,  text: "Вітаємо в Bridge Academy! 👋" },
    { bot: true,  text: "Ваш доступ до курсу активовано ✅" },
    { bot: false, text: "Дякую!" },
    { bot: true,  text: "Урок 1 починається в пн о 18:00" },
    { bot: true,  text: "💳 Нагадування: оплата до 5-го числа" },
  ];
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "#17212b", fontFamily: "system-ui" }}>
      {/* Chat header */}
      <div className="flex items-center gap-2 px-3 py-2 shrink-0" style={{ background: "#232e3c", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-[7px] shrink-0" style={{ background: accent }}>🤖</div>
        <div>
          <div className="text-[5.5px] font-bold" style={{ color: "#fff" }}>Bridge Academy Bot</div>
          <div className="text-[4px]" style={{ color: "#6c8090" }}>завжди в мережі</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-2 py-2 flex flex-col gap-1.5 justify-end overflow-hidden">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.bot ? "justify-start" : "justify-end"}`}>
            <div
              className="text-[4.5px] px-2 py-1 rounded-lg max-w-[80%] leading-relaxed"
              style={{
                background: m.bot ? "#232e3c" : accent,
                color: m.bot ? "rgba(255,255,255,0.8)" : "#fff",
                borderRadius: m.bot ? "0 8px 8px 8px" : "8px 0 8px 8px",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-1.5 px-2 py-1.5 shrink-0" style={{ background: "#232e3c" }}>
        <div className="flex-1 h-[14px] rounded-full px-2 flex items-center" style={{ background: "#17212b" }}>
          <div className="text-[4px]" style={{ color: "rgba(255,255,255,0.2)" }}>Повідомлення...</div>
        </div>
        <div className="w-[14px] h-[14px] rounded-full flex items-center justify-center" style={{ background: accent }}>
          <div style={{ color: "#fff", fontSize: "6px" }}>▶</div>
        </div>
      </div>
    </div>
  );
}

// 6. Avia Cargo — Logistics CRM (dark, green accents)
function AviaMockup({ accent }: { accent: string }) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "#0f1923", fontFamily: "system-ui" }}>
      {/* Topbar */}
      <div className="flex items-center justify-between px-3 py-2 shrink-0" style={{ background: "#162030", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-1.5">
          <div className="text-[6px] font-black tracking-wider" style={{ color: "#fff" }}>AVIA<span style={{ color: accent }}>CARGO</span></div>
        </div>
        <div className="flex gap-1.5">
          {["Заявки", "Маршрути", "Тарифи"].map((t, i) => (
            <div key={t} className="text-[4px] px-1.5 py-0.5 rounded" style={{ background: i === 0 ? `${accent}20` : "transparent", color: i === 0 ? accent : "rgba(255,255,255,0.3)" }}>{t}</div>
          ))}
        </div>
        <div className="text-[4px] px-1.5 py-0.5 rounded font-bold" style={{ background: accent, color: "#0f1923" }}>+ Нова заявка</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-1.5 p-2 shrink-0">
        {[
          { l: "Заявок", v: "47",    c: "#fff"  },
          { l: "В роботі", v: "12",  c: "#f59e0b" },
          { l: "×2 швидше", v: "КП", c: accent   },
        ].map((s) => (
          <div key={s.l} className="rounded px-2 py-1.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-[7px] font-bold leading-none" style={{ color: s.c }}>{s.v}</div>
            <div className="text-[3.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Rate table */}
      <div className="flex-1 overflow-hidden mx-2 mb-2 rounded" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex gap-2 px-2 py-[5px] shrink-0" style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          {["Напрямок", "Вага", "Тариф", "Статус"].map((h) => (
            <div key={h} className="text-[3.5px] font-semibold uppercase flex-1" style={{ color: "rgba(255,255,255,0.2)" }}>{h}</div>
          ))}
        </div>
        {[
          { route: "KBP→DXB", weight: "500 кг",  rate: "$4.20/кг", status: "Надіслано", sc: accent   },
          { route: "KBP→FRA", weight: "1200 кг", rate: "$3.80/кг", status: "Розрах.",   sc: "#f59e0b" },
          { route: "KBP→JFK", weight: "800 кг",  rate: "$6.50/кг", status: "Готово",    sc: accent   },
        ].map((row) => (
          <div key={row.route} className="flex items-center gap-2 px-2 py-[5px]" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
            <div className="text-[4.5px] font-mono font-bold flex-1" style={{ color: "#fff" }}>{row.route}</div>
            <div className="text-[4px] flex-1" style={{ color: "rgba(255,255,255,0.4)" }}>{row.weight}</div>
            <div className="text-[4.5px] font-semibold flex-1" style={{ color: accent }}>{row.rate}</div>
            <div className="text-[3.5px] px-1 py-px rounded flex-1" style={{ background: `${row.sc}20`, color: row.sc }}>{row.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Generic fallback mockups ─────────────────────────────────────────────────

function GenericLandingMockup({ accent }: { accent: string }) {
  return (
    <div className="absolute inset-0 p-3 flex flex-col gap-1.5" style={{ background: "#f8f8f8" }}>
      <div className="flex items-center justify-between">
        <div className="h-[5px] w-12 rounded-full" style={{ background: accent }} />
        <div className="flex gap-1.5">
          {[20, 16, 18].map((w, i) => <div key={i} className="h-[3px] rounded-full bg-gray-300" style={{ width: w }} />)}
          <div className="h-[7px] w-10 rounded" style={{ background: accent, opacity: 0.7 }} />
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-2 px-1">
        <div className="h-[7px] w-4/5 rounded-full bg-gray-300" />
        <div className="h-[5px] w-3/5 rounded-full bg-gray-200" />
        <div className="mt-1 flex gap-2">
          <div className="h-[10px] w-20 rounded" style={{ background: accent }} />
          <div className="h-[10px] w-14 rounded border border-gray-300" />
        </div>
      </div>
    </div>
  );
}

function GenericShopMockup({ accent }: { accent: string }) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "#fafafa" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
        <div className="h-[5px] w-14 rounded" style={{ background: accent }} />
        <div className="h-[5px] w-16 rounded-full bg-gray-200" />
      </div>
      <div className="flex-1 p-2 grid grid-cols-3 gap-1.5 content-start">
        {[1,2,3,4,5,6].map((i) => (
          <div key={i} className="border border-gray-200 rounded flex flex-col overflow-hidden bg-white">
            <div className="h-[20px] bg-gray-100" />
            <div className="p-0.5 space-y-0.5">
              <div className="h-[2.5px] w-full rounded-full bg-gray-200" />
              <div className="h-[2.5px] w-3/5 rounded-full" style={{ background: accent, opacity: 0.5 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GenericCrmMockup({ accent }: { accent: string }) {
  return (
    <div className="absolute inset-0 p-3 flex flex-col gap-2" style={{ background: "#111827" }}>
      <div className="grid grid-cols-3 gap-1.5">
        {["12", "8", "3"].map((n, i) => (
          <div key={i} className="border border-white/[0.06] rounded p-1.5">
            <div className="text-[0.6rem] font-bold leading-none mb-0.5" style={{ color: i === 0 ? accent : i === 1 ? "#60a5fa" : "#34d399" }}>{n}</div>
            <div className="h-[2.5px] w-3/4 rounded-full bg-white/10" />
          </div>
        ))}
      </div>
      <div className="flex-1 border border-white/[0.05] rounded overflow-hidden">
        {[1,2,3,4].map((i) => (
          <div key={i} className="flex items-center gap-2 px-2 py-1.5 border-b border-white/[0.03] last:border-b-0">
            <div className="h-[3px] rounded-full bg-white/[0.08] flex-1" />
            <div className="h-[3px] rounded-full bg-white/[0.06] w-[30%]" />
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: i % 2 === 0 ? accent : "#60a5fa", opacity: 0.7 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
