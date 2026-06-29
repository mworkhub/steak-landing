// Server Component — contains <LeadForm> (client component, auto-promoted)
import LeadForm from "./LeadForm";

export default function LeadFormSection() {
  return (
    <section
      id="contacts"
      className="relative bg-ink-800 section-padding overflow-hidden"
    >
      {/* Warm radial accent */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 70% at 110% 110%, rgba(201,168,124,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">

          {/* ── Left: CTA copy ─────────────────────────────── */}
          <div className="lg:pt-2">
            <span className="label-text block mb-6">Безкоштовно</span>

            <h2 className="heading-section text-white mb-6 text-balance">
              Аудит вашого сайту або прорахунок нового — безкоштовно
            </h2>

            <p className="body-large text-white/48 mb-10">
              Залиште заявку — ми проаналізуємо ваш поточний сайт, знайдемо
              точки росту і покажемо, як збільшити кількість заявок.
              Якщо сайту ще немає — розрахуємо вартість під ваш оффер.
            </p>

            {/* Steps with connecting line */}
            <div className="relative space-y-0">
              {STEPS.map((step, i) => (
                <div key={step.title} className="relative flex gap-4 pb-7 last:pb-0">
                  {/* Vertical connector */}
                  {i < STEPS.length - 1 && (
                    <div
                      aria-hidden
                      className="absolute left-[15px] top-9 bottom-0 w-px bg-white/[0.08]"
                    />
                  )}

                  {/* Step number circle */}
                  <div
                    className="relative z-10 w-8 h-8 shrink-0 rounded-full
                               border border-gold/35 bg-ink-800
                               flex items-center justify-center
                               text-[0.6875rem] font-semibold text-gold"
                  >
                    {i + 1}
                  </div>

                  {/* Step text */}
                  <div className="pt-0.5">
                    <p className="text-[0.875rem] font-semibold text-white/75 leading-snug mb-1">
                      {step.title}
                    </p>
                    <p className="text-[0.8125rem] text-white/38 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust strip */}
            <div className="mt-10 pt-8 border-t border-white/[0.07] grid grid-cols-3 gap-4">
              {TRUST.map(({ value, label }) => (
                <div key={label}>
                  <div className="font-serif text-[1.75rem] font-bold text-white leading-none mb-1">
                    {value}
                  </div>
                  <div className="text-[0.6875rem] text-white/30 leading-snug">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: form card ───────────────────────────── */}
          <div className="bg-[#161617] border border-white/[0.07] p-8 lg:p-10">
            <div className="mb-8">
              <span className="label-text block mb-2">Залишити заявку</span>
              <h3 className="font-serif text-[1.375rem] font-bold text-white leading-snug">
                Отримати безкоштовний аудит або прорахунок
              </h3>
            </div>

            <LeadForm darkTheme />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Data ──────────────────────────────────────────────────────────────────

const STEPS = [
  {
    title: "Залишаєте заявку",
    desc:  "Заповніть форму — займе не більше хвилини",
  },
  {
    title: "Безкоштовний аудит",
    desc:  "Аналізуємо ваш поточний сайт та конкурентів у вашій ніші",
  },
  {
    title: "Презентація рішення",
    desc:  "Показуємо точки росту і фіксовану вартість розробки",
  },
  {
    title: "Розробка та запуск",
    desc:  "Здаємо результат у дедлайн, готуємо до Google Ads",
  },
] as const;

const TRUST = [
  { value: "30+",   label: "сайтів запущено в ніші" },
  { value: "7",     label: "днів до першого ліду" },
  { value: "95+",   label: "PageSpeed на кожному проекті" },
] as const;
