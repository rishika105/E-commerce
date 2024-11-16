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
        slide: {
          "0%, 33%": { transform: "translateX(0)" },
          "34%, 66%": { transform: "translateX(-1200px)" },
          "67%, 100%": { transform: "translateX(-2400px)" },
        },
      },
      animation: {
        fade: "fade 5s infinite",
        slide: "slide 5s infinite", // Add the slide animation
      },
    },
  },
  plugins: [],
};
