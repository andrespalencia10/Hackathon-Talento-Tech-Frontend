/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cavaltec: {
          50:  "#eef4fb",
          100: "#d4e6f5",
          200: "#a9cceb",
          300: "#7ab2e0",
          400: "#4ab3e8",
          500: "#4ab3e8",
          600: "#1a3a8f",
          700: "#152f75",
          800: "#10245b",
          900: "#0b1942",
        },
        "cav-sky": {
          50:  "#eaf6fd",
          100: "#c5e8f9",
          400: "#4ab3e8",
          500: "#2fa3dc",
          600: "#1a8ec5",
        },
        "cav-navy": {
          500: "#1a3a8f",
          600: "#152f75",
          700: "#10245b",
        },
      },
    },
  },
  plugins: [],
};
