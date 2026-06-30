"use client";

import { motion } from "framer-motion";
import HeroCalcWidget from "./HeroCalcWidget";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeroProps {
  onOpenModal: () => void;
}

// ─── Animation variants ───────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE, delay: i * 0.08 },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.45 } },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Hero({ onOpenModal }: HeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0a0a0a]">

      {/* ─── Layer 1: dark matter texture ─── */}
      <div
        aria-hidden
        className="absolute inset-0 bg-repeat opacity-[0.22] mix-blend-overlay"
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/dark-matter.png')",
        }}
      />

      {/* ─── Layer 2: CSS noise grain ─── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.28]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E\")",
          mixBlendMode: "overlay",
        }}
      />

      {/* ─── Layer 3: subtle grid ─── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* ─── Layer 4: neon green radial glow bottom-left ─── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at -5% 75%, rgba(57,255,20,0.07) 0%, transparent 65%)",
        }}
      />

      {/* ─── Decorative vertical text ─── */}
      <div
        aria-hidden
        className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-3 z-10 select-none"
      >
        <span
          className="text-[9px] text-white/15 tracking-[0.35em] uppercase"
          style={{ writingMode: "vertical-rl" }}
        >
          Web Studio — Kyiv, Ukraine
        </span>
        <span className="w-px h-20 bg-gradient-to-b from-white/0 via-[#39ff14]/20 to-white/0" />
      </div>

      {/* ─── Main content ─── */}
      <div className="container-wide relative z-10 pt-28 pb-20 lg:pt-36 lg:pb-28">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-10 xl:gap-14 items-center">

          {/* ─── Left column ─── */}
          <div className="max-w-[700px]">

            {/* Label */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-3 mb-8"
            >
              <span className="w-8 h-[2px] bg-[#39ff14] flex-shrink-0" />
              <span className="text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-[#39ff14]">
                STEAK./ — веб-студія для меблевого та ремонтного бізнесу
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="font-black uppercase tracking-tighter leading-[0.9] text-white mb-8
                         text-[3.25rem] sm:text-[4.5rem] lg:text-[5.5rem]"
            >
              ЗРОБИМО<br />
              САЙТ ДЛЯ<br />
              МЕБЛЯРІВ{" "}
              <span
                className="inline-block bg-[#39ff14] text-[#0a0a0a] px-3 py-1 -rotate-1 leading-tight"
              >
                ЗА 7 ДНІВ
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
              className="text-[1rem] sm:text-[1.0625rem] text-white/45 leading-[1.75] max-w-[500px] mb-9"
            >
              Розробляємо лендінги, корпоративні сайти та інтернет-магазини
              виключно для меблевої та ремонтної ніші. Знаємо вашу аудиторію —
              перетворимо відвідувача на заявку.
            </motion.p>

            {/* Benefits */}
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10"
            >
              {BENEFITS.map((b, i) => (
                <motion.li
                  key={b}
                  custom={i}
                  variants={fadeUp}
                  className="flex items-center gap-3 group"
                >
                  <CheckIcon />
                  <span className="text-[0.9375rem] text-white/65 leading-snug group-hover:text-white/90 transition-colors duration-200">
                    {b}
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.52 }}
              className="flex flex-col sm:flex-row gap-4 mb-16"
            >
              <button
                onClick={onOpenModal}
                className="inline-flex items-center justify-center gap-2
                           bg-[#39ff14] text-[#0a0a0a]
                           font-black text-[0.875rem] uppercase tracking-[0.08em]
                           px-8 py-[15px] select-none
                           hover:bg-[#2ee610] active:scale-[0.97]
                           transition-all duration-150 group whitespace-nowrap cursor-pointer"
              >
                Безкоштовний аудит — без передоплати
                <ArrowIcon />
              </button>
              <a
                href="#calculator"
                className="inline-flex items-center justify-center gap-2
                           border border-white/20 text-white
                           font-semibold text-[0.875rem] uppercase tracking-[0.08em]
                           px-8 py-[15px] select-none
                           hover:border-[#39ff14]/40 hover:bg-[#39ff14]/[0.05] hover:text-[#39ff14]
                           active:scale-[0.97] transition-all duration-150 whitespace-nowrap cursor-pointer"
              >
                Розрахувати вартість
              </a>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.72 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-white/[0.06]"
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="text-[2rem] lg:text-[2.25rem] font-black text-[#39ff14] leading-none mb-1.5 tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-[0.6875rem] text-white/28 leading-snug uppercase tracking-[0.06em]">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>

          </div>

          {/* ─── Right column: calc widget ─── */}
          <div className="hidden xl:flex items-center justify-end">
            <HeroCalcWidget />
          </div>

        </div>
      </div>

      {/* ─── Scroll indicator ─── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 pointer-events-none">
        <div className="w-px h-10 bg-gradient-to-b from-white/0 via-[#39ff14]/25 to-white/0" />
        <span className="text-[9px] text-white/20 tracking-[0.28em] uppercase">scroll</span>
      </div>

    </section>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden
      className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
    >
      <path
        d="M2.5 7.5H12.5M12.5 7.5L8.5 3.5M12.5 7.5L8.5 11.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <span className="w-5 h-5 shrink-0 flex items-center justify-center bg-[#39ff14]/10 border border-[#39ff14]/30">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path
          d="M2 6l3 3 5-5"
          stroke="#39ff14"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const BENEFITS = [
  "Індивідуальна розробка під вашу нішу",
  "Адаптація під телефон та планшет",
  "PageSpeed 95+ — швидке завантаження",
  "Гарантія результату або повернення коштів",
] as const;

const STATS = [
  { value: "3–8%",   label: "конверсія лідів" },
  { value: "95+",    label: "PageSpeed Score" },
  { value: "100%",   label: "готовність до реклами" },
  { value: "7 днів", label: "лендінг до запуску" },
] as const;
