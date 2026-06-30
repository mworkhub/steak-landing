"use client";

import { useState, useEffect, useCallback } from "react";

interface NavbarProps {
  onOpenModal: () => void;
}

const NAV_LINKS = [
  { label: "Послуги",     href: "#services"    },
  { label: "Калькулятор", href: "#calculator"  },
  { label: "Кейси",       href: "#cases"       },
  { label: "FAQ",         href: "#faq"         },
  { label: "Контакти",    href: "#contacts"    },
] as const;

export default function Navbar({ onOpenModal }: NavbarProps) {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // set on mount in case page is pre-scrolled
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Body scroll lock
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", menuOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      {/* ─── Fixed header ───────────────────────────────── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-zinc-950/90 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent"
        }`}
      >
        <div className="container-wide">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">

            {/* Logo */}
            <a
              href="#"
              onClick={closeMenu}
              className="leading-none select-none flex items-baseline gap-[1px]"
            >
              <span className="font-mono text-[1.0625rem] font-bold tracking-[0.08em] uppercase text-white">
                СТЕК
              </span>
              <span className="font-mono text-[0.9375rem] text-[#FF6B00]/55 ml-[1px]">.<span className="animate-slash">/</span></span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-9" aria-label="Навігація">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className="text-[0.8125rem] font-medium text-white/50 hover:text-white
                             transition-colors duration-200 tracking-[0.025em]"
                >
                  {label}
                </a>
              ))}
            </nav>

            {/* Desktop right side */}
            <div className="hidden lg:flex items-center gap-5">
              <a
                href="https://t.me/steak_web"
                className="text-[0.8125rem] text-white/50 hover:text-white transition-colors"
              >
                Написати в Telegram
              </a>
              <button onClick={onOpenModal} className="btn-gold">
                Залишити заявку
              </button>
            </div>

            {/* Mobile: compact CTA + burger */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={onOpenModal}
                className="btn-gold px-4 py-2.5 text-xs sm:text-[0.8125rem] sm:px-5 sm:py-3"
              >
                Заявка
              </button>

              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? "Закрити меню" : "Відкрити меню"}
                aria-expanded={menuOpen}
                className="w-9 h-9 flex flex-col items-center justify-center gap-[5px]"
              >
                <span
                  className={`block w-5 h-px bg-white transition-all duration-300 ${
                    menuOpen ? "rotate-45 translate-y-[5px]" : ""
                  }`}
                />
                <span
                  className={`block w-5 h-px bg-white transition-all duration-300 ${
                    menuOpen ? "opacity-0 scale-x-0" : ""
                  }`}
                />
                <span
                  className={`block w-5 h-px bg-white transition-all duration-300 ${
                    menuOpen ? "-rotate-45 -translate-y-[9px]" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Mobile full-screen overlay ─────────────────── */}
      <div
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-40 bg-zinc-950 flex flex-col justify-center px-6 sm:px-10
                    transition-all duration-300 lg:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="w-full mb-10" aria-label="Мобільна навігація">
          {NAV_LINKS.map(({ label, href }, i) => (
            <a
              key={href}
              href={href}
              onClick={closeMenu}
              className="flex items-center justify-between font-serif text-[2.25rem] sm:text-[2.75rem]
                         font-bold text-white hover:text-gold transition-all duration-200
                         py-4 border-b border-white/[0.07]"
              style={{
                transitionDelay: menuOpen ? `${i * 50 + 80}ms` : "0ms",
                opacity:         menuOpen ? 1 : 0,
                transform:       menuOpen ? "translateX(0)" : "translateX(-12px)",
              }}
            >
              {label}
              <span className="text-gold/40 text-[1.5rem] font-normal">
                {String(i + 1).padStart(2, "0")}
              </span>
            </a>
          ))}
        </nav>

        <a
          href="https://t.me/steak_web"
          className="text-lg text-white/45 hover:text-white transition-colors mb-2"
          onClick={closeMenu}
        >
          Написати в Telegram
        </a>
        <a
          href="mailto:hello@steak.ua"
          className="text-sm text-white/25 hover:text-white/60 transition-colors"
        >
          hello@steak.ua
        </a>
      </div>
    </>
  );
}
