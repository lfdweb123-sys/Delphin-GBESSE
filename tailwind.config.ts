import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ink: "#16181d", muted: "#5b616b", line: "#e5e7eb", soft: "#f7f8f9", accent: "#1f4e46", gold: "#D4AF37" },
      fontFamily: { sans: ["var(--font-sans)", "system-ui", "sans-serif"], serif: ["var(--font-serif)", "Georgia", "serif"] },
      keyframes: { up: { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "none" } } },
      animation: { up: "up .5s ease-out both" },
    },
  },
  plugins: [],
};
export default config;
