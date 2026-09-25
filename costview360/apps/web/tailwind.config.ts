import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          50: "#F0F4F9",
          100: "#E8EEF5",
          200: "#C3D4E6",
          300: "#87A6CB",
          400: "#4B6F9E",
          500: "#0A1931",
          600: "#0F2137",
          700: "#142C4E",
          800: "#071324",
          900: "#040A14",
          DEFAULT: "#0A1931",
        },
        win: {
          bg: "#F8FAFC",
          alt: "#FFFFFF",
        },
        content: "#F8FAFC",
        card: {
          DEFAULT: "#FFFFFF",
          hover: "#F1F5F9",
        },
        border: {
          DEFAULT: "#E2E8F0",
          subtle: "#F1F5F9",
        },
        text: {
          primary: "#0F172A",
          secondary: "#475569",
          muted: "#64748B",
        },
        navy: {
          50: "#F0F4F9",
          100: "#E8EEF5",
          200: "#C3D4E6",
          300: "#87A6CB",
          400: "#4B6F9E",
          500: "#2B4C7E",
          600: "#1E3A5F",
          700: "#142C4E",
          800: "#0F2137",
          900: "#0A1931",
          950: "#071324",
          DEFAULT: "#0A1931",
        },
        cream: {
          50: "#FAFAFA",
          100: "#F8FAFC",
          200: "#F1F5F9",
          300: "#E2E8F0",
          DEFAULT: "#FFFDF0",
        },
        mustard: {
          400: "#E8B838",
          500: "#D4A017",
          600: "#B5850E",
          DEFAULT: "#D4A017",
        },
        ink: "#0F172A",
        paper: "#FFFFFF",
        primary: {
          50: "#F0F4F9",
          100: "#E8EEF5",
          200: "#C3D4E6",
          500: "#0A1931",
          600: "#0F2137",
          700: "#142C4E",
          800: "#071324",
          900: "#040A14",
          DEFAULT: "#0A1931",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        display: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "12px",
        sm: "8px",
        md: "10px",
        lg: "14px",
        xl: "18px",
        "2xl": "24px",
        "3xl": "32px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.03), 0 10px 25px -5px rgba(0, 0, 0, 0.03)",
        glass: "0 8px 30px -4px rgba(2, 132, 199, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.02)",
        "glass-hover": "0 20px 45px -8px rgba(2, 132, 199, 0.16), 0 2px 6px 0 rgba(0, 0, 0, 0.03)",
        glow: "0 0 25px rgba(2, 132, 199, 0.35)",
        pearl: "0 20px 50px -12px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.9)",
        "brutal-mustard": "0 8px 24px 0 rgba(0, 103, 192, 0.25)",
        "brutal-white": "0 8px 24px 0 rgba(255, 255, 255, 0.5)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
