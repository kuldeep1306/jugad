/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
theme: {
  extend: {
    colors: {
      paper: "#F5F3EE",
      ink: "#14162B",
      charcoal: "#2D2D35",
      muted: "#77737D",
      marigold: "#E9A23B",

      line: "#E5E1D8",

      darkcard: "#1B1B20",
      darkborder: "#303038",
      darkmuted: "#A5A1AA",
    },
  },
},
  plugins: [],
};