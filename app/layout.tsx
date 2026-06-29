import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ScrollObserver from "@/components/ScrollObserver";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const BASE_URL = "https://steak.ua";

export const viewport: Viewport = {
  themeColor: "#0C0C0C",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "STEAK — Преміальні сайти для меблевого та ремонтного бізнесу",
    template: "%s | STEAK",
  },
  description:
    "Розробляємо лендінги, сайти-каталоги та інтернет-магазини виключно для ніші меблів та ремонтів. Від $200. Без передоплати. Готово до Google Ads з першого дня.",
  keywords: [
    "сайт для меблевої компанії",
    "лендінг для ремонту",
    "інтернет-магазин меблів",
    "веб-студія меблі",
    "сайт під ключ ремонт",
    "розробка лендінгу Київ",
  ],
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: BASE_URL,
    siteName: "STEAK",
    title: "STEAK — Преміальні сайти для меблевого та ремонтного бізнесу",
    description:
      "Лендінги, каталоги та інтернет-магазини для меблевих компаній і ремонтних бригад. Без передоплати. PageSpeed 95+.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: BASE_URL },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="uk"
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-white text-ink-800 antialiased">
        <ScrollObserver />
        {children}
      </body>
    </html>
  );
}
