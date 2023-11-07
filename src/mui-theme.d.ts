// mui-theme.d.ts
import '@mui/material/styles'

type GradientValues = 300 | 400 | 500
type NeutralPaletteValues = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | 1050 | 1100 | 1150 | 1200
type ColorsValues = 100 | 200 | 300 | 400 | 500

type NeutralColorOverrides = {
  [K in `neutral-${NeutralPaletteValues}`]: true;
};

type NeutralPalette = {
  [K in `neutral-${NeutralPaletteValues}`]: Palette['primary'];
}

type NeutralPaletteOptions = {
  [K in `neutral-${NeutralPaletteValues}`]: PaletteOptions['primary'];
}

declare module '@mui/material/styles' {
  interface Palette extends NeutralPalette, PrimaryPalette {
    'secondary-2': Palette['primary']
    'highlight-2': Palette['primary']
    highlight: Palette['primary']
    neutral: Palette['primary']
    'gradient-1-horizontal': Palette['primary']
    'gradient-2-horizontal': Palette['primary']
    'gradient-3-horizontal': Palette['primary']
  }

  interface PaletteOptions extends NeutralPaletteOptions, PrimaryPaletteOptions {
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
  interface ButtonPropsColorOverrides extends NeutralColorOverrides {
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

declare module '@mui/material/AppBar' {
  interface AppBarPropsColorOverrides extends NeutralColorOverrides { }
}

declare module '@mui/material/Menu' {
  interface MenuPropsColorOverrides extends NeutralColorOverrides { }
}