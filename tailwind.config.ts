import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/context/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#3747d7',
          600: '#2f3fcb',
          700: '#2634ad'
        }
      },
      boxShadow: {
        soft: '0 12px 30px rgba(15, 23, 42, 0.12)'
      }
    }
  },
  plugins: []
};

export default config;
