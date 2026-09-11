import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          50: "#EEF6FC",
          100: "#E0EFFE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0067C0",
          600: "#005BA1",
          700: "#004B85",
          800: "#003A69",
          900: "#002444",
          DEFAULT: "#0067C0",
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
          muted: "#94A3B8",
        },
        navy: {
          50: "#F0F7FF",
          100: "#E0EFFE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0284C7",
          600: "#0369A1",
          700: "#075985",
          800: "#0C4A6E",
          900: "#082F49",
          DEFAULT: "#0284C7",
        },
        cream: {
          50: "#FAFAFA",
          100: "#F8FAFC",
          200: "#F1F5F9",
          300: "#E2E8F0",
          DEFAULT: "#F8FAFC",
        },
        mustard: {
          400: "#0284C7",
          500: "#0067C0",
          600: "#005BA1",
          DEFAULT: "#0067C0",
        },
        ink: "#0F172A",
        paper: "#FFFFFF",
        primary: {
          50: "#EEF6FC",
          100: "#E0EFFE",
          200: "#BAE6FD",
          500: "#0067C0",
          600: "#005BA1",
          700: "#004B85",
          800: "#003A69",
          900: "#002444",
          DEFAULT: "#0067C0",
        },
      },
      fontFamily: {
        sans: ["Segoe UI", "Segoe UI Variable", "system-ui", "-apple-system", "BlinkMacSystemFont", "Tahoma", "sans-serif"],
        mono: ["Segoe UI Mono", "Cascadia Code", "JetBrains Mono", "monospace"],
        display: ["Segoe UI", "Segoe UI Variable", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "10px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 10px 25px -5px rgba(0, 0, 0, 0.04)",
        glass: "0 10px 30px -5px rgba(0, 103, 192, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8)",
        "glass-hover": "0 20px 40px -10px rgba(0, 103, 192, 0.16), 0 0 0 1px rgba(0, 103, 192, 0.15)",
        "glass-sm": "0 4px 16px -2px rgba(0, 103, 192, 0.05)",
        "glass-lg": "0 25px 50px -12px rgba(0, 103, 192, 0.2)",
        glow: "0 0 25px rgba(0, 103, 192, 0.25)",
        "glow-lg": "0 0 50px rgba(0, 103, 192, 0.35)",
        // Map legacy brutal shadows to smooth luminous elevations
        brutal: "0 4px 16px 0 rgba(0, 103, 192, 0.08)",
        "brutal-sm": "0 2px 8px 0 rgba(0, 0, 0, 0.04)",
        "brutal-lg": "0 12px 32px 0 rgba(0, 103, 192, 0.12)",
        "brutal-mustard": "0 8px 24px 0 rgba(0, 103, 192, 0.25)",
        "brutal-white": "0 8px 24px 0 rgba(255, 255, 255, 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
