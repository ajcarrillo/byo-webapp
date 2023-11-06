/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  prefix: 'tw-',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  important: '#root',
  theme: {
    extend: {
      colors: {
        byowave: {
          'cta': 'var(--byowave-cta-colour)',
          'cta-dark': 'var(--byowave-cta-dark-colour)',
          'cta-hover': 'var(--byowave-cta-hover-colour)',
          'cta-disabled': 'var(--byowave-cta-disabled-colour)',
          'cta-text': 'var(--byowave-cta-text-colour)',
          'cta-disabled-text': 'var(--byowave-cta-disabled-text-colour)',
          'alert': 'var(--byowave-alert-colour)',
          'alert-text': 'var(--byowave-alert-text-colour)',
          'paragraph-text': 'var(--byowave-paragraph-text-colour)',
          'heading-text': 'var(--byowave-heading-text-colour)',
          'panel-bg': 'var(--byowave-panel-bg-colour)',
          'panel-hover-bg': 'var(--byowave-panel-hover-bg-colour)',
          'panel-text': 'var(--byowave-panel-text-colour)',
          'panel-text-light': 'var(--byowave-panel-text-light-colour)',
          'inputfield-bg': 'var(--byowave-inputfield-bg-colour)',
          'inputfield-text': 'var(--byowave-inputfield-text-colour)',
          'inputfield-text-disabled': 'var(--byowave-inputfield-text-disabled-colour)',
          'inputfield-placeholder-text': 'var(--byowave-inputfield-placeholder-text-colour)',
          'custom-control-border': 'var(--byowave-custom-control-border-colour)',
          'custom-control-bg': 'var(--byowave-custom-control-bg-colour)',
          'custom-control-inner': 'var(--byowave-custom-control-inner-colour)',
          'custom-control-text': 'var(--byowave-custom-control-text-colour)',
          'image-border': 'var(--byowave-image-border-colour)',
          'scrollbar-bg': 'var(--byowave-scrollbar-bg-colour)',
          'scrollbar-handle': 'var(--byowave-scrollbar-handle-colour)',
          'tab-bg': 'var(--byowave-tab-bg-colour)',
          'tab-selected-bg': 'var(--byowave-tab-selected-bg-colour)',
          'tab-text': 'var(--byowave-tab-text-colour)',
          'tab-selected-text': 'var(--byowave-tab-selected-text-colour)',
        },
        neutral: {
          1200: '#191D2A',
          1150: '#232530',
          1100: '#30343F',
          1050: '#424755',
          1000: '#555669',
          900: '#71738F',
          800: '#8A8CA6',
          700: '#A7A9C0',
          600: '#C1C3DA',
          500: '#9D9D9D',
          400: '#C0C0C0',
          300: '#D5D5D6',
          200: '#EBEBEF',
          100: '#FAFAFF',
        },
        primary: {
          500: '#4300BC',
          400: '#6A17FF',
          300: '#9154FF',
          200: '#B993FF',
          100: '#DBC8FF',
        },
        'secondary-1': {
          500: '#00ADB0',
          400: '#18DBDF',
          300: '#7DF0F2',
          200: '#9DFDFF',
          100: '#C2FEFF',
        },
        'secondary-2': {
          500: '#C92CC3',
          400: '#EE55E8',
          300: '#FFD8FA',
          200: '#FFB5FC',
          100: '#FFD2FD',
        },
        'highlight-1': {
          500: '#FBA500',
          400: '#FFC300',
          300: '#FFD85A',
          200: '#FFE387',
          100: '#FFEDB4',
        },
        'highlight-2': {
          500: '#6FDB1A',
          400: '#9DFE00',
          300: '#CAFF76',
          200: '#DBFFA3',
          100: '#E7FFC1',
        },
      },
      fontFamily: {
        'hind': ['Hind', 'sans-serif'],
        'play': ['Play', 'sans-serif'],
      },
      fontSize: {
        'heading-1': '3.582rem',  // 57.3px
        'heading-2': '2.987rem',  // 47.8px
        'heading-3': '2.488rem',  // 39.8px
        'heading-4': '2.075rem',  // 33.2px
        'heading-5': '1.725rem',  // 27.6px
        'heading-6': '1.438rem',  // 23px
        'body-large': '1rem',     // 16px
        'body-small': '0.694rem', // 11.1px
        'caption': '0.582rem'     // 9.3px
      },
      backgroundImage: {
        'gradient-1-horizontal-500': 'var(--highlight-1-horizontal-400, linear-gradient(180deg, #4300BC 0%, #00ADB0 100%));',
        'gradient-1-horizontal-400': 'var(--highlight-1-horizontal-400, linear-gradient(180deg, #6A17FF 0%, #17BBFF 100%));',
        'gradient-1-horizontal-300': 'var(--highlight-1-horizontal-300, linear-gradient(180deg, #9154FF 0%, #7DF0F2 100%));',
        'gradient-1-vertical-500': 'var(--highlight-1-vertical-500, linear-gradient(90deg, #4300BC 0%, #00ADB0 100%));',
        'gradient-1-vertical-400': 'var(--highlight-1-vertical-400, linear-gradient(90deg, #6A17FF 0%, #17BBFF 100%));',
        'gradient-1-vertical-300': 'var(--highlight-1-vertical-300, linear-gradient(90deg, #9154FF 0%, #7DF0F2 100%));',
        'gradient-1-diagonal-500': 'var(--highlight-1-diagonal-500, linear-gradient(104deg, #4300BC 0%, #00ADB0 100%));',
        'gradient-1-diagonal-400': 'var(--highlight-1-diagonal-400, linear-gradient(117deg, #6A17FF 0%, #17BBFF 100%));',
        'gradient-1-diagonal-300': 'var(--highlight-1-diagonal-300, linear-gradient(104deg, #9154FF 0%, #7DF0F2 100%));',

        'gradient-2-horizontal-500': 'var(--highlight-1-vertical-2-horizontal-500, linear-gradient(180deg, #C92CC3 0%, #FBA500 100%))',
        'gradient-2-horizontal-400': 'var(--highlight-1-vertical-2-horizontal-400, linear-gradient(180deg, #EE55E8 0%, #FEC200 100%))',
        'gradient-2-horizontal-300': 'var(--highlight-1-vertical-2-horizontal-300, linear-gradient(180deg, #FF8DFA 0%, #FFD85A 100%))',
        'gradient-2-vertical-500': 'var(--highlight-1-vertical-2-vertical-500, linear-gradient(90deg, #C92CC3 0%, #FBA500 100%))',
        'gradient-2-vertical-400': 'var(--highlight-1-vertical-2-vertical-400, linear-gradient(90deg, #EE55E8 0%, #FEC200 100%))',
        'gradient-2-vertical-300': 'var(--highlight-1-vertical-2-vertical-300, linear-gradient(90deg, #FF8DFA 0%, #FFD85A 100%))',
        'gradient-2-diagonal-500': 'var(--highlight-1-vertical-2-diagonal-500, linear-gradient(117deg, #C92CC3 0%, #FBA500 100%))',
        'gradient-2-diagonal-400': 'var(--highlight-1-vertical-2-diagonal-400, linear-gradient(117deg, #EE55E8 0%, #FEC200 100%))',
        'gradient-2-diagonal-300': 'var(--highlight-1-vertical-2-diagonal-300, linear-gradient(117deg, #FF8DFA 0%, #FFD85A 100%))',

        'gradient-3-horizontal-500': 'var(--highlight-gradient-3-horizontal-500, linear-gradient(180deg, #6FDB1A 0%, #00ADB0 100%))',
        'gradient-3-horizontal-400': 'var(--highlight-gradient-3-horizontal-400, linear-gradient(180deg, #9DFE00 0%, #14D9E5 100%))',
        'gradient-3-horizontal-300': 'var(--highlight-gradient-3-horizontal-300, linear-gradient(180deg, #CAFF76 0%, #7DF0F2 100%))',
        'gradient-3-vertical-500': 'var(--highlight-gradient-3-vertical-500, linear-gradient(99deg, #6FDB1A -10.9%, #00ADB0 97.14%))',
        'gradient-3-vertical-400': 'var(--highlight-gradient-3-vertical-400, linear-gradient(99deg, #9DFE00 -10.9%, #14D9E5 97.14%))',
        'gradient-3-vertical-300': 'var(--highlight-gradient-3-vertical-300, linear-gradient(99deg, #CAFF76 -10.9%, #7DF0F2 97.14%))',
        'gradient-3-diagonal-500': 'var(--highlight-gradient-3-diagonal-500, linear-gradient(117deg, #6FDB1A 0%, #00ADB0 100%))',
        'gradient-3-diagonal-400': 'var(--highlight-gradient-3-diagonal-400, linear-gradient(117deg, #9DFE00 0%, #14D9E5 100%))',
        'gradient-3-diagonal-300': 'var(--highlight-gradient-3-diagonal-300, linear-gradient(117deg, #CAFF76 0%, #7DF0F2 100%))',
      },
    }
  },
  plugins: []
}