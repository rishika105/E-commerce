/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      keyframes: {
        fade: {
          "0%, 100%": { opacity: "0" },
          "33%": { opacity: "1" },
        },
      },
      animation: {
        fade: "fade 5s infinite",
      },
    },
  },
  plugins: [],
};
