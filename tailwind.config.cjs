/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts,css,md,scss}"],
  theme: {
    extend: {
      colors: {
        "zinc-850": "rgb(32 32 35)",
      },
      borderRadius: {
        sm: ".25rem",
        xs: ".125rem",
      },
      fontFamily: {
        source_code_pro: ["Source Code Pro"],
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
