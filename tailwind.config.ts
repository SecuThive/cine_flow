import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: {
          950: "#020202",
          900: "#0b0b0f",
        },
        accent: {
          DEFAULT: "#e50914",
          blue: "#0a84ff",
        },
      },
      boxShadow: {
        poster: "0px 20px 45px rgba(0,0,0,0.45)",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(180deg, rgba(2,2,2,0.15) 0%, rgba(2,2,2,0.95) 80%)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
