"use client";

import { useState, useEffect, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ServiceRow {
  id: string;
  title: string;
  description: string | null;
  price_from: number;
  duration: string | null;
  icon_key: string;
  features: string[];
  sort_order: number;
  badge?: string | null;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_SERVICES: ServiceRow[] = [
  {
    id: "1", sort_order: 1, icon_key: "landing",
    title: "Лендінг", price_from: 150, duration: "7 днів",
    badge: "BESTSELLER",
    description: "Одна сторінка під рекламу — максимум заявок при мінімальній вартості кліку. Ідеально для старту або конкретного офферу.",
    features: ["Розробка під конкретний оффер і ЦА", "CRM-форма з Telegram-сповіщенням", "A/B структура для тестування гіпотез", "PageSpeed 95+ з першого деплою"],
  },
  {
    id: "2", sort_order: 2, icon_key: "catalog",
    title: "Сайт-каталог", price_from: 450, duration: "2–3 тижні",
    badge: "ПОПУЛЯРНЕ",
    description: "Каталог меблів або ремонтних послуг з фільтрацією та формою замовлення. Легко оновлюється через адмін-панель.",
    features: ["Фільтрація за матеріалом, стилем, ціною", "Адмін-панель для управління товарами", "Інтеграція з Google Merchant", "SEO-структура під Київ / регіон"],
  },
  {
    id: "3", sort_order: 3, icon_key: "corporate",
    title: "Корпоративний сайт", price_from: 800, duration: "3–4 тижні",
    badge: null,
    description: "Представницький сайт компанії з портфоліо, відгуками та SEO-структурою. Будує довіру і дає органічний трафік.",
    features: ["SEO-оптимізація та семантична верстка", "Портфоліо, кейси, відгуки", "Google Analytics + Search Console", "CMS для самостійного оновлення"],
  },
  {
    id: "4", sort_order: 4, icon_key: "shop",
    title: "Інтернет-магазин", price_from: 1500, duration: "5–8 тижнів",
    badge: null,
    description: "Повноцінний магазин з каталогом, кошиком, особистим кабінетом і оплатою. Підходить для масштабування онлайн-продажів.",
    features: ["Кошик, оплата (LiqPay / Monobank)", "Особистий кабінет покупця", "Інтеграція з Nova Post API", "Адмін-панель управління замовленнями"],
  },
  {
    id: "5", sort_order: 5, icon_key: "crm",
    title: "CRM-система", price_from: 1200, duration: "3–6 тижнів",
    badge: null,
    description: "Власна система для управління заявками і клієнтами. Більше не потрібні сторонні CRM — ваші дані у вашій базі.",
    features: ["Суpabase / PostgreSQL — ваша БД", "Статуси заявок, Telegram-сповіщення", "Аналітика та звіти по менеджерах", "Захищений доступ через middleware"],
  },
  {
    id: "6", sort_order: 6, icon_key: "crm",
    title: "ERP-система", price_from: 3500, duration: "8–14 тижнів",
    badge: null,
    description: "Комплексна система для виробників: склад, виробничі замовлення, фінанси і логістика в одному місці. Як у Roble Furniture.",
    features: ["Управління складом і виробництвом", "Інтеграція з 1С і банківськими API", "Фінансова аналітика і маржинальність", "Мультирольовий доступ для команди"],
  },
  {
    id: "7", sort_order: 7, icon_key: "landing",
    title: "Автоматизація", price_from: 400, duration: "1–3 тижні",
    badge: null,
    description: "Telegram-бот, автоматичні нагадування, onboarding-воронки. Скорочуємо ручну роботу менеджерів на 60–80%.",
    features: ["Telegram-бот для заявок і сповіщень", "Автоматичний onboarding клієнтів", "Нагадування про оплату і доставку", "Інтеграція з Nova Post, LiqPay, 1С"],
  },
];

// ─── Animated counter hook ────────────────────────────────────────────────────

function useCountUp(target: number, duration = 900, trigger: boolean) {
  const [val, setVal] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [trigger, target, duration]);

  return val;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Services() {
  const [services, setServices] = useState<ServiceRow[]>(DEFAULT_SERVICES);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/services")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: ServiceRow[] | null) => {
        if (Array.isArray(data) && data.length > 0) setServices(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="services" className="bg-ink-900 section-padding">
      <div className="container-wide">

        {/* Header */}
        <div data-reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <span className="label-text block mb-4">Що ми робимо</span>
            <h2 className="heading-section text-white max-w-lg">
              Послуги для меблевого та ремонтного бізнесу
            </h2>
          </div>
          <div className="lg:text-right">
            <p className="text-[0.875rem] text-white/35 max-w-[280px] leading-relaxed lg:ml-auto">
              Фіксована ціна, чіткі терміни,<br className="hidden lg:block" /> оплата після здачі.
            </p>
          </div>
        </div>

        {/* Services list */}
        <div className="divide-y divide-white/[0.05]">
          {services.map((service, index) => (
            <ServiceRow
              key={service.id}
              service={service}
              index={index}
              isActive={active === service.id}
              onToggle={() => setActive(active === service.id ? null : service.id)}
            />
          ))}
        </div>

        {/* Bottom note */}
        <div data-reveal className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-white/[0.05]">
          <p className="text-[0.8125rem] text-white/25 leading-relaxed">
            Усі ціни в USD. Оплата у гривні за курсом НБУ на день оплати.<br />
            Передоплата не потрібна — розраховуємось після демонстрації результату.
          </p>
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="shrink-0 text-[0.8125rem] font-semibold text-gold border border-gold/30
                       px-5 py-2.5 hover:bg-gold hover:text-ink-900 transition-all duration-300"
          >
            Отримати КП →
          </button>
        </div>

      </div>
    </section>
  );
}

// ─── Service row ──────────────────────────────────────────────────────────────

function ServiceRow({
  service, index, isActive, onToggle,
}: {
  service: ServiceRow;
  index: number;
  isActive: boolean;
  onToggle: () => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const price = useCountUp(service.price_from, 800, visible && isActive);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={rowRef}
      data-reveal
      data-delay={index * 60}
      className="group"
    >
      {/* Collapsed row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 sm:gap-6 py-5 sm:py-6 text-left
                   transition-colors duration-200 hover:bg-white/[0.02] px-2 -mx-2"
      >
        {/* Number */}
        <span className="text-[0.6875rem] font-mono text-white/15 tabular-nums w-6 shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Title + badge */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="text-[1rem] sm:text-[1.125rem] font-bold text-white/80 group-hover:text-white transition-colors duration-200 leading-snug">
            {service.title}
          </span>
          {service.badge && (
            <span className="shrink-0 text-[0.5625rem] font-bold tracking-[0.12em] uppercase px-2 py-0.5 border"
                  style={service.badge === "BESTSELLER"
                    ? { borderColor: "#C9A87C60", color: "#C9A87C", background: "rgba(201,168,124,0.08)" }
                    : { borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)" }
                  }>
              {service.badge}
            </span>
          )}
        </div>

        {/* Duration */}
        {service.duration && (
          <span className="hidden sm:block text-[0.8125rem] text-white/25 shrink-0">
            {service.duration}
          </span>
        )}

        {/* Price */}
        <div className="text-right shrink-0">
          <span className="text-[0.75rem] text-white/30 mr-0.5">від</span>
          <span className="text-[1.0625rem] sm:text-[1.125rem] font-bold text-gold tabular-nums">
            ${service.price_from.toLocaleString("en-US")}
          </span>
        </div>

        {/* Arrow */}
        <span
          className="shrink-0 w-7 h-7 flex items-center justify-center border border-white/[0.08]
                     text-white/25 group-hover:border-gold/30 group-hover:text-gold/60
                     transition-all duration-300"
          style={{ transform: isActive ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)" }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </span>
      </button>

      {/* Expanded panel */}
      <div
        className="overflow-hidden"
        style={{
          display: "grid",
          gridTemplateRows: isActive ? "1fr" : "0fr",
          transition: "grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="min-h-0">
          <div className="pb-7 px-2 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-6">

            {/* Description + features */}
            <div>
              {service.description && (
                <p className="text-[0.875rem] text-white/40 leading-relaxed mb-5">
                  {service.description}
                </p>
              )}
              {service.features.length > 0 && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
                  {service.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[0.8125rem] text-white/50">
                      <span className="mt-[5px] w-1 h-1 rounded-full bg-gold shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Price card */}
            <div className="sm:w-[180px] shrink-0 border border-white/[0.06] p-5 flex flex-col gap-3">
              <div>
                <div className="text-[0.625rem] text-white/25 uppercase tracking-[0.12em] mb-1">Вартість від</div>
                <div className="text-[2rem] font-bold text-gold leading-none tabular-nums">
                  ${isActive ? price.toLocaleString("en-US") : service.price_from.toLocaleString("en-US")}
                </div>
              </div>
              {service.duration && (
                <div>
                  <div className="text-[0.625rem] text-white/25 uppercase tracking-[0.12em] mb-1">Термін</div>
                  <div className="text-[0.875rem] text-white/60 font-medium">{service.duration}</div>
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="mt-auto w-full py-2.5 text-[0.75rem] font-bold tracking-[0.06em] uppercase
                           bg-gold text-ink-900 hover:bg-gold/90 transition-colors duration-200"
              >
                Замовити
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
