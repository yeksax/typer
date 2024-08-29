/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts,css,md,scss}"],
  theme: {
    extend: {
      colors: {
        "zinc-850": "rgb(32 32 35)",
        "zinc-750": "rgb(55,55,61)",
      },
      borderRadius: {
        sm: ".25rem",
        xs: ".125rem",
      },
      fontSize: {
        xxs: ".625rem"
      },
      borderWidth: {
        2: '2.5px',
        4: '3.5px',
      },
      fontFamily: {
        source_code_pro: ["Source Code Pro"],
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
