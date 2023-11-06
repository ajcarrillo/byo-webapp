// mui-theme.d.ts
import '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    'secondary-2': Palette['primary']
    'highlight-2': Palette['primary']
    highlight: Palette['primary']
    neutral: Palette['primary']
    'gradient-1-horizontal': Palette['primary']
    'gradient-2-horizontal': Palette['primary']
    'gradient-3-horizontal': Palette['primary']
  }

  interface PaletteOptions {
    'secondary-2'?: PaletteOptions['primary']
    'highlight-2'?: PaletteOptions['primary']
    highlight?: PaletteOptions['primary']
    neutral: PaletteOptions['primary']
    'gradient-1-horizontal': PaletteOptions['primary']
    'gradient-2-horizontal': PaletteOptions['primary']
    'gradient-3-horizontal': PaletteOptions['primary']
  }

  interface TypographyVariants {
    'font-play': React.CSSProperties;
    'text-base': React.CSSProperties;
    'text-base-2': React.CSSProperties;
    'caption': React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    'font-play'?: React.CSSProperties;
    'text-base'?: React.CSSProperties;
    'text-base-2'?: React.CSSProperties;
    'caption'?: React.CSSProperties;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    'secondary-2': true
    'highlight-2': true
    highlight: true
    'gradient-1-horizontal': true
    'gradient-2-horizontal': true
    'gradient-3-horizontal': true
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    'font-play': true
    'text-base': true
    'text-base-2': true
    'caption': true
  }
}