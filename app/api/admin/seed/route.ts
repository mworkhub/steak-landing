import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

async function isEmpty(supabase: ReturnType<typeof createServerClient>, table: string) {
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) return true;
  return (count ?? 0) === 0;
}

export async function POST() {
  const supabase = createServerClient();
  const seeded: string[] = [];
  const skipped: string[] = [];
  const errors: Record<string, string> = {};

  // ── Services ──────────────────────────────────────────────────────────────
  if (await isEmpty(supabase, "services")) {
    const { error } = await supabase.from("services").insert([
      { title: "Лендінг", price_from: 150, duration: "7 днів", icon_key: "landing", sort_order: 1, badge: "BESTSELLER",
        description: "Одна сторінка під рекламу — максимум заявок при мінімальній вартості кліку. Ідеально для старту або конкретного офферу.",
        features: ["Розробка під конкретний оффер і ЦА", "CRM-форма з Telegram-сповіщенням", "A/B структура для тестування гіпотез", "PageSpeed 95+ з першого деплою"] },
      { title: "Сайт-каталог", price_from: 450, duration: "2–3 тижні", icon_key: "catalog", sort_order: 2, badge: "ПОПУЛЯРНЕ",
        description: "Каталог меблів або ремонтних послуг з фільтрацією та формою замовлення. Легко оновлюється через адмін-панель.",
        features: ["Фільтрація за матеріалом, стилем, ціною", "Адмін-панель для управління товарами", "Інтеграція з Google Merchant", "SEO-структура під Київ / регіон"] },
      { title: "Корпоративний сайт", price_from: 800, duration: "3–4 тижні", icon_key: "corporate", sort_order: 3,
        description: "Представницький сайт компанії з портфоліо, відгуками та SEO-структурою. Будує довіру і дає органічний трафік.",
        features: ["SEO-оптимізація та семантична верстка", "Портфоліо, кейси, відгуки", "Google Analytics + Search Console", "CMS для самостійного оновлення"] },
      { title: "Інтернет-магазин", price_from: 1500, duration: "5–8 тижнів", icon_key: "catalog", sort_order: 4,
        description: "Повноцінний магазин з каталогом, кошиком, особистим кабінетом і оплатою. Підходить для масштабування онлайн-продажів.",
        features: ["Кошик, оплата (LiqPay / Monobank)", "Особистий кабінет покупця", "Інтеграція з Nova Post API", "Адмін-панель управління замовленнями"] },
      { title: "CRM-система", price_from: 1200, duration: "3–6 тижнів", icon_key: "crm", sort_order: 5,
        description: "Власна система для управління заявками і клієнтами. Більше не потрібні сторонні CRM — ваші дані у вашій базі.",
        features: ["Supabase / PostgreSQL — ваша БД", "Статуси заявок, Telegram-сповіщення", "Аналітика та звіти по менеджерах", "Захищений доступ через middleware"] },
      { title: "ERP-система", price_from: 3500, duration: "8–14 тижнів", icon_key: "crm", sort_order: 6,
        description: "Комплексна система для виробників: склад, виробничі замовлення, фінанси і логістика в одному місці.",
        features: ["Управління складом і виробництвом", "Інтеграція з 1С і банківськими API", "Фінансова аналітика і маржинальність", "Мультирольовий доступ для команди"] },
      { title: "Автоматизація", price_from: 400, duration: "1–3 тижні", icon_key: "landing", sort_order: 7,
        description: "Telegram-бот, автоматичні нагадування, onboarding-воронки. Скорочуємо ручну роботу менеджерів на 60–80%.",
        features: ["Telegram-бот для заявок і сповіщень", "Автоматичний onboarding клієнтів", "Нагадування про оплату і доставку", "Інтеграція з Nova Post, LiqPay, 1С"] },
    ]);
    if (error) errors["services"] = error.message;
    else seeded.push("services");
  } else skipped.push("services");

  // ── Calculator types ───────────────────────────────────────────────────────
  if (await isEmpty(supabase, "calc_types")) {
    const { error } = await supabase.from("calc_types").insert([
      { label: "Лендінг",            description: "Одна сторінка під рекламу — максимум лідів при мінімальній вартості кліку.",    base_price: 150,  duration: "7 днів",     sort_order: 1 },
      { label: "Сайт-каталог",       description: "Каталог меблів або ремонтних послуг з фільтрацією та формою замовлення.",           base_price: 450,  duration: "2–3 тижні",  sort_order: 2 },
      { label: "Корпоративний сайт", description: "Повноцінний багатосторінковий сайт компанії з SEO-структурою та портфоліо.",         base_price: 800,  duration: "3–4 тижні",  sort_order: 3 },
      { label: "Інтернет-магазин",   description: "Каталог меблів з кошиком, оплатою (LiqPay/Mono) та особистим кабінетом.",            base_price: 1500, duration: "5–8 тижнів", sort_order: 4 },
      { label: "CRM-система",        description: "Система для управління заявками, замовленнями та клієнтами вашої компанії.",         base_price: 1200, duration: "3–6 тижнів", sort_order: 5 },
    ]);
    if (error) errors["calc_types"] = error.message;
    else seeded.push("calc_types");
  } else skipped.push("calc_types");

  // ── Calculator addons ──────────────────────────────────────────────────────
  if (await isEmpty(supabase, "calc_addons")) {
    const { error } = await supabase.from("calc_addons").insert([
      { label: "Копірайтинг для сайту",          price: 80,  sort_order: 1 },
      { label: "SEO оптимізація",                price: 120, sort_order: 2 },
      { label: "Налаштування Google / Meta Ads", price: 150, sort_order: 3 },
      { label: "Telegram-бот для заявок",        price: 120, sort_order: 4 },
      { label: "3 місяці технічної підтримки",   price: 80,  sort_order: 5 },
    ]);
    if (error) errors["calc_addons"] = error.message;
    else seeded.push("calc_addons");
  } else skipped.push("calc_addons");

  // ── FAQ ────────────────────────────────────────────────────────────────────
  if (await isEmpty(supabase, "faq_items")) {
    const { error } = await supabase.from("faq_items").insert([
      { question: "Чому такі ціни на лендінг від $200?",
        answer: "Ми спеціалізуємось виключно на меблевій та ремонтній ніші. У нас готові компоненти, відпрацьовані структури і розуміння вашої аудиторії — тому не витрачаємо час на нуль. Клієнт отримує продуманий продукт за адекватну ціну, а не «спасибі за терпіння».",
        sort_order: 1 },
      { question: "Реальний термін розробки лендінгу — скільки днів?",
        answer: "Стандартний лендінг — 7 робочих днів після затвердження брифу. Express-варіант — 3–5 днів. До цього часу не входить брифінг і збір матеріалів — цей етап залежить від вас. Зазвичай весь цикл від першого дзвінка до здачі займає 10–14 днів.",
        sort_order: 2 },
      { question: "Як відбувається процес роботи?",
        answer: "1. Безкоштовний брифінг — 30 хв дзвінок або анкета. 2. Технічне завдання та договір. 3. Дизайн-макет у Figma на затвердження. 4. Верстка та розробка. 5. Здача, тестування та публікація. 6. Налаштування реклами (за потреби). Жодної передоплати — розрахунок після здачі.",
        sort_order: 3 },
      { question: "Чи є технічна підтримка після запуску?",
        answer: "Перший місяць підтримки включений у вартість. Якщо потрібна тривала підтримка — додаємо опцію «3 місяці підтримки» (+$80): виправлення багів, дрібні правки контенту, оновлення залежностей. Великі доопрацювання оцінюємо окремо.",
        sort_order: 4 },
      { question: "Які гарантії, що проект буде завершено?",
        answer: "Ми працюємо за договором з чіткими термінами і переліком робіт. Оплата відбувається після здачі, а не до — ви нічим не ризикуєте. Якщо ми порушимо терміни з нашої вини, повертаємо передоплату (якщо була) або надаємо знижку на наступний проект.",
        sort_order: 5 },
      { question: "Чи займаєтесь хостингом, доменом та Email?",
        answer: "Так. Допомагаємо зареєструвати домен, налаштувати хостинг (Vercel/Netlify — безкоштовно для більшості проектів) та корпоративну пошту. Це входить у вартість запуску без доплат.",
        sort_order: 6 },
    ]);
    if (error) errors["faq_items"] = error.message;
    else seeded.push("faq_items");
  } else skipped.push("faq_items");

  // ── Cases ──────────────────────────────────────────────────────────────────
  if (await isEmpty(supabase, "cases")) {
    const { error } = await supabase.from("cases").insert([
      { title: "Roble Furniture", client_niche: "Виробництво меблів",
        location: "Львів · виробництво меблів", project_type: "ERP-система",
        highlight: "+38% маржа", mockup_type: "crm", accent_color: "#C9A87C",
        project_link: "https://roble.com.ua",
        description: "ERP для меблевого виробника: єдина система складу, виробничих замовлень і фінансового обліку. Інтеграція з 1С і банківськими API. Більше жодних Excel-таблиць і втрачених замовлень.",
        stats_text: "+38%|зростання маржі\n12 тиж.|розробка\n1С|інтеграція" },
      { title: "Atelier OD", client_niche: "Пошиття та ательє",
        location: "Одеса · пошиття та ательє", project_type: "CRM + Інтернет-магазин",
        highlight: "−65% час обробки", mockup_type: "shop", accent_color: "#C9A87C",
        project_link: "https://atelier.od.ua",
        description: "Система управління замовленнями з 4-етапною воронкою, інтеграцією Нової Пошти і Telegram-ботом для клієнтів. Жодне замовлення більше не губиться — від заявки до видачі.",
        stats_text: "−65%|час обробки\n4 тиж.|розробка\nNova Post|інтеграція" },
      { title: "Дент.Світло", client_niche: "Стоматологія",
        location: "Київ · стоматологія", project_type: "Лендінг",
        highlight: "4.2× конверсія", mockup_type: "landing", accent_color: "#60a5fa",
        project_link: "https://dent-svitlo.ua",
        description: "Лендінг для запису на консультацію. До запуску форма була захована в Instagram — заявок майже не надходило. Після — конверсія виросла у 4.2 рази, і клініка запустила другий кабінет.",
        stats_text: "4.2×|конверсія\n6 дн.|до запуску\nCRM|для лікарів" },
      { title: "Luka Coffee", client_niche: "Мережа кав'ярень",
        location: "Львів · мережа кав'ярень", project_type: "Лендінг + Telegram-бот",
        highlight: "+1 200 замовлень / міс", mockup_type: "landing", accent_color: "#f59e0b",
        project_link: "https://luka.coffee",
        description: "Сайт мережі кав'ярень з Telegram-ботом для попередніх замовлень. Черги у пікові години скоротились, а лояльність постійних клієнтів зросла за рахунок персоналізованих знижок.",
        stats_text: "+1 200|замовлень / міс\n9 дн.|до запуску\nTelegram|бот замовлень" },
      { title: "Bridge Academy", client_niche: "Онлайн-освіта",
        location: "Дніпро · онлайн-освіта", project_type: "Автоматизація",
        highlight: "×3.1 активація", mockup_type: "crm", accent_color: "#a78bfa",
        description: "Telegram-бот для автоматичного онбордингу студентів: видача доступів, нагадування про оплату, welcome-серія. Активація учнів після покупки зросла у 3.1 рази — без участі менеджера.",
        stats_text: "×3.1|активація студентів\n2 тиж.|розробка\n0 руч.|операцій" },
      { title: "Avia Cargo", client_niche: "Авіа-логістика",
        location: "Київ · авіа-логістика", project_type: "CRM + Автоматизація",
        highlight: "×2 швидкість КП", mockup_type: "crm", accent_color: "#34d399",
        project_link: "https://avia-cargo.ua",
        description: "CRM для відділу продажів з автоматичним розрахунком тарифів через API авіаперевізників. Менеджери готують комерційну пропозицію вдвічі швидше — без ручного запиту ставок.",
        stats_text: "×2|швидкість КП\n5 тиж.|розробка\nAPI|авіаперевізники" },
    ]);
    if (error) errors["cases"] = error.message;
    else seeded.push("cases");
  } else skipped.push("cases");

  return NextResponse.json({ seeded, skipped, errors });
}
