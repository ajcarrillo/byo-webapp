import { ThemeOptions, createTheme } from '@mui/material/styles'

const theme: ThemeOptions = createTheme({
  palette: {
    background: {
      default: '#1d1e29'
    },
    primary: {
      main: '#6A17FF',
      contrastText: '#fff',
      light: '#9154FF',
      dark: '#4300BC',
      500: '#4300BC',
      400: '#6A17FF',
      300: '#9154FF',
      200: '#B993FF',
      100: '#DBC8FF',
    },
    secondary: {
      main: '#18DBDF',
      contrastText: '#fff',
      light: '#7DF0F2',
      dark: '#00ADB0',
      500: '#00ADB0',
      400: '#18DBDF',
      300: '#7DF0F2',
      200: '#9DFDFF',
      100: '#C2FEFF',
    },
    'secondary-2': {
      main: '#EE55E8',
      contrastText: '#fff',
      light: '#FFD8FA',
      dark: '#C92CC3',
      500: '#C92CC3',
      400: '#EE55E8',
      300: '#FFD8FA',
      200: '#FFB5FC',
      100: '#FFD2FD',
    },
    highlight: {
      main: '#FFC300',
      contrastText: '#fff',
      light: '#FFD85A',
      dark: '#FBA500',
      500: '#FBA500',
      400: '#FFC300',
      300: '#FFD85A',
      200: '#FFE387',
      100: '#FFEDB4',
    },
    'highlight-2': {
      main: '#9DFE00',
      contrastText: '#191D2A',
      light: '#CAFF76',
      dark: '#6FDB1A',
      500: '#6FDB1A',
      400: '#9DFE00',
      300: '#CAFF76',
      200: '#DBFFA3',
      100: '#E7FFC1',
    },
    neutral: {
      A700: '#191D2A',
      A400: '#232530',
      A200: '#30343F',
      A100: '#424755',
      900: '#555669',
      800: '#71738F',
      700: '#8A8CA6',
      600: '#A7A9C0',
      500: '#C1C3DA',
      400: '#9D9D9D',
      300: '#C0C0C0',
      200: '#D5D5D6',
      100: '#EBEBEF',
      50: '#FAFAFF',
    },
    'gradient-1-horizontal': {
      light: 'linear-gradient(180deg, #9154FF 0%, #7DF0F2 100%)',
      main: 'linear-gradient(180deg, #6A17FF 0%, #17BBFF 100%)',
      dark: 'linear-gradient(180deg, #4300BC 0%, #00ADB0 100%)',
      300: 'linear-gradient(180deg, #9154FF 0%, #7DF0F2 100%)',
      400: 'linear-gradient(180deg, #6A17FF 0%, #17BBFF 100%)',
      500: 'linear-gradient(180deg, #4300BC 0%, #00ADB0 100%)',
    },
    'gradient-2-horizontal': {
      light: 'linear-gradient(180deg, #FF8DFA 0%, #FFD85A 100%)',
      main: 'linear-gradient(180deg, #EE55E8 0%, #FEC200 100%)',
      dark: 'linear-gradient(180deg, #C92CC3 0%, #FBA500 100%)',
      300: 'linear-gradient(180deg, #FF8DFA 0%, #FFD85A 100%)',
      400: 'linear-gradient(180deg, #EE55E8 0%, #FEC200 100%)',
      500: 'linear-gradient(180deg, #C92CC3 0%, #FBA500 100%)',
    },
    'gradient-3-horizontal': {
      light: 'linear-gradient(180deg, #CAFF76 0%, #7DF0F2 100%)',
      main: 'linear-gradient(180deg, #9DFE00 0%, #14D9E5 100%)',
      dark: 'linear-gradient(180deg, #6FDB1A 0%, #00ADB0 100%)',
      300: 'linear-gradient(180deg, #CAFF76 0%, #7DF0F2 100%)',
      400: 'linear-gradient(180deg, #9DFE00 0%, #14D9E5 100%)',
      500: 'linear-gradient(180deg, #6FDB1A 0%, #00ADB0 100%)',
    },
    'neutral-900': { main: '#71738F', contrastText: '#fff' },
    'neutral-800': { main: '#8A8CA6', contrastText: '#fff' },
    'neutral-700': { main: '#A7A9C0', contrastText: '#fff' },
    'neutral-600': { main: '#C1C3DA', contrastText: '#fff' },
    'neutral-500': { main: '#9D9D9D', contrastText: '#fff' },
    'neutral-400': { main: '#C0C0C0', contrastText: '#fff' },
    'neutral-300': { main: '#D5D5D6', contrastText: '#fff' },
    'neutral-200': { main: '#EBEBEF', contrastText: '#fff' },
    'neutral-100': { main: '#FAFAFF', contrastText: '#fff' },
    'neutral-1000': { main: '#555669', contrastText: '#fff' },
    'neutral-1050': { main: '#424755', contrastText: '#fff' },
    'neutral-1100': { main: '#30343F', contrastText: '#fff' },
    'neutral-1150': { main: '#232530', contrastText: '#fff' },
    'neutral-1200': { main: '#191B24', contrastText: '#fff' },
  },
  typography: {
    fontFamily: ['Hind', 'serif'].join(','),
  },
  components: {
    MuiCssBaseline: {
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          '&.font-play': {
            fontFamily: ['Play', 'serif'].join(','),
            fontSize: '7.33875rem',
            fontStyle: 'normal',
            lineHeight: '1.2',
            textTransform: 'uppercase',
            marginTop: '0.6em',
            marginBottom: '1.2em',
          }
        },
        h2: {
          '&.font-play': {
            fontFamily: ['Play', 'serif'].join(','),
            fontSize: '6.85375rem',
            fontStyle: 'normal',
            lineHeight: '1.2',
            marginTop: '0.6em',
            marginBottom: '1.2em',
          }
        },
        h3: {
          '&.font-play': {
            fontFamily: ['Play', 'serif'].join(','),
            fontSize: '4.235625rem',
            fontStyle: 'normal',
            lineHeight: '1.2',
            marginTop: '0.6em',
            marginBottom: '1.2em',
          }
        },
        h4: {
          '&.font-play': {
            fontFamily: ['Play', 'serif'].join(','),
            fontSize: '2.62375rem',
            fontStyle: 'normal',
            lineHeight: '1.2',
            marginTop: '0.6em',
            marginBottom: '1.2em',
          }
        },
        h5: {
          '&.font-play': {
            fontFamily: ['Play', 'serif'].join(','),
            fontSize: '1.618125rem',
            fontStyle: 'normal',
            lineHeight: '1.2',
            marginTop: '0.6em',
            marginBottom: '1.2em',
          }
        }
      }
    }
  }
})

export default theme