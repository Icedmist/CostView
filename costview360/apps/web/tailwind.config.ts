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
          100: "#E6F0FB",
          200: "#CCE2F7",
          300: "#8EC2F2",
          400: "#3B92DE",
          500: "#0067C0",
          600: "#005BA1",
          700: "#004B85",
          800: "#003A69",
          900: "#002444",
          DEFAULT: "#0067C0",
        },
        win: {
          bg: "#F3F3F3",
          alt: "#FAFAFA",
        },
        content: "#FBFBFB",
        card: {
          DEFAULT: "#FFFFFF",
          hover: "#F5F5F5",
        },
        border: {
          DEFAULT: "#E5E5E5",
          subtle: "#F0F0F0",
        },
        text: {
          primary: "#1B1B1B",
          secondary: "#5C5C5C",
          muted: "#8B8B8B",
        },
        navy: {
          50: "#EEF2FB",
          100: "#E6F0FB",
          200: "#C9D9F5",
          300: "#7BA9F0",
          400: "#4F8BEA",
          500: "#1B3A6B",
          600: "#14213D",
          700: "#0D1B34",
          800: "#1B1B1B",
          900: "#141414",
          DEFAULT: "#1B1B1B",
        },
        cream: {
          50: "#FAFAFA",
          100: "#FBFBFB",
          200: "#F3F3F3",
          300: "#EAEAEA",
          DEFAULT: "#FBFBFB",
        },
        mustard: {
          400: "#0067C0",
          500: "#005BA1",
          600: "#004B85",
          DEFAULT: "#0067C0",
        },
        ink: "#1B1B1B",
        paper: "#FBFBFB",
        primary: {
          50: "#EEF6FC",
          100: "#E6F0FB",
          200: "#CCE2F7",
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
        DEFAULT: "8px",
        sm: "6px",
        md: "8px",
        lg: "10px",
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        card: "0 2px 8px 0 rgba(0, 0, 0, 0.04)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.08)",
        "glass-sm": "0 4px 16px 0 rgba(0, 0, 0, 0.04)",
        "glass-lg": "0 16px 48px 0 rgba(0, 0, 0, 0.12)",
        // Map brutal shadows to smooth elevations
        brutal: "0 4px 14px 0 rgba(0, 0, 0, 0.06)",
        "brutal-sm": "0 2px 6px 0 rgba(0, 0, 0, 0.04)",
        "brutal-lg": "0 10px 28px 0 rgba(0, 0, 0, 0.09)",
        "brutal-mustard": "0 4px 14px 0 rgba(0, 103, 192, 0.18)",
        "brutal-white": "0 4px 14px 0 rgba(255, 255, 255, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
