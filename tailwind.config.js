/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F1F6',
          100: '#CCE4ED',
          200: '#99C9DB',
          300: '#66ADC9',
          400: '#3392B7',
          500: '#1976A2',
          600: '#102A43', // Main
          700: '#0E2539',
          800: '#0B1F2F',
          900: '#091A24'
        },
        secondary: {
          50: '#E6F9FB',
          100: '#CCF3F7',
          200: '#99E7EF',
          300: '#66DBE7',
          400: '#33CFDF',
          500: '#0694A2', // Main
          600: '#057686',
          700: '#04586A',
          800: '#033B4D',
          900: '#022D31'
        },
        accent: {
          50: '#FCE8EA',
          100: '#F9D1D5',
          200: '#F3A3AB',
          300: '#ED7580',
          400: '#E74756',
          500: '#E12D39', // Main
          600: '#C01B26',
          700: '#A0151F',
          800: '#801018',
          900: '#600C12'
        },
        success: {
          50: '#E6F7EC',
          100: '#CCF0DA',
          200: '#99E1B5',
          300: '#66D290',
          400: '#33C36B',
          500: '#0CA750',
          600: '#0A8C43',
          700: '#087136',
          800: '#075629',
          900: '#053A1C'
        },
        warning: {
          50: '#FFF8E6',
          100: '#FFF1CC',
          200: '#FFE499',
          300: '#FFD666',
          400: '#FFC833',
          500: '#FFBA00',
          600: '#D69E00',
          700: '#AD8100',
          800: '#856400',
          900: '#5C4700'
        },
        error: {
          50: '#FDE7E7',
          100: '#FBCFCF',
          200: '#F7A0A0',
          300: '#F37070',
          400: '#EF4040',
          500: '#EB1010',
          600: '#C50D0D',
          700: '#9F0B0B',
          800: '#790808',
          900: '#520606'
        },
        neutral: {
          50: '#F6F7F9',
          100: '#EDEEF1',
          200: '#DBDDE3',
          300: '#C9CCD5',
          400: '#B7BBC7',
          500: '#A5A9B9',
          600: '#8A90A5',
          700: '#717891',
          800: '#5B617A',
          900: '#434963'
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};