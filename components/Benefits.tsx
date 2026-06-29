// Server Component

export default function Benefits() {
  return (
    <section id="benefits" className="bg-[#111111] section-padding">
      <div className="container-wide">

        {/* Header */}
        <div data-reveal className="max-w-xl mb-14 lg:mb-16">
          <span className="label-text block mb-4">Чому обирають нас</span>
          <h2 className="heading-section text-white">
            Чотири причини замовити сайт у нас
          </h2>
        </div>

        {/* 2×2 grid, 1-px gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.05]">
          {BENEFITS.map((item, index) => (
            <BenefitCard key={item.title} item={item} index={index} delay={index * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitCard({
  item,
  index,
  delay,
}: {
  item: (typeof BENEFITS)[number];
  index: number;
  delay: number;
}) {
  return (
    <div
      data-reveal
      data-delay={delay}
      className="group relative bg-[#111111] hover:bg-[#161717]
                 transition-colors duration-300 cursor-default overflow-hidden"
    >
      {/* Left gold reveal bar */}
      <div
        className="absolute left-0 inset-y-0 w-[2px] bg-gold
                   origin-top scale-y-0 group-hover:scale-y-100
                   transition-transform duration-500 ease-out"
      />

      <div className="p-8 lg:p-10">
        {/* Row: big number + icon */}
        <div className="flex items-start justify-between mb-7">
          <span
            className="font-serif text-[2.75rem] font-bold leading-none select-none
                       text-gold/[0.18] group-hover:text-gold/40
                       transition-colors duration-300"
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <div
            className="w-9 h-9 shrink-0 text-gold/30 group-hover:text-gold/75
                       transition-colors duration-300"
          >
            {item.icon}
          </div>
        </div>

        {/* Text */}
        <h3
          className="text-[0.9375rem] font-semibold text-white leading-snug
                     tracking-[-0.01em] mb-3"
        >
          {item.title}
        </h3>
        <p
          className="text-sm text-zinc-400 leading-relaxed
                     group-hover:text-zinc-300 transition-colors duration-300"
        >
          {item.description}
        </p>
      </div>
    </div>
  );
}

// ─── Data ──────────────────────────────────────────────────────────────────

const BENEFITS = [
  {
    title: "Знаємо меблеву нішу досконало",
    description:
      "Ми не робимо сайти «для всіх». Спеціалізація на меблях і ремонтах означає, що ми розуміємо болі вашого клієнта, знаємо, що він шукає, і будуємо шлях від кліку до заявки.",
    icon: (
      <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.35" aria-hidden>
        {/* Bullseye */}
        <circle cx="18" cy="18" r="13" />
        <circle cx="18" cy="18" r="7.5" />
        <circle cx="18" cy="18" r="2.5" fill="currentColor" stroke="none" opacity="0.5" />
        {/* Arrow */}
        <path d="M31 5l-2 2M29 7l-8.5 8.5" strokeLinecap="round" />
        <path d="M25 5h6v6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Конверсія — в пріоритеті над дизайном",
    description:
      "Гарно — важливо, але головне, щоб сайт приносив заявки. Кожна кнопка, заголовок і форма розміщуються там, де максимальна ймовірність дії користувача.",
    icon: (
      <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.35" aria-hidden>
        {/* Funnel */}
        <path d="M5 8h26l-10 13v9l-6-3V21L5 8z" strokeLinecap="round" strokeLinejoin="round" />
        {/* Rising arrow overlay */}
        <path d="M22 30l5-5M27 25v5h-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Сучасний стек: Next.js + Tailwind CSS",
    description:
      "Ваш сайт працює на тому ж стеку, що й Vercel, Apple і великі SaaS-продукти. Швидко, SEO-готово, без залежностей від плагінів і без технічного боргу.",
    icon: (
      <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.35" aria-hidden>
        {/* Code brackets */}
        <path d="M13 10l-7 8 7 8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M23 10l7 8-7 8" strokeLinecap="round" strokeLinejoin="round" />
        {/* Slash */}
        <path d="M20 8l-4 20" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Готовий до реклами з першого дня",
    description:
      "Google Analytics, Search Console, Meta Pixel і Conversion API — все підключається ще на етапі розробки. Запускаєте рекламу одразу після здачі, без зайвих налаштувань.",
    icon: (
      <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.35" aria-hidden>
        {/* Rocket body */}
        <path
          d="M20 6c-2.5 0-8.5 5-10 13l4.5 4.5C22 22 27 16 27 13c0-4-3-7-7-7z"
          strokeLinecap="round" strokeLinejoin="round"
        />
        {/* Flame */}
        <path d="M10 19l-3.5 7-1.5 1.5 7-3.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Porthole */}
        <circle cx="21" cy="15" r="2.5" />
      </svg>
    ),
  },
] as const;
