/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}",
    // Add other paths as needed
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#570df8",
          "secondary": "#f000b8",
          "accent": "#37cdbe",
          "neutral": "#3d4451",
          "base-100": "#ffffff",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
        sunrise: {

          "primary": "#ff0000", // test with a simple hex color
          "primary-content": "oklch(97% 0.014 254.604)",
          "secondary": "oklch(62% 0.214 259.815)",
          "secondary-content": "oklch(97% 0.014 254.604)",
          "accent": "oklch(70% 0.14 182.503)",
          "accent-content": "oklch(98% 0.014 180.72)",
          "neutral": "oklch(14% 0.005 285.823)",
          "neutral-content": "oklch(98% 0 0)",
          "base-100": "oklch(98% 0 0)",
          "base-200": "oklch(96% 0.001 286.375)",
          "base-300": "oklch(92% 0.004 286.32)",
          "base-content": "oklch(21% 0.006 285.885)",
          "info": "oklch(62% 0.214 259.815)",
          "info-content": "oklch(97% 0.014 254.604)",
          "success": "oklch(72% 0.219 149.579)",
          "success-content": "oklch(98% 0.018 155.826)",
          "warning": "oklch(79% 0.184 86.047)",
          "warning-content": "oklch(98% 0.026 102.212)",
          "error": "oklch(65% 0.241 354.308)",
          "error-content": "oklch(97% 0.014 343.198)",
          "--radius-selector": "0.25rem",
          "--radius-field": "1rem",
          "--radius-box": "0.5rem",
          "--size-selector": "0.25rem",
          "--size-field": "0.25rem",
          "--border": "1px",
          "--depth": "0",
          "--noise": "1",
        },
      },
      "light", // you can add more built-in or custom themes
    ],
    darkTheme: false, // disables dark mode
    base: true, // enables base styles
    styled: true, // enables daisyUI styled components
    utils: true, // enables daisyUI utility classes
    logs: true, // disables daisyUI logs
    lightTheme: "sunrise", // set mytheme as the light them
    defaultTheme: "sunrise", // set sunrise as the default theme
  },
};
