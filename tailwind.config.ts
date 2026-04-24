import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        premium: {
          bg:        "var(--pr-bg)",
          panel:     "var(--pr-panel)",
          topbar:    "var(--pr-topbar)",
          navBottom: "var(--pr-nav-bottom)",
          border:    "var(--pr-border)",
          text:      "var(--pr-text)",
          muted:     "var(--pr-muted)",
          primary:   "#4A7FA7",
          primary2:  "#3a6f97",
          danger:    "#dc2626",
          danger2:   "#ef4444",
          white:     "#ffffff",
          accent:    "#B3CFE5",
        },
      },
      boxShadow: {
        primary: "0 4px 16px rgba(74,127,167,0.25)",
        card:    "0 2px 8px rgba(10,25,49,0.06)",
      },
      fontFamily: {
        sans: ["DM Sans", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
