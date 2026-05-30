// src/templates/styling.ts

export const getTailwindConfigTemplate = () => `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;

export const getPostcssConfigTemplate = () => `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;

export const getTailwindCssTemplate = () => `@tailwind base;
@tailwind components;
@tailwind utilities;
`;

export const getBasicCssTemplate = () => `body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
`;