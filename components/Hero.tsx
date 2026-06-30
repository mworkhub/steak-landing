"use client";

import { motion, useReducedMotion } from "framer-motion";
import HeroCalcWidget from "./HeroCalcWidget";

// ─── Animation constants ──────────────────────────────────────────────────────

const EASE4  = [0.16, 1, 0.3, 1] as [number, number, number, number];
const SPRING = { type: "spring", stiffness: 260, damping: 20 } as const;

// ─── Variants ─────────────────────────────────────────────────────────────────

const benefitItem = {
  hidden:  { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE4 } },
};

const benefitsList = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.10, delayChildren: 0.52 } },
};

const statsContainer = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.07, delayChildren: 0.78 } },
};

const statItem = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE4 } },
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const BENEFITS = [
  "Індивідуальна розробка під вашу нішу",
  "Адаптація під телефон та планшет",
  "PageSpeed 95+ — швидке завантаження",
  "Гарантія результату або повернення коштів",
] as const;

const STATS = [
  { value: "3–8%",   label: "конверсія лідів"    },
  { value: "95+",    label: "PageSpeed Score"     },
  { value: "100%",   label: "готовність до реклами" },
  { value: "7 днів", label: "лендінг до запуску"  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Hero({ onOpenModal }: { onOpenModal: () => void }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#120E0B]">

      {/* ── Layer: dark matter texture ── */}
      <div
        aria-hidden
        className="absolute inset-0 bg-repeat opacity-[0.22] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/dark-matter.png')" }}
      />

      {/* ── Layer: fine noise grain ── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
          mixBlendMode: "overlay",
        }}
      />

      {/* ── Layer: subtle grid ── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* ── Ambient glow blobs ── */}
      <div aria-hidden className="absolute top-1/4 left-1/4 w-[480px] h-[480px] bg-amber-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div aria-hidden className="absolute bottom-1/3 right-1/4 w-[360px] h-[360px] bg-orange-500/7 blur-[110px] rounded-full pointer-events-none" />
      <div aria-hidden className="absolute top-3/4 left-1/3 w-[280px] h-[280px] bg-amber-700/8 blur-[90px] rounded-full pointer-events-none" />

      {/* ── Floating badge ── */}
      {!reduceMotion && (
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute top-32 right-10 hidden xl:flex flex-col items-center gap-2 z-10 select-none pointer-events-none"
        >
          <div className="border border-amber-500/30 px-3 py-1.5 bg-amber-500/10 backdrop-blur-sm">
            <span className="text-[0.625rem] font-black uppercase tracking-[0.2em] text-amber-400">
              Меблі · Ремонти
            </span>
          </div>
          <div className="w-px h-10 bg-gradient-to-b from-amber-500/30 to-transparent" />
        </motion.div>
      )}

      {/* ── Decorative vertical text ── */}
      <div aria-hidden className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-3 z-10 select-none">
        <span className="text-[9px] text-amber-100/10 tracking-[0.35em] uppercase" style={{ writingMode: "vertical-rl" }}>
          Web Studio — Kyiv, Ukraine
        </span>
        <span className="w-px h-20 bg-gradient-to-b from-transparent via-amber-500/18 to-transparent" />
      </div>

      {/* ── Main content ── */}
      <div className="container-wide relative z-10 pt-28 pb-20 lg:pt-36 lg:pb-28">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-10 xl:gap-14 items-center">

          {/* ── Left column ── */}
          <div className="max-w-[700px]">

            {/* Label */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: EASE4 }}
              className="inline-flex items-center gap-3 mb-8"
            >
              <span className="w-8 h-[2px] bg-gradient-to-r from-amber-500 to-orange-600 flex-shrink-0" />
              <span className="text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-amber-400">
                СТЕЙК./ — веб-студія для меблевого та ремонтного бізнесу
              </span>
            </motion.div>

            {/* H1 — cinematic scale-up */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.85, ease: "easeOut", delay: 0.08 }}
            >
              <h1 className="font-black uppercase tracking-tighter leading-[0.9] text-white mb-8
                             text-[3.25rem] sm:text-[4.5rem] lg:text-[5.5rem]">
                ЗРОБИМО<br />
                САЙТ ДЛЯ<br />
                МЕБЛЯРІВ{" "}
                <motion.span
                  initial={{ opacity: 0, scale: 0.75, rotate: -4 }}
                  animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
                  transition={{ duration: 0.65, ease: EASE4, delay: 0.6 }}
                  className="inline-block bg-gradient-to-r from-amber-500 to-orange-600
                             text-black px-3 py-1 leading-tight"
                >
                  ЗА 7 ДНІВ
                </motion.span>
              </h1>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE4, delay: 0.28 }}
              className="text-[1rem] sm:text-[1.0625rem] text-amber-100/42 leading-[1.78] max-w-[500px] mb-9"
            >
              Розробляємо лендінги, корпоративні сайти та інтернет-магазини виключно
              для меблевої та ремонтної ніші. Знаємо вашу аудиторію — перетворимо
              відвідувача на заявку.
            </motion.p>

            {/* Benefits — stagger from left */}
            <motion.ul
              variants={benefitsList}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10"
            >
              {BENEFITS.map((b) => (
                <motion.li key={b} variants={benefitItem} className="flex items-center gap-3 group">
                  <CheckIcon />
                  <span className="text-[0.9375rem] text-amber-100/60 leading-snug
                                   group-hover:text-amber-100/90 transition-colors duration-200">
                    {b}
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE4, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mb-16"
            >
              {/* Primary — gradient + glow */}
              <motion.button
                onClick={onOpenModal}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={SPRING}
                className="inline-flex items-center justify-center gap-2 group
                           bg-gradient-to-r from-amber-500 to-orange-600 text-black
                           font-black text-[0.875rem] uppercase tracking-[0.08em]
                           px-8 py-[15px] select-none cursor-pointer whitespace-nowrap
                           shadow-[0_0_20px_rgba(245,158,11,0.35)]
                           hover:shadow-[0_0_36px_rgba(245,158,11,0.55)]
                           transition-shadow duration-300"
              >
                Безкоштовний аудит — без передоплати
                <ArrowIcon />
              </motion.button>

              {/* Secondary */}
              <motion.a
                href="#calculator"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={SPRING}
                className="inline-flex items-center justify-center gap-2
                           border border-amber-900/45 text-amber-100/70
                           font-semibold text-[0.875rem] uppercase tracking-[0.08em]
                           px-8 py-[15px] select-none cursor-pointer whitespace-nowrap
                           hover:border-amber-500/50 hover:bg-amber-500/[0.07] hover:text-amber-300
                           transition-colors duration-200"
              >
                Розрахувати вартість
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={statsContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-amber-900/20"
            >
              {STATS.map((s) => (
                <motion.div key={s.label} variants={statItem}>
                  <div className="text-[2rem] lg:text-[2.25rem] font-black leading-none mb-1.5
                                  bg-gradient-to-r from-amber-400 to-orange-500
                                  bg-clip-text text-transparent tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-[0.6875rem] text-amber-100/28 leading-snug uppercase tracking-[0.06em]">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── Right column: levitating calc widget ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, ease: EASE4, delay: 0.22 }}
            className="hidden xl:flex items-center justify-end"
          >
            <motion.div
              animate={reduceMotion ? {} : { y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              <HeroCalcWidget />
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* ── Floating dot ── */}
      {!reduceMotion && (
        <motion.div
          animate={{ opacity: [0.35, 0.65, 0.35], scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1.2 }}
          aria-hidden
          className="absolute bottom-20 left-8 hidden lg:block w-2 h-2 rounded-full
                     bg-gradient-to-r from-amber-500 to-orange-500 pointer-events-none"
        />
      )}

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 pointer-events-none">
        <div className="w-px h-10 bg-gradient-to-b from-transparent via-amber-500/22 to-transparent" />
        <span className="text-[9px] text-amber-100/16 tracking-[0.28em] uppercase">scroll</span>
      </div>

    </section>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 15 15" fill="none" aria-hidden
         className="shrink-0 transition-transform duration-200 group-hover:translate-x-1">
      <path d="M2.5 7.5H12.5M12.5 7.5L8.5 3.5M12.5 7.5L8.5 11.5"
            stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <span className="w-5 h-5 shrink-0 flex items-center justify-center
                     bg-amber-500/10 border border-amber-500/30">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path d="M2 6l3 3 5-5"
              stroke="#f59e0b" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
