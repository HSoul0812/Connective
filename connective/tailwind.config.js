/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      "1bp": { min: "2074px" },
      "2bp": { max: "1241px" },
      "3bp": { min: "2300px" },
      "4bp": { max: "1905px" },
      "5bp": { min: "1516px" },
    },
    extend: {
      colors: {
        "white": "#FFFF",
        "desaturated-cyan": "#5FB4A2",
        "bright-red": "#F43030",
      }
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
