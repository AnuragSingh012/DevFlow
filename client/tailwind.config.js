/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: {
          DEFAULT: "#000",
          100: "#000319",
          200: "rgba(17, 25, 40, 0.75)",
          300: "rgba(255, 255, 255, 0.125)",
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".custom-scroll": {
          overflow: "hidden",
          overflowY: "scroll",
          scrollbarWidth: "none" /* Firefox */,
        },
        ".custom-scroll::-webkit-scrollbar": {
          display: "none" /* Chrome, Safari, Opera */,
        },
      });
    },
  ],
};
