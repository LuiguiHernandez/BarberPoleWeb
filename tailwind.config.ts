import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        premium: {
          bg: "#0B0F19",
          panel: "#0F172A",
          panel2: "rgba(255,255,255,0.03)",
          border: "rgba(255,255,255,0.08)",
          text: "#F8FAFC",
          muted: "#94A3B8",
          primary: "#3B82F6",
          primary2: "#60A5FA",
          danger: "#EF4444",
          danger2: "#F87171"
        },
      },
      boxShadow: {
        primary: "0 2px 12px rgba(59,130,246,0.25)",
      },
      fontFamily: {
        sans: ["DM Sans", "-apple-system", "BlinkMacSystemFont", "sans-serif"]
      }
    }
  },
  plugins: []
} satisfies Config;

