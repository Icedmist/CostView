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
        navy: {
          50: "#EAF0F8",
          100: "#CBD9EC",
          200: "#9AB3D6",
          300: "#6A8CC0",
          400: "#2C5A8B",
          500: "#14365F",
          600: "#102B4C",
          700: "#0C203A",
          800: "#0A1931",
          900: "#06101E",
          DEFAULT: "#0A1931",
        },
        cream: {
          50: "#FFFEFB",
          100: "#F5F1E8",
          200: "#E8E0C8",
          300: "#D8CFC0",
          DEFAULT: "#F5F1E8",
        },
        mustard: {
          400: "#D1B15E",
          500: "#C9A227",
          600: "#A68A1E",
          DEFAULT: "#C9A227",
        },
        ink: "#0A0A0A",
        paper: "#FFFDF0",
        primary: {
          50: "#EAF0F8",
          100: "#CBD9EC",
          200: "#9AB3D6",
          500: "#14365F",
          600: "#0A1931",
          700: "#06101E",
          800: "#06101E",
          900: "#06101E",
        },
      },
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        display: ["Archivo Black", "Space Grotesk", "sans-serif"],
      },
      boxShadow: {
        // App softened: 4px (was 6px landing), 3px sm, 6px lg — dull mustard
        brutal: "4px 4px 0px 0px #0A1931",
        "brutal-sm": "3px 3px 0px 0px #0A1931",
        "brutal-lg": "6px 6px 0px 0px #0A1931",
        "brutal-mustard": "4px 4px 0px 0px #C9A227",
        "brutal-white": "4px 4px 0px 0px white",
      },
    },
  },
  plugins: [],
};

export default config;
