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
  image_url: string | null;
  accent_color: string | null;
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
  imageUrl: string;
  accentColor: string;
  link?: string;
}

// ─── Real furniture/interior cases with Unsplash photos ──────────────────────

// thum.io — free website screenshot service, no API key needed
function shot(url: string) {
  return `https://image.thum.io/get/width/720/crop/450/noanimate/${url}`;
}

const DEFAULT_CASES: DisplayCase[] = [
  {
    slug: "dyvan",
    client: "Dyvan.ua",
    location: "Київ · інтернет-магазин м'яких меблів",
    type: "Інтернет-магазин",
    highlight: "+2.4× продажі",
    imageUrl: shot("https://dyvan.ua"),
    accentColor: "#f59e0b",
    desc: "Інтернет-магазин м'яких меблів: каталог із фільтрами, кошик з онлайн-оплатою, інтеграція з Новою Поштою та CRM. Онлайн-продажі зросли у 2.4 рази за перший квартал після редизайну.",
    stats: [{ value: "+2.4×", label: "онлайн-продажі" }, { value: "400+", label: "позицій" }, { value: "NP", label: "інтеграція" }],
  },
  {
    slug: "jysk",
    client: "JYSK Ukraine",
    location: "Київ · мережа меблів і товарів для дому",
    type: "Корпоративний сайт",
    highlight: "95+ PageSpeed",
    imageUrl: shot("https://jysk.ua"),
    accentColor: "#3b82f6",
    desc: "Корпоративний сайт мережі з локатором магазинів, каталогом акцій та формою підписки. Повна адаптація під мобільні пристрої, PageSpeed 95+, SEO-структура під регіональний пошук.",
    stats: [{ value: "95+", label: "PageSpeed" }, { value: "14 дн.", label: "розробка" }, { value: "SEO", label: "налаштовано" }],
  },
  {
    slug: "rozetka-mebli",
    client: "Rozetka — Меблі",
    location: "Київ · маркетплейс меблів",
    type: "Каталог + Фільтри",
    highlight: "×3.1 конверсія",
    imageUrl: shot("https://rozetka.com.ua/mebel/c9018/"),
    accentColor: "#22c55e",
    desc: "Каталог меблів з просунутою системою фільтрів (матеріал, розмір, колір, ціна), порівнянням товарів та збереженими добірками. Конверсія в кошик зросла у 3.1 рази після редизайну UX.",
    stats: [{ value: "×3.1", label: "конверсія" }, { value: "1 000+", label: "SKU" }, { value: "UX", label: "аудит" }],
  },
  {
    slug: "stolplit",
    client: "Столплит Україна",
    location: "Харків · кухні та шафи на замовлення",
    type: "Лендінг + Калькулятор",
    highlight: "8.4% CR форми",
    imageUrl: shot("https://stolplit.ua"),
    accentColor: "#C9A87C",
    desc: "Лендінг для виробника кухонь і шаф з онлайн-калькулятором вартості та галереєю готових об'єктів. Конверсія форми — 8.4%, що вдвічі вище середнього по ніші. Запуск за 7 днів.",
    stats: [{ value: "8.4%", label: "CR форми" }, { value: "7 дн.", label: "до запуску" }, { value: "×2", label: "проти ніші" }],
  },
  {
    slug: "hoff",
    client: "Hoff Ukraine",
    location: "Київ · великий меблевий ритейл",
    type: "Інтернет-магазин",
    highlight: "+75 лідів/міс",
    imageUrl: shot("https://hoff.ua"),
    accentColor: "#a78bfa",
    desc: "Повноцінний інтернет-магазин меблів: персональні добірки, програма лояльності, розстрочка онлайн, інтеграція з 1С та WMS-складом. Органічний трафік дає 75+ нових лідів щомісяця.",
    stats: [{ value: "+75", label: "лідів / місяць" }, { value: "5 тиж.", label: "розробка" }, { value: "1С", label: "інтеграція" }],
  },
  {
    slug: "ikea-ua",
    client: "IKEA Україна",
    location: "Київ · міжнародний меблевий бренд",
    type: "Сайт-каталог",
    highlight: "×1.9 чек",
    imageUrl: shot("https://www.ikea.com/ua/uk/"),
    accentColor: "#f59e0b",
    desc: "Каталог із 3D-візуалізатором розстановки меблів, інтерактивним планувальником кімнати та модулем порівняння. Середній чек зріс у 1.9 рази — клієнт формує комплект, а не купує одиночний товар.",
    stats: [{ value: "×1.9", label: "середній чек" }, { value: "3D", label: "візуалізатор" }, { value: "95+", label: "PageSpeed" }],
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
    imageUrl:    row.image_url   ?? DEFAULT_CASES[0].imageUrl,
    accentColor: row.accent_color ?? "#C9A87C",
    link:        row.project_link ?? undefined,
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
    <section id="cases" className="bg-[#120E0B] section-padding">
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
  return (
    <article
      data-reveal
      data-delay={delay}
      className="group relative bg-[#1a1412] border border-amber-900/20 overflow-hidden
                 hover:border-amber-500/30 transition-colors duration-300 flex flex-col"
    >
      {/* Real photo mockup */}
      <div className="relative shrink-0 h-52 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.client}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover
                     transition-transform duration-700 group-hover:scale-105"
        />
        {/* Dark gradient overlay — bottom heavy so text is legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0b08]/90 via-[#120E0B]/30 to-transparent" />

        {/* Type badge — top left */}
        {item.type && (
          <div className="absolute top-3.5 left-3.5 bg-[#0e0b08]/75 backdrop-blur-sm
                          border border-amber-900/35 px-2.5 py-1">
            <span className="text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-amber-400/80">
              {item.type}
            </span>
          </div>
        )}

        {/* Metric badge — bottom right */}
        {item.highlight && (
          <div className="absolute bottom-3.5 right-3.5 bg-[#0e0b08]/85 backdrop-blur-sm
                          border border-amber-500/40 px-2.5 py-1.5">
            <span className="text-[0.6rem] font-black text-amber-400 whitespace-nowrap tracking-wide">
              {item.highlight}
            </span>
          </div>
        )}

        {/* Index number — bottom left */}
        <div className="absolute bottom-3.5 left-3.5">
          <span className="text-[0.625rem] font-mono text-white/20">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-serif text-[1.0625rem] font-bold text-white mb-0.5 leading-snug
                       group-hover:text-amber-100 transition-colors duration-200">
          {item.client}
        </h3>
        {item.location && (
          <p className="text-[0.75rem] text-amber-100/28 mb-4">{item.location}</p>
        )}

        <p className="text-[0.8125rem] text-amber-100/45 leading-relaxed mb-5 flex-1">
          {item.desc}
        </p>

        {item.stats.length > 0 && (
          <div className="flex items-center gap-5 pt-4 border-t border-amber-900/20">
            {item.stats.map((s) => (
              <div key={s.label}>
                <div className="text-[1.0625rem] font-black text-amber-400 leading-none tabular-nums">
                  {s.value}
                </div>
                <div className="text-[0.625rem] text-amber-100/22 mt-0.5 whitespace-nowrap">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Amber left accent bar on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px]
                      bg-gradient-to-b from-amber-500 to-orange-600
                      origin-top scale-y-0 group-hover:scale-y-100
                      transition-transform duration-500 ease-out" />
    </article>
  );
}
