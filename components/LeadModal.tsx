"use client";

import { useEffect, useCallback, useRef } from "react";
import LeadForm from "./LeadForm";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadModal({ isOpen, onClose }: LeadModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Keyboard: Esc to close
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );

  // Side effects: body lock + event listener + focus
  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    // Move focus into the panel for screen readers
    const raf = requestAnimationFrame(() => panelRef.current?.focus());

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKey]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Форма заявки на замір"
      // Modal is always mounted so the close animation can play;
      // pointer-events ensures it's non-interactive when hidden.
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center
                  p-0 sm:p-4 transition-all duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop — click to close */}
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`relative w-full sm:max-w-md bg-ink-800
                    border-t sm:border border-white/[0.08]
                    p-6 sm:p-8 lg:p-10
                    outline-none
                    max-h-[92svh] sm:max-h-none overflow-y-auto
                    transition-all duration-300 ease-out ${
          isOpen
            ? "translate-y-0 sm:translate-y-0 sm:scale-100 opacity-100"
            : "translate-y-full sm:translate-y-0 sm:scale-[0.96] opacity-0"
        }`}
        style={{ willChange: "transform, opacity" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Закрити"
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center
                     text-white/30 hover:text-white hover:bg-white/[0.06]
                     transition-all duration-200 rounded-sm"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
            <path
              d="M1.5 1.5l10 10M11.5 1.5l-10 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-8 pr-6">
          <span className="label-text block mb-2.5">Безкоштовно · Без передоплати</span>
          <h2 className="font-serif text-[1.5rem] font-bold text-white leading-snug">
            Аудит сайту або прорахунок нового
          </h2>
        </div>

        {/* Form — closes modal 3.5 s after success */}
        <LeadForm darkTheme onSuccess={() => setTimeout(onClose, 3500)} />
      </div>
    </div>
  );
}
