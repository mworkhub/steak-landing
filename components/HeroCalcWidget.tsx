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
  const [typeId,   setTypeId]   = useState<TypeId>("landing");
  const [express,  setExpress]  = useState(false);
  const [custom,   setCustom]   = useState(false);

  const selected = TYPES.find((t) => t.id === typeId)!;
  const total    = Math.round(selected.basePrice * (express ? 1.4 : 1) * (custom ? 1.5 : 1));

  return (
    <div
      className="relative w-[340px] shrink-0 animate-fade-in"
      style={{ animationDelay: "600ms" }}
    >
      {/* Outer glow */}
      <div
        aria-hidden
        className="absolute -inset-px pointer-events-none"
        style={{
          boxShadow:
            "0 0 60px 0 rgba(201,168,124,0.09), 0 0 120px 0 rgba(201,168,124,0.04)",
        }}
      />

      <div className="relative bg-black/55 backdrop-blur-xl border border-white/[0.09] p-7">

        {/* Gold hairline */}
        <div className="h-px bg-gradient-to-r from-gold/60 via-gold/25 to-transparent mb-6" />

        {/* Label */}
        <div className="text-[0.6875rem] uppercase tracking-[0.22em] text-gold mb-5">
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
                  ? "border-gold/40 bg-gold/[0.07] text-white"
                  : "border-white/[0.06] text-white/38 hover:text-white/60 hover:border-white/14"
              }`}
            >
              <span className="text-[0.8125rem]">{t.label}</span>
              <span
                className={`text-[0.75rem] font-semibold tabular-nums transition-colors ${
                  typeId === t.id ? "text-gold" : "text-white/18"
                }`}
              >
                ${t.basePrice.toLocaleString("en-US")}
              </span>
            </button>
          ))}
        </div>

        {/* Multiplier toggles */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <ToggleBtn
            label="Express"
            hint="×1.4"
            active={express}
            onChange={() => setExpress((v) => !v)}
          />
          <ToggleBtn
            label="Кастомний"
            hint="×1.5"
            active={custom}
            onChange={() => setCustom((v) => !v)}
          />
        </div>

        {/* Price */}
        <div className="border-t border-white/[0.07] pt-5 mb-5">
          <div className="text-[0.625rem] uppercase tracking-[0.22em] text-white/25 mb-2">
            Орієнтовна вартість
          </div>
          <div className="font-serif leading-none">
            <span
              className={`text-[2.75rem] font-bold tabular-nums transition-all duration-300 ${
                express || custom ? "text-gold" : "text-white"
              }`}
              style={
                express || custom
                  ? { textShadow: "0 0 24px rgba(201,168,124,0.35)" }
                  : undefined
              }
            >
              ${total.toLocaleString("en-US")}
            </span>
          </div>
          <div className="text-[0.6875rem] text-white/22 mt-2">Без передоплати</div>
        </div>

        <a href="#calculator" className="btn-gold block text-center w-full text-[0.8125rem]">
          Детальний прорахунок&nbsp;↓
        </a>
      </div>
    </div>
  );
}

// ─── Sub-component ──────────────────────────────────────────────────────────

function ToggleBtn({
  label,
  hint,
  active,
  onChange,
}: {
  label: string;
  hint: string;
  active: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`flex items-center justify-between px-3 py-2 border text-left
                  transition-all duration-150 ${
        active
          ? "border-gold/40 bg-gold/[0.09] text-white"
          : "border-white/[0.06] text-white/32 hover:border-white/15 hover:text-white/52"
      }`}
    >
      <span className="text-[0.75rem]">{label}</span>
      <span
        className={`text-[0.6875rem] font-mono transition-colors ${
          active ? "text-gold" : "text-white/18"
        }`}
      >
        {hint}
      </span>
    </button>
  );
}
