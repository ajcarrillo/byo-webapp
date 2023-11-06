import React from 'react'
import theme from '../../theme'
import { PaletteColorOptions } from '@mui/material'

const ColorPalette: React.FC<{ colors: PaletteColorOptions }> = ({ colors }) => {
  const numbers = ['50', '100', '200', '300', '400', '500', 'A100', 'A200', 'A400', 'A700']
  return (
    <>
      <div className='tw-flex tw-gap-4 tw-flex-wrap'>
        {
          Object.keys(colors).map((color, i) => (
            numbers.includes(color) ? (<div key={i}>
              <div style={{ width: '200px', height: '100px', backgroundColor: colors[color as keyof PaletteColorOptions] }}></div>
              <p className='tw-flex tw-justify-between tw-text-white'>
                <span>
                  {color}
                </span>
                <span>
                  {colors[color as keyof PaletteColorOptions]}
                </span>
              </p>
            </div>) : null
          ))
        }
      </div>
    </>
  )
}

export const Colors: React.FC = () => {
  const {
    neutral,
    primary,
    secondary,
    highlight,
    'secondary-2': secondary2,
    'highlight-2': highlight2
  } = theme.palette!

  const blueGradients = [
    {
      type: 'horizontal',
      variants: [
        { value: '500', className: 'tw-bg-gradient-1-horizontal-500' },
        { value: '400', className: 'tw-bg-gradient-1-horizontal-400' },
        { value: '300', className: 'tw-bg-gradient-1-horizontal-300' }
      ]
    },
    {
      type: 'vertical',
      variants: [
        { value: '500', className: 'tw-bg-gradient-1-vertical-500' },
        { value: '400', className: 'tw-bg-gradient-1-vertical-400' },
        { value: '300', className: 'tw-bg-gradient-1-vertical-300' }
      ]
    },
    {
      type: 'diagonal',
      variants: [
        { value: '500', className: 'tw-bg-gradient-1-diagonal-500' },
        { value: '400', className: 'tw-bg-gradient-1-diagonal-400' },
        { value: '300', className: 'tw-bg-gradient-1-diagonal-300' }
      ]
    }
  ]

  const gradients2 = [
    {
      type: 'horizontal',
      variants: [
        { value: '500', className: 'tw-bg-gradient-2-horizontal-500' },
        { value: '400', className: 'tw-bg-gradient-2-horizontal-400' },
        { value: '300', className: 'tw-bg-gradient-2-horizontal-300' }
      ]
    },
    {
      type: 'vertical',
      variants: [
        { value: '500', className: 'tw-bg-gradient-2-vertical-500' },
        { value: '400', className: 'tw-bg-gradient-2-vertical-400' },
        { value: '300', className: 'tw-bg-gradient-2-vertical-300' }
      ]
    },
    {
      type: 'diagonal',
      variants: [
        { value: '500', className: 'tw-bg-gradient-2-diagonal-500' },
        { value: '400', className: 'tw-bg-gradient-2-diagonal-400' },
        { value: '300', className: 'tw-bg-gradient-2-diagonal-300' }
      ]
    }
  ]

  const gradients3 = [
    {
      type: 'horizontal',
      variants: [
        { value: '500', className: 'tw-bg-gradient-3-horizontal-500' },
        { value: '400', className: 'tw-bg-gradient-3-horizontal-400' },
        { value: '300', className: 'tw-bg-gradient-3-horizontal-300' }
      ]
    },
    {
      type: 'vertical',
      variants: [
        { value: '500', className: 'tw-bg-gradient-3-vertical-500' },
        { value: '400', className: 'tw-bg-gradient-3-vertical-400' },
        { value: '300', className: 'tw-bg-gradient-3-vertical-300' }
      ]
    },
    {
      type: 'diagonal',
      variants: [
        { value: '500', className: 'tw-bg-gradient-3-diagonal-500' },
        { value: '400', className: 'tw-bg-gradient-3-diagonal-400' },
        { value: '300', className: 'tw-bg-gradient-3-diagonal-300' }
      ]
    }
  ]

  return (
    <>
      <h1>Colors</h1>
      <div>
        {
          neutral ? <ColorPalette colors={neutral} /> : null
        }
      </div>
      <div>
        {
          primary ? <ColorPalette colors={primary} /> : null
        }
      </div>
      <div>
        {
          secondary ? <ColorPalette colors={secondary} /> : null
        }
      </div>
      <div>
        {
          secondary2 ? <ColorPalette colors={secondary2} /> : null
        }
      </div>
      <div>
        {
          highlight ? <ColorPalette colors={highlight} /> : null
        }
      </div>
      <div>
        {
          highlight2 ? <ColorPalette colors={highlight2} /> : null
        }
      </div>
      <h1>Gradients</h1>
      {blueGradients.map((gradient, index) => (
        <div key={index} className="tw-flex tw-flex-wrap tw-gap-4 tw-mb-4">
          {gradient.variants.map((variant, idx) => (
            <div
              key={idx}
              style={{ height: '100px', width: '200px' }}
              className={variant.className}
            ></div>
          ))}
        </div>
      ))}
      <p />
      {gradients2.map((gradient, index) => (
        <div key={index} className="tw-flex tw-flex-wrap tw-gap-4 tw-mb-4">
          {gradient.variants.map((variant, idx) => (
            <div
              key={idx}
              style={{ height: '100px', width: '200px' }}
              className={variant.className}
            ></div>
          ))}
        </div>
      ))}
      <p />
      {gradients3.map((gradient, index) => (
        <div key={index} className="tw-flex tw-flex-wrap tw-gap-4 tw-mb-4">
          {gradient.variants.map((variant, idx) => (
            <div
              key={idx}
              style={{ height: '100px', width: '200px' }}
              className={variant.className}
            ></div>
          ))}
        </div>
      ))}
    </>
  )
}