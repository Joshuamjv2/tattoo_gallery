/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 15s linear infinite",
        pulseCustom: "pulseCustom 2s infinite",
      },
      fontFamily: {
        geo: ["Unageo", "sans-serif"],
        bangers: ["Bangers", "system-ui"],
        zume: ["Zuume", "system-ui"],
        roboto: ["Roboto", "system-ui"],
      },
      keyframes: {
        pulseCustom: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        ".thin-scrollbar": {
          "scrollbar-width": "thin",
          "scrollbar-color": "rgba(255, 255, 255, 0.2) transparent",
          "&::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: "3px",
          },
        },
      });
    }),
  ],
};
