/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#F8FAFF",
          card: "#FFFFFF",
          indigo: "#4F46F5",
          violet: "#7C3AED",
          cyan: "#06B6D4",
          mint: "#10B981",
          softBlue: "#EAF2FF",
          softLavender: "#F1ECFF",
          peach: "#FFEDD5",
          peachAccent: "#FB923C",
          warning: "#F59E0B",
          danger: "#EF4444",
          text: "#172554",
          muted: "#64748B",
          border: "#E2E8F0"
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(79, 70, 245, 0.06), 0 2px 8px -2px rgba(0, 0, 0, 0.04)',
        'elevated': '0 12px 32px -4px rgba(79, 70, 245, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'glow-indigo': '0 0 20px rgba(79, 70, 245, 0.25)',
        'glow-mint': '0 0 20px rgba(16, 185, 129, 0.25)',
        'glow-danger': '0 0 20px rgba(239, 68, 68, 0.25)',
      }
    },
  },
  plugins: [],
}
