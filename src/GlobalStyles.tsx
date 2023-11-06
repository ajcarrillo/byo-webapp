import React from 'react'
import { GlobalStyles as MuiGlobalStyles } from '@mui/material'

export default function GlobalStyles() {
  return (
    <MuiGlobalStyles
      styles={{
        '.font-play': {
          fontFamily: ['Play', 'serif'].join(','),
        },
        '.text-base': {
          fontSize: '1rem',
          lineHeight: '1.2',
          marginTop: '0.6em',
          marginBottom: '1.2em',
        },
        '.text-base-2': {
          fontSize: '0.61813rem',
          lineHeight: '1.2',
          marginTop: '0.6em',
          marginBottom: '1.2em',
        },
        '.caption': {
          fontSize: '0.38188rem',
          lineHeight: '1.2',
          marginTop: '0.6em',
          marginBottom: '1.2em',
        },
        '.caption-2': {
          fontSize: '0.23625rem',
          lineHeight: '1.2',
          marginTop: '0.6em',
          marginBottom: '1.2em',
        }
      }}
    />
  )
}
