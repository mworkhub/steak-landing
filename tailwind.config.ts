import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "ui-serif", "serif"],
      },
      colors: {
        gold: {
          50: "#FBF7F0",
          100: "#F4E8CF",
          200: "#E8D09F",
          300: "#DBB76F",
          400: "#C9A87C",
          500: "#B8956A",
          600: "#9A7850",
          700: "#7C5E3E",
          DEFAULT: "#C9A87C",
          light: "#D4B98A",
          dark: "#A8895C",
        },
        ink: {
          50: "#F5F5F5",
          100: "#E8E8E8",
          200: "#BFBFBF",
          300: "#8C8C8C",
          400: "#595959",
          500: "#2D2D2D",
          600: "#1A1A1A",
          700: "#111111",
          800: "#0C0C0C",
          900: "#080808",
          DEFAULT: "#111111",
        },
        cream: {
          DEFAULT: "#F2EDE7",
          dark: "#E8E0D6",
          light: "#FAF7F4",
        },
      },
      animation: {
        // "both" = тримає from-стан під час затримки + to-стан після завершення
        // це дозволяє stagger-анімації через animationDelay без flash of content
        "fade-up": "fadeUp 0.7s ease-out both",
        "fade-in": "fadeIn 0.5s ease-out both",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(32px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
