"use client";

import { useState, useEffect } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProjectType {
  id: string;
  label: string;
  desc: string;
  basePrice: number;
  days: string;
}

interface AddonItem {
  id: string;
  label: string;
  price: number;
}

type Timeline   = "standard" | "express";
type DesignType = "template" | "custom";

// ─── Hardcoded defaults ───────────────────────────────────────────────────────

const DEFAULT_PROJECT_TYPES: ProjectType[] = [
  { id: "landing",   label: "Лендінг",            desc: "Одна сторінка під рекламу — максимум лідів при мінімальній вартості кліку.",   basePrice: 150,  days: "7 днів"     },
  { id: "catalog",   label: "Сайт-каталог",        desc: "Каталог меблів або ремонтних послуг з фільтрацією та формою замовлення.",      basePrice: 450,  days: "2–3 тижні"  },
  { id: "corporate", label: "Корпоративний сайт",  desc: "Повноцінний багатосторінковий сайт компанії з SEO-структурою та портфоліо.",   basePrice: 800,  days: "3–4 тижні"  },
  { id: "shop",      label: "Інтернет-магазин",    desc: "Каталог меблів з кошиком, оплатою (LiqPay/Mono) та особистим кабінетом.",      basePrice: 1500, days: "5–8 тижнів" },
  { id: "crm",       label: "CRM-система",         desc: "Система для управління заявками, замовленнями та клієнтами вашої компанії.",   basePrice: 1200, days: "3–6 тижнів" },
];

const DEFAULT_ADDONS: AddonItem[] = [
  { id: "copy",    label: "Копірайтинг для сайту",          price: 80  },
  { id: "seo",     label: "SEO оптимізація",                price: 120 },
  { id: "ads",     label: "Налаштування Google / Meta Ads", price: 150 },
  { id: "bot",     label: "Telegram-бот для заявок",        price: 120 },
  { id: "support", label: "3 місяці технічної підтримки",   price: 80  },
];

