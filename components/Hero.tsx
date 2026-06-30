"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useRef } from "react";
import HeroCalcWidget from "./HeroCalcWidget";

// ─── Animation constants ──────────────────────────────────────────────────────

const EASE4   = [0.16, 1, 0.3, 1] as [number, number, number, number];
const SPRING  = { type: "spring", stiffness: 260, damping: 20 } as const;
const SPRING_MAG  = { stiffness: 180, damping: 18 } as const;
const SPRING_TILT = { stiffness: 200, damping: 30 };

// ─── Variants ─────────────────────────────────────────────────────────────────

const benefitItem = {
  hidden:  { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE4 } },
};
const benefitsList = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.65 } },
};
const statsContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.90 } },
};
const statItem = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE4 } },
};

// ─── Data ─────────────────────────────────────────────────────────────────────

// Split headline into lines for per-line text reveal
const HEADLINE_LINES = ["ЗРОБИМО", "САЙТ ДЛЯ", "МЕБЛЯРІВ"] as const;

const BENEFITS = [
  "Індивідуальна розробка під вашу нішу",
  "Адаптація під телефон та планшет",
  "PageSpeed 95+ — швидке завантаження",
  "Гарантія результату або повернення коштів",
] as const;

const STATS = [
  { value: "3–8%",   label: "конверсія лідів"      },
  { value: "95+",    label: "PageSpeed Score"       },
  { value: "100%",   label: "готовність до реклами" },
  { value: "7 днів", label: "лендінг до запуску"    },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Hero({ onOpenModal }: { onOpenModal: () => void }) {
  const reduceMotion = useReducedMotion();

  // ── Parallax glow blobs ──────────────────────────────────────────────────
  const { scrollY } = useScroll();
  const glow1Y = useTransform(scrollY, [0, 600], [0, -100]);
  const glow2Y = useTransform(scrollY, [0, 600], [0,  -55]);
  const glow3Y = useTransform(scrollY, [0, 600], [0,  -75]);

  // ── Magnetic CTA ─────────────────────────────────────────────────────────
  const magX = useMotionValue(0);
  const magY = useMotionValue(0);
  const btnX = useSpring(magX, SPRING_MAG);
  const btnY = useSpring(magY, SPRING_MAG);

  function onBtnMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    if (reduceMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    magX.set((e.clientX - r.left - r.width  / 2) * 0.35);
    magY.set((e.clientY - r.top  - r.height / 2) * 0.35);
  }
  function onBtnLeave() { magX.set(0); magY.set(0); }

  // ── 3D Tilt for calc widget ───────────────────────────────────────────────
  const tiltMX = useMotionValue(0);
  const tiltMY = useMotionValue(0);
  const rotX = useSpring(useTransform(tiltMY, [-0.5, 0.5], [10, -10]), SPRING_TILT);
  const rotY = useSpring(useTransform(tiltMX, [-0.5, 0.5], [-10, 10]), SPRING_TILT);

  function onTiltMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    tiltMX.set((e.clientX - r.left) / r.width  - 0.5);
    tiltMY.set((e.clientY - r.top)  / r.height - 0.5);
  }
  function onTiltLeave() { tiltMX.set(0); tiltMY.set(0); }

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0B090A]">

      {/* ── Layer: dark matter texture ── */}
      <div
        aria-hidden
        className="absolute inset-0 bg-repeat opacity-[0.18] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/dark-matter.png')" }}
      />

      {/* ── Layer: fine noise grain ── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.12]"
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
          backgroundImage: "linear-gradient(rgba(255,255,255,0.014) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.014) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* ── Parallax violet glow blobs ── */}
      <motion.div
        aria-hidden
        style={{ y: reduceMotion ? 0 : glow1Y }}
        className="absolute -top-[15%] -left-[10%] w-[560px] h-[560px]
                   bg-violet-600/12 blur-[140px] rounded-full pointer-events-none"
      />
      <motion.div
        aria-hidden
        style={{ y: reduceMotion ? 0 : glow2Y }}
        className="absolute top-1/2 -right-[5%] w-[420px] h-[420px]
                   bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        aria-hidden
        style={{ y: reduceMotion ? 0 : glow3Y }}
        className="absolute bottom-[5%] left-[30%] w-[300px] h-[300px]
                   bg-violet-700/8 blur-[100px] rounded-full pointer-events-none"
      />

      {/* ── Floating badge ── */}
      {!reduceMotion && (
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute top-32 right-10 hidden xl:flex flex-col items-center gap-2 z-10 select-none pointer-events-none"
        >
          <div className="border border-violet-500/30 px-3 py-1.5 bg-violet-500/10 backdrop-blur-sm">
            <span className="text-[0.625rem] font-black uppercase tracking-[0.2em] text-violet-300">
              Меблі · Ремонти
            </span>
          </div>
          <div className="w-px h-10 bg-gradient-to-b from-violet-500/30 to-transparent" />
        </motion.div>
      )}

      {/* ── Decorative vertical text ── */}
      <div aria-hidden className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-3 z-10 select-none">
        <span className="text-[9px] text-violet-100/10 tracking-[0.35em] uppercase" style={{ writingMode: "vertical-rl" }}>
          Web Studio — Kyiv, Ukraine
        </span>
        <span className="w-px h-20 bg-gradient-to-b from-transparent via-violet-500/18 to-transparent" />
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
              <span className="w-8 h-[2px] bg-gradient-to-r from-violet-500 to-indigo-500 flex-shrink-0" />
              <span className="text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-violet-400">
                СТЕЙК./ — веб-студія для меблевого та ремонтного бізнесу
              </span>
            </motion.div>

            {/* ── H1: Text Reveal — line by line ── */}
            <div className="mb-8">
              <h1 className="font-black uppercase tracking-tighter leading-[0.9] text-white
                             text-[3.25rem] sm:text-[4.5rem] lg:text-[5.5rem]">
                {HEADLINE_LINES.map((line, i) => (
                  <div key={line} className="overflow-hidden">
                    <motion.div
                      initial={{ y: "110%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.85, ease: EASE4, delay: 0.06 + i * 0.13 }}
                    >
                      {/* Last line gets the accent marker */}
                      {i === HEADLINE_LINES.length - 1 ? (
                        <>
                          {line}{" "}
                          <motion.span
                            initial={{ opacity: 0, scale: 0.75, rotate: -4 }}
                            animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
                            transition={{ duration: 0.65, ease: EASE4, delay: 0.62 }}
                            className="inline-block bg-gradient-to-r from-violet-600 to-indigo-600
                                       text-white px-3 py-1 leading-tight"
                          >
                            ЗА 7 ДНІВ
                          </motion.span>
                        </>
                      ) : line}
                    </motion.div>
                  </div>
                ))}
              </h1>
            </div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE4, delay: 0.30 }}
              className="text-[1rem] sm:text-[1.0625rem] text-zinc-400 leading-[1.78] max-w-[500px] mb-9"
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
                  <span className="text-[0.9375rem] text-zinc-400 leading-snug
                                   group-hover:text-zinc-200 transition-colors duration-200">
                    {b}
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE4, delay: 0.52 }}
              className="flex flex-col sm:flex-row gap-4 mb-16"
            >
              {/* ── Magnetic primary CTA ── */}
              <motion.button
                onClick={onOpenModal}
                onMouseMove={onBtnMouseMove}
                onMouseLeave={onBtnLeave}
                style={{ x: btnX, y: btnY }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 group
                           bg-gradient-to-r from-violet-600 to-indigo-600 text-white
                           font-black text-[0.875rem] uppercase tracking-[0.08em]
                           px-8 py-[15px] select-none cursor-pointer whitespace-nowrap
                           shadow-[0_0_28px_rgba(124,58,237,0.40)]
                           hover:shadow-[0_0_48px_rgba(124,58,237,0.65)]
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
                           border border-violet-900/50 text-zinc-400
                           font-semibold text-[0.875rem] uppercase tracking-[0.08em]
                           px-8 py-[15px] select-none cursor-pointer whitespace-nowrap
                           hover:border-violet-500/50 hover:bg-violet-500/[0.07] hover:text-violet-300
                           transition-colors duration-200"
              >
                Розрахувати вартість
              </motion.a>
            </motion.div>

            {/* Stats — stagger from below */}
            <motion.div
              variants={statsContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-violet-900/20"
            >
              {STATS.map((s) => (
                <motion.div key={s.label} variants={statItem}>
                  <div className="text-[2rem] lg:text-[2.25rem] font-black leading-none mb-1.5
                                  bg-gradient-to-r from-violet-400 to-indigo-400
                                  bg-clip-text text-transparent tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-[0.6875rem] text-zinc-500 leading-snug uppercase tracking-[0.06em]">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── Right column: 3D Tilt + levitating calc widget ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, ease: EASE4, delay: 0.22 }}
            className="hidden xl:flex items-center justify-end"
          >
            {/* 3D Tilt wrapper — tracks mouse position relative to this div */}
            <div
              onMouseMove={onTiltMove}
              onMouseLeave={onTiltLeave}
              style={{ perspective: "900px" }}
            >
              {/*
               * Two separate concerns on ONE motion.div:
               * - style.rotateX/Y — spring-driven 3D tilt from mouse
               * - animate.y keyframe — infinite levitation
               * Framer-motion merges these cleanly since they control different axes.
               */}
              <motion.div
                style={{
                  rotateX: rotX,
                  rotateY: rotY,
                  transformStyle: "preserve-3d",
                }}
                animate={reduceMotion ? {} : { y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              >
                <HeroCalcWidget />
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── Floating pulse dot ── */}
      {!reduceMotion && (
        <motion.div
          animate={{ opacity: [0.35, 0.65, 0.35], scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1.2 }}
          aria-hidden
          className="absolute bottom-20 left-8 hidden lg:block w-2 h-2 rounded-full
                     bg-gradient-to-r from-violet-500 to-indigo-500 pointer-events-none"
        />
      )}

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 pointer-events-none">
        <div className="w-px h-10 bg-gradient-to-b from-transparent via-violet-500/22 to-transparent" />
        <span className="text-[9px] text-violet-100/16 tracking-[0.28em] uppercase">scroll</span>
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
                     bg-violet-500/10 border border-violet-500/30">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path d="M2 6l3 3 5-5"
              stroke="#8b5cf6" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
