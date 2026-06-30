"use client";

import { motion, useReducedMotion } from "framer-motion";
import HeroCalcWidget from "./HeroCalcWidget";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeroProps {
  onOpenModal: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SPRING = { type: "spring", stiffness: 280, damping: 22 } as const;
const EASE4  = [0.16, 1, 0.3, 1] as [number, number, number, number];

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

// ─── Variants ─────────────────────────────────────────────────────────────────

const fromLeft = {
  hidden:  { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE4 } },
};

const fromRight = {
  hidden:  { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE4 } },
};

const fromBottom = {
  hidden:  { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, ease: EASE4, delay: i * 0.09 },
  }),
};

const staggerList = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.09, delayChildren: 0.5 } },
};

const statsContainer = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.07, delayChildren: 0.7 } },
};

const statItem = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE4 } },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Hero({ onOpenModal }: HeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#120E0B]">

      {/* ── Layer 1: dark matter wood texture ── */}
      <div
        aria-hidden
        className="absolute inset-0 bg-repeat opacity-[0.25] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/dark-matter.png')",
        }}
      />

      {/* ── Layer 2: fine noise grain ── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.18]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
          mixBlendMode: "overlay",
        }}
      />

      {/* ── Layer 3: subtle grid ── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* ── Layer 4: warm amber radial glow ── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at -5% 70%, rgba(255,107,0,0.10) 0%, transparent 60%)",
        }}
      />

      {/* ── Floating badge — top right ── */}
      {!reduceMotion && (
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          className="absolute top-32 right-10 hidden xl:flex flex-col items-center gap-2 z-10 select-none pointer-events-none"
        >
          <div className="border border-[#FF6B00]/30 px-3 py-1.5 bg-[#FF6B00]/10 backdrop-blur-sm">
            <span className="text-[0.625rem] font-black uppercase tracking-[0.2em] text-[#FF6B00]">
              Меблі · Ремонти
            </span>
          </div>
          <div className="w-px h-10 bg-gradient-to-b from-[#FF6B00]/30 to-transparent" />
        </motion.div>
      )}

      {/* ── Decorative vertical text ── */}
      <div
        aria-hidden
        className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-3 z-10 select-none"
      >
        <span
          className="text-[9px] text-amber-100/12 tracking-[0.35em] uppercase"
          style={{ writingMode: "vertical-rl" }}
        >
          Web Studio — Kyiv, Ukraine
        </span>
        <span className="w-px h-20 bg-gradient-to-b from-transparent via-[#FF6B00]/18 to-transparent" />
      </div>

      {/* ── Main content ── */}
      <div className="container-wide relative z-10 pt-28 pb-20 lg:pt-36 lg:pb-28">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-10 xl:gap-14 items-center">

          {/* ── Left column ── */}
          <div className="max-w-[700px]">

            {/* Label — slides from left */}
            <motion.div
              variants={fromLeft}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-3 mb-8"
            >
              <span className="w-8 h-[2px] bg-[#FF6B00] flex-shrink-0" />
              <span className="text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-[#FF6B00]">
                STEAK./ — веб-студія для меблевого та ремонтного бізнесу
              </span>
            </motion.div>

            {/* H1 — slides from left with delay */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: EASE4, delay: 0.1 }}
            >
              <h1
                className="font-black uppercase tracking-tighter leading-[0.9] text-white mb-8
                           text-[3.25rem] sm:text-[4.5rem] lg:text-[5.5rem]"
              >
                ЗРОБИМО<br />
                САЙТ ДЛЯ<br />
                МЕБЛЯРІВ{" "}
                <motion.span
                  initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
                  animate={{ opacity: 1, scale: 1, rotate: -1 }}
                  transition={{ duration: 0.6, ease: EASE4, delay: 0.55 }}
                  className="inline-block bg-[#FF6B00] text-black px-3 py-1 leading-tight"
                >
                  ЗА 7 ДНІВ
                </motion.span>
              </h1>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE4, delay: 0.3 }}
              className="text-[1rem] sm:text-[1.0625rem] text-amber-100/40 leading-[1.75] max-w-[500px] mb-9"
            >
              Розробляємо лендінги, корпоративні сайти та інтернет-магазини
              виключно для меблевої та ремонтної ніші. Знаємо вашу аудиторію —
              перетворимо відвідувача на заявку.
            </motion.p>

            {/* Benefits — stagger from bottom */}
            <motion.ul
              variants={staggerList}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10"
            >
              {BENEFITS.map((b, i) => (
                <motion.li
                  key={b}
                  custom={i}
                  variants={fromBottom}
                  className="flex items-center gap-3 group"
                >
                  <CheckIcon />
                  <span className="text-[0.9375rem] text-amber-100/60 leading-snug group-hover:text-amber-100/90 transition-colors duration-200">
                    {b}
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            {/* CTAs — spring hover */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE4, delay: 0.52 }}
              className="flex flex-col sm:flex-row gap-4 mb-16"
            >
              <motion.button
                onClick={onOpenModal}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={SPRING}
                className="inline-flex items-center justify-center gap-2
                           bg-[#FF6B00] text-black
                           font-black text-[0.875rem] uppercase tracking-[0.08em]
                           px-8 py-[15px] select-none cursor-pointer whitespace-nowrap
                           shadow-[0_0_28px_rgba(255,107,0,0.20)]
                           hover:shadow-[0_0_40px_rgba(255,107,0,0.35)]
                           transition-shadow duration-300 group"
              >
                Безкоштовний аудит — без передоплати
                <ArrowIcon />
              </motion.button>

              <motion.a
                href="#calculator"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={SPRING}
                className="inline-flex items-center justify-center gap-2
                           border border-amber-900/50 text-white
                           font-semibold text-[0.875rem] uppercase tracking-[0.08em]
                           px-8 py-[15px] select-none cursor-pointer whitespace-nowrap
                           hover:border-[#FF6B00]/50 hover:bg-[#FF6B00]/[0.06] hover:text-[#FF6B00]
                           transition-colors duration-200"
              >
                Розрахувати вартість
              </motion.a>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              variants={statsContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-amber-900/25"
            >
              {STATS.map((s) => (
                <motion.div key={s.label} variants={statItem}>
                  <div className="text-[2rem] lg:text-[2.25rem] font-black text-[#FF6B00] leading-none mb-1.5 tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-[0.6875rem] text-amber-100/25 leading-snug uppercase tracking-[0.06em]">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

          </div>

          {/* ── Right column — slides from right ── */}
          <motion.div
            variants={fromRight}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.85, ease: EASE4, delay: 0.25 }}
            className="hidden xl:flex items-center justify-end"
          >
            <HeroCalcWidget />
          </motion.div>

        </div>
      </div>

      {/* ── Floating bottom-left accent dot ── */}
      {!reduceMotion && (
        <motion.div
          animate={{ y: [0, -6, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
          aria-hidden
          className="absolute bottom-20 left-8 hidden lg:block w-1.5 h-1.5 bg-[#FF6B00] pointer-events-none"
        />
      )}

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 pointer-events-none">
        <div className="w-px h-10 bg-gradient-to-b from-transparent via-[#FF6B00]/25 to-transparent" />
        <span className="text-[9px] text-amber-100/18 tracking-[0.28em] uppercase">scroll</span>
      </div>

    </section>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function ArrowIcon() {
  return (
    <svg
      width="14" height="14" viewBox="0 0 15 15" fill="none" aria-hidden
      className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
    >
      <path
        d="M2.5 7.5H12.5M12.5 7.5L8.5 3.5M12.5 7.5L8.5 11.5"
        stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <span className="w-5 h-5 shrink-0 flex items-center justify-center bg-[#FF6B00]/12 border border-[#FF6B00]/35">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path
          d="M2 6l3 3 5-5"
          stroke="#FF6B00" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
