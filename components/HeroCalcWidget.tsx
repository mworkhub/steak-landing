"use client";

import { useState } from "react";

const TYPES = [
  { id: "landing",   label: "Лендінг",           basePrice: 200  },
  { id: "catalog",   label: "Сайт-каталог",       basePrice: 450  },
  { id: "corporate", label: "Корпоративний сайт", basePrice: 750  },
  { id: "shop",      label: "Інтернет-магазин",   basePrice: 1300 },
  { id: "crm",       label: "CRM / Панель",       basePrice: 1000 },
] as const;

type TypeId = (typeof TYPES)[number]["id"];

export default function HeroCalcWidget() {
  const [typeId,  setTypeId]  = useState<TypeId>("landing");
  const [express, setExpress] = useState(false);
  const [custom,  setCustom]  = useState(false);

  const selected = TYPES.find((t) => t.id === typeId)!;
  const total    = Math.round(selected.basePrice * (express ? 1.4 : 1) * (custom ? 1.5 : 1));

  return (
    <div className="relative w-[340px] shrink-0">

      {/* Ambient glow behind card */}
      <div
        aria-hidden
        className="absolute -inset-4 pointer-events-none blur-[60px] opacity-40"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(245,158,11,0.18) 0%, transparent 70%)" }}
      />

      {/* Outer border glow */}
      <div
        aria-hidden
        className="absolute -inset-px pointer-events-none"
        style={{ boxShadow: "0 0 48px 0 rgba(245,158,11,0.10), 0 0 100px 0 rgba(245,158,11,0.05)" }}
      />

      <div className="relative bg-[#1C1510]/80 backdrop-blur-xl border border-amber-900/35 p-7">

        {/* Amber hairline */}
        <div className="h-px bg-gradient-to-r from-amber-500/70 via-amber-500/30 to-transparent mb-6" />

        {/* Label */}
        <div className="text-[0.6875rem] uppercase tracking-[0.22em] text-amber-400 mb-5">
          Розрахуйте вартість
        </div>

        {/* Type selector */}
        <div className="space-y-1.5 mb-5">
          {TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTypeId(t.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 border text-left
                          transition-all duration-150 ${
                typeId === t.id
                  ? "border-amber-500/50 bg-amber-500/[0.10] text-white"
                  : "border-amber-900/25 text-zinc-400 hover:text-zinc-200 hover:border-amber-700/40"
              }`}
            >
              <span className="text-[0.8125rem]">{t.label}</span>
              <span className={`text-[0.75rem] font-semibold tabular-nums transition-colors ${
                typeId === t.id ? "text-amber-400" : "text-zinc-500"
              }`}>
                ${t.basePrice.toLocaleString("en-US")}
              </span>
            </button>
          ))}
        </div>

        {/* Multiplier toggles */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <ToggleBtn label="Express"    hint="×1.4" active={express} onChange={() => setExpress((v) => !v)} />
          <ToggleBtn label="Кастомний"  hint="×1.5" active={custom}  onChange={() => setCustom((v) => !v)}  />
        </div>

        {/* Price */}
        <div className="border-t border-amber-900/25 pt-5 mb-5">
          <div className="text-[0.625rem] uppercase tracking-[0.22em] text-zinc-500 mb-2">
            Орієнтовна вартість
          </div>
          <div className="leading-none">
            <span
              className={`text-[2.75rem] font-black tabular-nums tracking-tight transition-all duration-300 ${
                express || custom
                  ? "bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"
                  : "text-white"
              }`}
              style={
                express || custom
                  ? { filter: "drop-shadow(0 0 16px rgba(245,158,11,0.4))" }
                  : undefined
              }
            >
              ${total.toLocaleString("en-US")}
            </span>
          </div>
          <div className="text-[0.6875rem] text-zinc-600 mt-2">Без передоплати</div>
        </div>

        {/* CTA */}
        <a
          href="#calculator"
          className="flex items-center justify-center w-full
                     bg-gradient-to-r from-amber-500 to-orange-600 text-black
                     font-black text-[0.8125rem] uppercase tracking-[0.08em]
                     px-6 py-3.5 hover:opacity-90 active:scale-[0.98]
                     transition-all duration-150
                     shadow-[0_0_16px_rgba(245,158,11,0.30)]
                     hover:shadow-[0_0_28px_rgba(245,158,11,0.50)]"
        >
          Детальний прорахунок&nbsp;↓
        </a>

      </div>
    </div>
  );
}

// ─── ToggleBtn ────────────────────────────────────────────────────────────────

function ToggleBtn({
  label, hint, active, onChange,
}: {
  label: string; hint: string; active: boolean; onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`flex items-center justify-between px-3 py-2 border text-left
                  transition-all duration-150 ${
        active
          ? "border-amber-500/50 bg-amber-500/[0.10] text-white"
          : "border-amber-900/25 text-zinc-400 hover:border-amber-700/40 hover:text-zinc-200"
      }`}
    >
      <span className="text-[0.75rem]">{label}</span>
      <span className={`text-[0.6875rem] font-mono transition-colors ${
        active ? "text-amber-400" : "text-zinc-500"
      }`}>
        {hint}
      </span>
    </button>
  );
}
