// Server Component

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-900">
      {/* Top gold hairline */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="container-wide pt-14 pb-8">

        {/* ── Main grid ────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 pb-12 border-b border-white/[0.06]">

          {/* Column 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a
              href="#"
              className="leading-none select-none flex items-baseline gap-[1px]"
            >
              <span className="font-mono text-[1.0625rem] font-bold tracking-[0.08em] uppercase text-white">
                СТЕЙК
              </span>
              <span className="font-mono text-[0.9375rem] text-[#FF6B00]/55 ml-[1px]">.<span className="animate-slash">/</span></span>
            </a>

            <p className="mt-4 text-[0.875rem] text-white/32 leading-relaxed max-w-[240px]">
              Розробляємо лендінги, сайти-каталоги та інтернет-магазини
              виключно для меблевої та ремонтної ніші.
            </p>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-3">
              <SocialLink
                href="#"
                label="Instagram"
                icon={
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
                    <rect x="2" y="2" width="16" height="16" rx="4.5" />
                    <circle cx="10" cy="10" r="3.5" />
                    <circle cx="14.5" cy="5.5" r="0.75" fill="currentColor" stroke="none" />
                  </svg>
                }
              />
              <SocialLink
                href="https://t.me/steak_web"
                label="Telegram"
                icon={
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden>
                    <path
                      d="M2.5 9.5l14.5-6L13 17l-3.5-3.5L6 16l.5-4.5L14 7l-8 4.5L2.5 9.5z"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <FooterHeading>Навігація</FooterHeading>
            <ul className="space-y-3">
              {[
                { label: "Послуги",     href: "#services"   },
                { label: "Калькулятор", href: "#calculator" },
                { label: "Кейси",       href: "#cases"      },
                { label: "Відгуки",     href: "#reviews"    },
                { label: "FAQ",         href: "#faq"        },
                { label: "Контакти",    href: "#contacts"   },
              ].map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-[0.875rem] text-white/45 hover:text-gold transition-colors duration-200"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contacts */}
          <div>
            <FooterHeading>Контакти</FooterHeading>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://t.me/steak_web"
                  className="text-[0.875rem] text-white/45 hover:text-gold transition-colors duration-200"
                >
                  Telegram: @steak_web
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@steak.ua"
                  className="text-[0.875rem] text-white/45 hover:text-gold transition-colors duration-200"
                >
                  hello@steak.ua
                </a>
              </li>
              <li className="text-[0.875rem] text-white/20 pt-1">
                Київ · дистанційно по всій Україні
              </li>
              <li className="text-[0.875rem] text-white/20">
                Пн – Пт, 10:00 – 19:00
              </li>
            </ul>

            <div className="mt-6 text-[0.6875rem] text-white/18 leading-relaxed">
              Без передоплати.<br />
              Оплата після здачі проекту.
            </div>
          </div>
        </div>

        {/* ── Bottom bar ───────────────────────────────── */}
        <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[0.75rem] text-white/18">
            © {year}&nbsp;СТЕЙК./ — Всі системи працюють
          </p>
          <a
            href="#"
            id="privacy"
            className="text-[0.75rem] text-white/18 hover:text-white/45 transition-colors duration-200"
          >
            Політика конфіденційності
          </a>
        </div>
      </div>
    </footer>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-white/28 mb-5">
      {children}
    </h3>
  );
}

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-9 h-9 border border-white/[0.1] flex items-center justify-center
                 text-white/35 hover:text-gold hover:border-gold/30
                 transition-all duration-200"
    >
      <span className="w-[18px] h-[18px]">{icon}</span>
    </a>
  );
}