function fmt(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Calculator() {
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>(DEFAULT_PROJECT_TYPES);
  const [addonsList,   setAddonsList]   = useState<AddonItem[]>(DEFAULT_ADDONS);
  const [projectId,    setProjectId]    = useState<string>(DEFAULT_PROJECT_TYPES[0].id);
  const [timeline,     setTimeline]     = useState<Timeline>("standard");
  const [designType,   setDesignType]   = useState<DesignType>("template");
  const [selected_addons, setSelectedAddons] = useState<Set<string>>(new Set());

  // Fetch DB data, keep defaults if DB is empty
  useEffect(() => {
    Promise.all([
      fetch("/api/admin/calc-types").then((r) => r.ok ? r.json() : null),
      fetch("/api/admin/calc-addons").then((r) => r.ok ? r.json() : null),
    ]).then(([types, addons]) => {
      if (Array.isArray(types) && types.length > 0) {
        const mapped: ProjectType[] = types.map((t: {
          id: string; label: string; description?: string | null;
          base_price: number; duration?: string | null;
        }) => ({
          id:        t.id,
          label:     t.label,
          desc:      t.description ?? "",
          basePrice: t.base_price,
          days:      t.duration ?? "",
        }));
        setProjectTypes(mapped);
        setProjectId(mapped[0].id);
      }
      if (Array.isArray(addons) && addons.length > 0) {
        setAddonsList(addons.map((a: { id: string; label: string; price: number }) => ({
          id:    a.id,
          label: a.label,
          price: a.price,
        })));
      }
    }).catch(() => {});
  }, []);

  const selected = projectTypes.find((p) => p.id === projectId) ?? projectTypes[0];

  const timelineMult      = timeline   === "express" ? 1.4 : 1;
  const designMult        = designType === "custom"  ? 1.5 : 1;
  const baseAfterTimeline = Math.round(selected.basePrice * timelineMult);
  const timelineSurcharge = baseAfterTimeline - selected.basePrice;
  const designSurcharge   = Math.round(baseAfterTimeline * (designMult - 1));
  const projectSubtotal   = baseAfterTimeline + designSurcharge;
  const addonsTotal       = addonsList.filter((a) => selected_addons.has(a.id)).reduce((s, a) => s + a.price, 0);
  const total             = projectSubtotal + addonsTotal;

  const toggleAddon = (id: string) =>
    setSelectedAddons((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const hasExtras = timeline === "express" || designType === "custom" || selected_addons.size > 0;

  return (
    <section id="calculator" className="bg-cream-light section-padding">
      <div className="container-wide">

        {/* Header */}
        <div className="max-w-xl mb-12 lg:mb-16">
          <span className="label-text block mb-4">Вартість проекту</span>
          <h2 className="heading-section text-ink-800">
            Розрахуйте вартість вашого сайту
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">

          {/* ── Controls (3 cols) ────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-5">

            {/* 1. Project type */}
            <div className="bg-white border border-cream-dark p-8 lg:p-10">
              <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-ink-300 block mb-5">
                Тип проекту
              </span>
              <div className="space-y-3">
                {projectTypes.map((p) => {
                  const active = projectId === p.id;
                  return (
                    <label
                      key={p.id}
                      className={`flex items-start gap-4 p-4 border cursor-pointer
                                  transition-all duration-200 ${
                        active
                          ? "border-gold/50 bg-gold/[0.035]"
                          : "border-cream-dark hover:border-gold/25"
                      }`}
                    >
                      <input
                        type="radio"
                        name="projectType"
                        value={p.id}
                        checked={active}
                        onChange={() => setProjectId(p.id)}
                        className="sr-only"
                      />
                      <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0
                                       flex items-center justify-center transition-colors duration-200 ${
                        active ? "border-gold" : "border-ink-200"
                      }`}>
                        {active && <span className="w-1.5 h-1.5 rounded-full bg-gold" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[0.875rem] font-semibold text-ink-700 block">{p.label}</span>
                        {p.desc && (
                          <span className="text-[0.75rem] text-ink-300 leading-relaxed">{p.desc}</span>
                        )}
                      </div>
                      <div className="ml-auto shrink-0 text-right pl-2 pt-0.5">
                        <span className="text-[0.8125rem] font-semibold text-gold whitespace-nowrap">
                          від {fmt(p.basePrice)}
                        </span>
                        {p.days && (
                          <span className="text-[0.6875rem] text-ink-200 block whitespace-nowrap">{p.days}</span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 2. Timeline + Design */}
            <div className="bg-white border border-cream-dark p-8 lg:p-10 grid grid-cols-1 sm:grid-cols-2 gap-8">

              {/* Timeline */}
              <div>
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-ink-300 block mb-5">
                  Терміни
                </span>
                <div className="space-y-3">
                  {([
                    { id: "standard" as const, label: "Стандарт", desc: "7–21 день", mult: "×1.0" },
                    { id: "express"  as const, label: "Express",  desc: "3–7 днів",  mult: "×1.4" },
                  ]).map((t) => {
                    const active = timeline === t.id;
                    return (
                      <label key={t.id} className={`flex items-center gap-3 p-3.5 border cursor-pointer
                                  transition-all duration-200 ${
                        active ? "border-gold/50 bg-gold/[0.035]" : "border-cream-dark hover:border-gold/25"
                      }`}>
                        <input type="radio" name="timeline" value={t.id} checked={active}
                               onChange={() => setTimeline(t.id)} className="sr-only" />
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0
                                         flex items-center justify-center transition-colors duration-200 ${
                          active ? "border-gold" : "border-ink-200"
                        }`}>
                          {active && <span className="w-1.5 h-1.5 rounded-full bg-gold" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[0.875rem] font-semibold text-ink-700 block">{t.label}</span>
                          <span className="text-[0.75rem] text-ink-300">{t.desc}</span>
                        </div>
                        <span className={`text-[0.75rem] font-mono shrink-0 ${active ? "text-gold" : "text-ink-200"}`}>
                          {t.mult}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Design type */}
              <div>
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-ink-300 block mb-5">
                  Дизайн
                </span>
                <div className="space-y-3">
                  {([
                    { id: "template" as const, label: "За шаблоном", desc: "Готовий UI-kit", mult: "×1.0" },
                    { id: "custom"   as const, label: "Кастомний",   desc: "Uniq дизайн",   mult: "×1.5" },
                  ]).map((d) => {
                    const active = designType === d.id;
                    return (
                      <label key={d.id} className={`flex items-center gap-3 p-3.5 border cursor-pointer
                                  transition-all duration-200 ${
                        active ? "border-gold/50 bg-gold/[0.035]" : "border-cream-dark hover:border-gold/25"
                      }`}>
                        <input type="radio" name="designType" value={d.id} checked={active}
                               onChange={() => setDesignType(d.id)} className="sr-only" />
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0
                                         flex items-center justify-center transition-colors duration-200 ${
                          active ? "border-gold" : "border-ink-200"
                        }`}>
                          {active && <span className="w-1.5 h-1.5 rounded-full bg-gold" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[0.875rem] font-semibold text-ink-700 block">{d.label}</span>
                          <span className="text-[0.75rem] text-ink-300">{d.desc}</span>
                        </div>
                        <span className={`text-[0.75rem] font-mono shrink-0 ${active ? "text-gold" : "text-ink-200"}`}>
                          {d.mult}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Addons */}
            <div className="bg-white border border-cream-dark p-8 lg:p-10">
              <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-ink-300 block mb-5">
                Додаткові опції
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addonsList.map((addon) => {
                  const checked = selected_addons.has(addon.id);
                  return (
                    <label key={addon.id} className={`flex items-center gap-3 p-3.5 border cursor-pointer
                                transition-all duration-200 ${
                      checked ? "border-gold/50 bg-gold/[0.035]" : "border-cream-dark hover:border-gold/25"
                    }`}>
                      <input type="checkbox" checked={checked}
                             onChange={() => toggleAddon(addon.id)} className="sr-only" />
                      <div className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center
                                       transition-colors duration-200 ${
                        checked ? "border-gold bg-gold" : "border-ink-200"
                      }`}>
                        {checked && (
                          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
                            <path d="M1.5 4.5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className="text-[0.8125rem] text-ink-600 flex-1 leading-snug">{addon.label}</span>
                      <span className={`text-[0.8125rem] font-semibold shrink-0 ${checked ? "text-gold" : "text-ink-300"}`}>
                        +{fmt(addon.price)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Result card (2 cols) ─────────────────────────────── */}
          <div className="lg:col-span-2 lg:sticky lg:top-24">
            <div className="bg-ink-800 p-8 lg:p-10 relative overflow-hidden">
              <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse 80% 55% at 50% 105%, rgba(201,168,124,0.11) 0%, transparent 65%)",
              }} />
              <div className="relative">
                <div className="h-px bg-gradient-to-r from-gold/50 to-transparent mb-8" />
                <span className="label-text block mb-5">Орієнтовна вартість</span>
                <div className="mb-8">
                  <div className="text-[0.625rem] uppercase tracking-[0.2em] text-white/30 mb-1.5">Загальна сума</div>
                  <div className="font-serif leading-none">
                    <span className="text-[2.75rem] font-bold text-white tabular-nums">{fmt(total)}</span>
                  </div>
                  <div className="text-[0.75rem] text-white/28 mt-1.5">Без передоплати</div>
                </div>
                <div className="border-t border-white/[0.07] pt-5 space-y-3 mb-8">
                  <Row label={selected.label} value={fmt(selected.basePrice)} />
                  {timeline === "express" && <Row label="Express (×1.4)" value={`+${fmt(timelineSurcharge)}`} />}
                  {designType === "custom"  && <Row label="Кастомний дизайн (×1.5)" value={`+${fmt(designSurcharge)}`} />}
                  {addonsList.filter((a) => selected_addons.has(a.id)).map((a) => (
                    <Row key={a.id} label={a.label} value={`+${fmt(a.price)}`} />
                  ))}
                  {hasExtras && (
                    <div className="flex justify-between text-[0.8125rem] border-t border-white/[0.07] pt-3">
                      <span className="text-white/50 font-semibold">Разом</span>
                      <span className="text-gold font-semibold tabular-nums">{fmt(total)}</span>
                    </div>
                  )}
                </div>
                <p className="text-[0.6875rem] text-white/20 leading-relaxed mb-8">
                  Вартість орієнтовна. Точний прорахунок — після безкоштовного брифінгу. Оплата після здачі проекту.
                </p>
                <a href="#contacts" className="btn-gold block text-center w-full">
                  Отримати точний прорахунок
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[0.8125rem]">
      <span className="text-white/30 leading-snug">{label}</span>
      <span className="text-white/60 tabular-nums shrink-0 ml-3">{value}</span>
    </div>
  );
}
