"use client";

import { useState, useEffect } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FaqItem {
  q: string;
  a: string;
}

// ─── Hardcoded defaults ───────────────────────────────────────────────────────

const DEFAULT_FAQ: FaqItem[] = [
  {
    q: "Чому такі ціни на лендінг від $200?",
    a: "Ми спеціалізуємось виключно на меблевій та ремонтній ніші. У нас готові компоненти, відпрацьовані структури і розуміння вашої аудиторії — тому не витрачаємо час на нуль. Клієнт отримує продуманий продукт за адекватну ціну, а не «спасибі за терпіння».",
  },
  {
    q: "Реальний термін розробки лендінгу — скільки днів?",
    a: "Стандартний лендінг — 7 робочих днів після затвердження брифу. Express-варіант — 3–5 днів. До цього часу не входить брифінг і збір матеріалів — цей етап залежить від вас. Зазвичай весь цикл від першого дзвінка до здачі займає 10–14 днів.",
  },
  {
    q: "Як відбувається процес роботи?",
    a: "1. Безкоштовний брифінг — 30 хв дзвінок або анкета. 2. Технічне завдання та договір. 3. Дизайн-макет у Figma на затвердження. 4. Верстка та розробка. 5. Здача, тестування та публікація. 6. Налаштування реклами (за потреби). Жодної передоплати — розрахунок після здачі.",
  },
  {
    q: "Чи є технічна підтримка після запуску?",
    a: "Перший місяць підтримки включений у вартість. Якщо потрібна тривала підтримка — додаємо опцію «3 місяці підтримки» (+$80): виправлення багів, дрібні правки контенту, оновлення залежностей. Великі доопрацювання оцінюємо окремо.",
  },
  {
    q: "Які гарантії, що проект буде завершено?",
    a: "Ми працюємо за договором з чіткими термінами і переліком робіт. Оплата відбувається після здачі, а не до — ви нічим не ризикуєте. Якщо ми порушимо терміни з нашої вини, повертаємо передоплату (якщо була) або надаємо знижку на наступний проект.",
  },
  {
    q: "Чи займаєтесь хостингом, доменом та Email?",
    a: "Так. Допомагаємо зареєструвати домен, налаштувати хостинг (Vercel/Netlify — безкоштовно для більшості проектів) та корпоративну пошту. Це входить у вартість запуску без доплат.",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Faq() {
  const [items, setItems] = useState<FaqItem[]>(DEFAULT_FAQ);

  useEffect(() => {
    fetch("/api/admin/faq")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { question: string; answer: string }[] | null) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data.map((d) => ({ q: d.question, a: d.answer })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="faq" className="bg-ink-900 section-padding">
      <div className="container-wide">

        {/* Header */}
        <div className="mb-14" data-reveal>
          <span className="label-text block mb-4">Часті питання</span>
          <h2 className="heading-section text-white max-w-sm">
            Відповіді на питання, які виникають найчастіше
          </h2>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl" data-reveal data-delay="150">
          {items.map((item, i) => (
            <FaqAccordion key={i} item={item} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Accordion item ───────────────────────────────────────────────────────────

function FaqAccordion({
  item,
  defaultOpen,
}: {
  item: FaqItem;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div className="border-b border-white/[0.08] last:border-b-0">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-start justify-between gap-6 py-6 text-left
                   group focus-visible:outline-none"
      >
        <span className="text-[0.9375rem] font-semibold text-white/75
                         group-hover:text-white transition-colors duration-200 leading-snug">
          {item.q}
        </span>

        <span
          className={`shrink-0 mt-0.5 w-6 h-6 border flex items-center justify-center
                      transition-all duration-200 ${
            open
              ? "border-gold/50 bg-gold/[0.09]"
              : "border-white/15 group-hover:border-white/30"
          }`}
          aria-hidden
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 5h8" stroke={open ? "#C9A87C" : "rgba(255,255,255,0.5)"}
                  strokeWidth="1.4" strokeLinecap="round" />
            <path d="M5 1v8" stroke={open ? "#C9A87C" : "rgba(255,255,255,0.5)"}
                  strokeWidth="1.4" strokeLinecap="round"
                  style={{
                    opacity: open ? 0 : 1,
                    transform: open ? "scaleY(0)" : "scaleY(1)",
                    transformOrigin: "center",
                    transition: "opacity 0.2s, transform 0.2s",
                  }} />
          </svg>
        </span>
      </button>

      <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}>
        <div className="overflow-hidden">
          <p className="text-[0.9375rem] text-zinc-400 leading-[1.75] pb-7">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}
