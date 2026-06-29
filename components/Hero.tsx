import HeroCalcWidget from "./HeroCalcWidget";

interface HeroProps {
  onOpenModal: () => void;
}

export default function Hero({ onOpenModal }: HeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-ink-800">

      {/* ─── Layer 1: background photo ─── */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/hero-bg.jpg")' }}
      />

      {/* ─── Layer 2: gradient overlays ─── */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(12,12,12,0.97) 0%, rgba(12,12,12,0.90) 45%, rgba(12,12,12,0.55) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(12,12,12,0.80) 0%, transparent 50%)",
        }}
      />

      {/* ─── Layer 3: gold radial accent ─── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 0% 65%, rgba(201,168,124,0.11) 0%, transparent 65%)",
        }}
      />

      {/* ─── Layer 4: subtle grid ─── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* ─── Decorative vertical text (xl+) ─── */}
      <div
        aria-hidden
        className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-3 z-10 select-none"
      >
        <span
          className="text-[9px] text-white/18 tracking-[0.35em] uppercase"
          style={{ writingMode: "vertical-rl" }}
        >
          Web Studio — Kyiv, Ukraine
        </span>
        <span className="w-px h-20 bg-gradient-to-b from-white/0 via-white/12 to-white/0" />
      </div>

      {/* ─── Main content ─── */}
      <div className="container-wide relative z-10 pt-28 pb-20 lg:pt-36 lg:pb-28">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-10 xl:gap-14 items-center">
        <div className="max-w-[640px]">

          {/* Label — 0ms */}
          <div
            className="inline-flex items-center gap-3 mb-8 animate-fade-in"
            style={{ animationDelay: "0ms" }}
          >
            <span className="w-7 h-px bg-gold flex-shrink-0" />
            <span className="label-text">STEAK./ — веб-студія для меблевого та ремонтного бізнесу</span>
          </div>

          {/* H1 — 150ms */}
          <h1
            className="heading-display text-white mb-6 text-balance animate-fade-up"
            style={{ animationDelay: "150ms" }}
          >
            Преміальні сайти,{" "}
            <em className="not-italic text-gold">що генерують клієнтів</em>{" "}
            для меблевого та будівельного бізнесу
          </h1>

          {/* Subheadline — 290ms */}
          <p
            className="body-large max-w-[530px] mb-10 text-white/55 animate-fade-up"
            style={{ animationDelay: "290ms" }}
          >
            Розробляємо лендінги, корпоративні сайти та інтернет-магазини
            виключно для ніші меблів та ремонтів. Знаємо вашу аудиторію —
            і знаємо, як перетворити відвідувача на заявку.
          </p>

          {/* CTAs — 400ms */}
          <div
            className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-up"
            style={{ animationDelay: "400ms" }}
          >
            <button onClick={onOpenModal} className="btn-gold group">
              Безкоштовний аудит — без передоплати
              <ArrowIcon />
            </button>
            <a href="#calculator" className="btn-ghost">
              Розрахувати вартість
            </a>
          </div>

          {/* Stats strip — 510ms */}
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-white/10 animate-fade-up"
            style={{ animationDelay: "510ms" }}
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-serif text-3xl lg:text-4xl font-bold text-white leading-none mb-1.5">
                  {s.value}
                </div>
                <div className="text-xs text-white/35 leading-snug">{s.label}</div>
              </div>
            ))}
          </div>
        </div>{/* end left col */}

        {/* Right col: calc widget (xl+) */}
        <div className="hidden xl:flex items-center justify-end">
          <HeroCalcWidget />
        </div>

        </div>{/* end grid */}
      </div>

      {/* ─── Scroll indicator ─── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 pointer-events-none">
        <div className="w-px h-10 bg-gradient-to-b from-white/0 via-white/18 to-white/0" />
        <span className="text-[9px] text-white/22 tracking-[0.28em] uppercase">scroll</span>
      </div>
    </section>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function ArrowIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden
      className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1"
    >
      <path
        d="M2.5 7.5H12.5M12.5 7.5L8.5 3.5M12.5 7.5L8.5 11.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Data ──────────────────────────────────────────────────────────────────

const STATS = [
  { value: "3–8%",    label: "середня конверсія лідів на наших лендінгах" },
  { value: "95+",     label: "PageSpeed Score, Next.js App Router" },
  { value: "100%",    label: "готовність до Google / Meta Ads" },
  { value: "7 днів",  label: "MVP лендінг від брифу до здачі" },
] as const;
