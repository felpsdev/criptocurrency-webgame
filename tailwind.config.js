// tailwind.config.js
const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            primary: {
              DEFAULT: "#f39627",
              foreground: "#000000",
              50: "#fff2de",
              100: "#fddcb2",
              200: "#fac585",
              300: "#f6ad55",
              400: "#f39627",
              500: "#da7c0f",
              600: "#aa6109",
              700: "#794504",
              800: "#4a2800",
              900: "#1d0d00",
            },
            focus: "#f6ad55",
          },
        },
      },
    }),
  ],
};
