// Server Component

export default function Testimonials() {
  return (
    <section id="reviews" className="bg-cream-light section-padding">
      <div className="container-wide">

        {/* Header */}
        <div data-reveal className="mb-14">
          <span className="label-text block mb-4">Відгуки клієнтів</span>
          <h2 className="heading-section text-ink-800 max-w-sm">
            Що кажуть власники меблевого та ремонтного бізнесу
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.author} item={t} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Card ──────────────────────────────────────────────────────────────────

function TestimonialCard({
  item,
  delay,
}: {
  item: (typeof TESTIMONIALS)[number];
  delay: number;
}) {
  return (
    <blockquote
      data-reveal
      data-delay={delay}
      className="group relative bg-white border border-cream-dark p-7
                 hover:border-gold/25 transition-colors duration-300 flex flex-col"
    >

      {/* Quote mark */}
      <div
        aria-hidden
        className="font-serif text-[3.5rem] leading-none text-gold/15 select-none mb-4 -mt-2"
      >
        &ldquo;
      </div>

      {/* Quote text */}
      <p className="text-[0.875rem] text-ink-500 leading-relaxed flex-1 mb-6">
        {item.quote}
      </p>

      {/* Author */}
      <footer className="border-t border-cream-dark pt-5">
        <cite className="not-italic">
          <span className="block text-[0.875rem] font-semibold text-ink-700">
            {item.author}
          </span>
          <span className="block text-[0.75rem] text-ink-300 mt-0.5">
            {item.role}, {item.company}
          </span>
        </cite>
        {item.result && (
          <div className="mt-3 inline-flex items-center gap-1.5 text-[0.6875rem]
                          text-gold font-semibold uppercase tracking-[0.12em]">
            <span className="w-3 h-px bg-gold" />
            {item.result}
          </div>
        )}
      </footer>

      {/* Left gold bar on hover */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px] bg-gold
                   origin-top scale-y-0 group-hover:scale-y-100
                   transition-transform duration-500 ease-out"
      />
    </blockquote>
  );
}

// ─── Data ──────────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote:
      "Запустили лендінг за 6 днів. Перші 14 заявок прийшли вже в перший тиждень — раніше стільки отримували за місяць через Instagram.",
    author:  "Андрій Коваленко",
    role:    "Власник",
    company: "KitchenPro.ua",
    result:  "14 лідів за тиждень",
  },
  {
    quote:
      "Команда зробила сайт-каталог з адмін-панеллю під ключ. Тепер оновлюю товари самостійно без розробника. Конверсія виросла вдвічі.",
    author:  "Олена Мартиненко",
    role:    "Директор",
    company: "МебліОПТ",
    result:  "+2× конверсія",
  },
  {
    quote:
      "Розробили CRM для управління замовленнями — замінила Excel і три різних програми. Час обробки замовлення скоротився з 20 до 7 хвилин.",
    author:  "Максим Лисенко",
    role:    "Засновник",
    company: "DesignHouse Kyiv",
    result:  "–65% час обробки",
  },
  {
    quote:
      "Лендінг під капітальний ремонт з Telegram-ботом. Заявки прийшли ще до здачі сайту — ми тестували трафік на попередньому домені. Рекомендую.",
    author:  "Вікторія Нечипоренко",
    role:    "CEO",
    company: "RenovaKyiv",
    result:  "Заявки до здачі",
  },
] as const;
