import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#b9d0ff',
          300: '#8ab0ff',
          400: '#5686ff',
          500: '#2f5dfb',
          600: '#1c3ef0',
          700: '#182fd6',
          800: '#1a29ac',
          900: '#1b2887',
        },
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(16, 24, 64, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
