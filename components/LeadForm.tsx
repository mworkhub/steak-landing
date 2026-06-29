"use client";

import { useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────

interface FormData {
  name:    string;
  phone:   string;
  website: string; // optional — current site or Instagram
  comment: string;
}

interface FormErrors {
  name?:  string;
  phone?: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

export interface LeadFormProps {
  onSuccess?: () => void;
  darkTheme?: boolean;
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function LeadForm({ onSuccess, darkTheme = false }: LeadFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name:    "",
    phone:   "",
    website: "",
    comment: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");

  // ─── Validation ────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const next: FormErrors = {};

    if (formData.name.trim().length < 2) {
      next.name = "Введіть ваше ім'я";
    }

    const digits = formData.phone.replace(/\D/g, "");
    if (digits.length < 10) {
      next.phone = "Введіть коректний номер телефону";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // ─── Field change (clears error on type) ───────────────────────────────

  const handleChange =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  // ─── Submit ────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/leads", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setStatus("success");
      onSuccess?.();
    } catch (err) {
      console.error("[LeadForm] submit error:", err);
      setStatus("error");
    }
  };

  // ─── Theme-dependent styles ────────────────────────────────────────────

  const s = {
    input:   darkTheme ? "input-field-dark" : "input-field",
    label:   `text-xs font-medium uppercase tracking-[0.15em] block mb-2.5 ${
               darkTheme ? "text-white/40" : "text-ink-300"}`,
    body:    darkTheme ? "text-white/45" : "text-ink-300",
    heading: darkTheme ? "text-white"    : "text-ink-800",
  };

  const isLoading = status === "loading";

  // ─── Success state ─────────────────────────────────────────────────────

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full border border-gold/50 flex items-center justify-center mb-6">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
            <path
              d="M4.5 11.5l5 5 8-9"
              stroke="#C9A87C"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className={`font-serif text-2xl font-bold mb-3 ${s.heading}`}>
          Заявку отримано!
        </h3>
        <p className={`text-sm max-w-[260px] leading-relaxed ${s.body}`}>
          Наш спеціаліст зв&apos;яжеться з вами протягом 30 хвилин
        </p>
      </div>
    );
  }

  // ─── Error state ───────────────────────────────────────────────────────

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full border border-red-500/40 flex items-center justify-center mb-6">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
            <circle cx="11" cy="11" r="9" stroke="#f87171" strokeWidth="1.4" />
            <path d="M11 7v5M11 15v.5" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <h3 className={`font-serif text-xl font-bold mb-3 ${s.heading}`}>
          Щось пішло не так
        </h3>
        <p className={`text-sm max-w-[240px] leading-relaxed mb-7 ${s.body}`}>
          Не вдалося надіслати заявку. Перевірте з&apos;єднання або
          напишіть нам напряму.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm text-gold underline underline-offset-4 hover:text-gold-dark transition-colors"
        >
          Спробувати ще раз
        </button>
      </div>
    );
  }

  // ─── Form ──────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-6">

        {/* Name */}
        <div>
          <label className={s.label}>Ваше ім&apos;я *</label>
          <input
            type="text"
            value={formData.name}
            onChange={handleChange("name")}
            placeholder="Наприклад: Олексій"
            className={s.input}
            autoComplete="name"
            disabled={isLoading}
          />
          {errors.name && (
            <p role="alert" className="text-xs text-red-400 mt-1.5">
              {errors.name}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className={s.label}>Телефон *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={handleChange("phone")}
            placeholder="+38 (0__) ___ __ __"
            className={s.input}
            autoComplete="tel"
            inputMode="tel"
            disabled={isLoading}
          />
          {errors.phone && (
            <p role="alert" className="text-xs text-red-400 mt-1.5">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Website / Instagram (optional) */}
        <div>
          <label className={s.label}>
            Ваш сайт або Instagram
            <span className={`ml-1.5 normal-case tracking-normal ${darkTheme ? "text-white/22" : "text-ink-200"}`}>
              (необов&apos;язково)
            </span>
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={handleChange("website")}
            placeholder="https://yoursite.ua або @your_instagram"
            className={s.input}
            autoComplete="url"
            inputMode="url"
            disabled={isLoading}
          />
        </div>

        {/* Comment */}
        <div>
          <label className={s.label}>
            Коментар
            <span className={`ml-1.5 normal-case tracking-normal ${darkTheme ? "text-white/22" : "text-ink-200"}`}>
              (необов&apos;язково)
            </span>
          </label>
          <textarea
            value={formData.comment}
            onChange={handleChange("comment")}
            placeholder="Що не влаштовує у поточному сайті? Яке завдання потрібно вирішити?"
            rows={3}
            className={`${s.input} resize-none`}
            disabled={isLoading}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-gold w-full justify-center py-4 text-sm tracking-wider
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <Spinner />
              Надсилаємо...
            </span>
          ) : (
            "Отримати безкоштовний аудит"
          )}
        </button>

        {/* Disclaimer */}
        <p className={`text-xs text-center leading-relaxed ${s.body}`}>
          Натискаючи кнопку, ви погоджуєтесь з{" "}
          <a
            href="#"
            className="underline underline-offset-2 hover:opacity-70 transition-opacity"
          >
            політикою конфіденційності
          </a>
        </p>
      </div>
    </form>
  );
}

// ─── Spinner ───────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden
    >
      <circle
        cx="7.5"
        cy="7.5"
        r="5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="18 12"
      />
    </svg>
  );
}
