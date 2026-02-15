import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D4AF37',
          50: '#FDF8E8',
          100: '#FAF0D1',
          200: '#F5E1A3',
          300: '#F0D275',
          400: '#EBC347',
          500: '#D4AF37',
          600: '#A88C2A',
          700: '#7C691F',
          800: '#504614',
          900: '#242309',
        },
        secondary: {
          DEFAULT: '#1E3A8A',
          50: '#E8EBF4',
          100: '#D1D7E9',
          200: '#A3AFD3',
          300: '#7587BD',
          400: '#475FA7',
          500: '#1E3A8A',
          600: '#182E6D',
          700: '#122250',
          800: '#0C1733',
          900: '#060B17',
        },
        accent: {
          DEFAULT: '#F97316',
          50: '#FFF4E6',
          100: '#FFE9CC',
          200: '#FFD399',
          300: '#FFBD66',
          400: '#FFA733',
          500: '#F97316',
          600: '#C75B0F',
          700: '#95440A',
          800: '#632D06',
          900: '#311603',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Noto Sans Arabic', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
