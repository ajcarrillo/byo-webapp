import React from 'react'
import { Buttons, Colors } from '../../../StyleGuide'
import { Typography } from '@mui/material'


export const StyleGuidePage: React.FC = () => {
  const headings = [
    { tag: 'h1', class: 'tw-text-heading-1' },
    { tag: 'h2', class: 'tw-text-heading-2' },
    { tag: 'h3', class: 'tw-text-heading-3' },
    { tag: 'h4', class: 'tw-text-heading-4' },
    { tag: 'h5', class: 'tw-text-heading-5' },
    { tag: 'h6', class: 'tw-text-heading-6' },
  ]

  const textStyles = [
    { tag: 'p', class: 'body-large', label: 'Normal-1' },
    { tag: 'p', class: 'body-small', label: 'Normal-2' },
    { tag: 'p', class: 'caption', label: 'Caption' },
  ]

  const fonts = ['tw-font-bold', 'font-medium', 'font-regular', 'font-light']

  const playHeadings = [
    'h1', 'h2', 'h3', 'h4', 'h5'
  ]
  return (
    <div className='layout__page'>
      <h1>Typography Hind</h1>
      <div>
        {headings.map(heading => (
          <div key={heading.tag} className="tw-flex tw-flex-wrap tw-gap-4">
            {fonts.map(font => (
              React.createElement(
                heading.tag,
                {
                  key: font,
                  className: `${heading.class} ${font}`,
                },
                `${heading.tag.toUpperCase()}-${font.split('-')[1].charAt(0).toUpperCase() + font.split('-')[1].slice(1)}`
              )
            ))}
          </div>
        ))}

        <div className="body-large">Normal Text</div>

        {textStyles.map(style => (
          <div key={style.label} className="tw-flex tw-flex-wrap tw-gap-4">
            {fonts.map(font => (
              React.createElement(
                style.tag,
                {
                  key: font,
                  className: `${style.class} ${font}`,
                },
                `${style.label}-${font.split('-')[1].charAt(0).toUpperCase() + font.split('-')[1].slice(1)}`
              )
            ))}
          </div>
        ))}
      </div>
      <hr />
      <Typography variant='h1' className='font-play'>
        Typography Play
      </Typography>
      <div>
        {
          playHeadings.map(heading => (
            <div key={heading} className='tw-flex tw-flex-wrap tw-gap-4'>
              {/* @ts-ignore */}
              <Typography variant={heading} className='font-play tw-font-bold'>
                {`${heading}-Bold`}
              </Typography>
              {/* @ts-ignore */}
              <Typography variant={heading} className='font-play'>
                {`${heading}-Regular`}
              </Typography>
            </div>
          ))
        }
        <div className="font-play text-base tw-text-white tw-mb-4">Normal Text</div>
        <div className='tw-flex tw-flex-wrap tw-gap-4'>
          <div className="font-play text-base tw-text-white tw-font-bold">Normal-1-Bold</div>
          <div className="font-play text-base tw-text-white">Normal-1-Regural</div>
        </div>
        <div className='tw-flex tw-flex-wrap tw-gap-4'>
          <div className="font-play text-base-2 tw-text-white tw-font-bold">Normal-2-Bold</div>
          <div className="font-play text-base-2 tw-text-white">Normal-2-Regural</div>
        </div>
        <div className="font-play text-base tw-text-white tw-mb-4">Caption</div>
        <div className='tw-flex tw-flex-wrap tw-gap-4'>
          <div className="font-play caption tw-text-white tw-font-bold">Caption-1-Bold</div>
          <div className="font-play caption tw-text-white">Caption-1-Regural</div>
        </div>
        <div className='tw-flex tw-flex-wrap tw-gap-4'>
          <div className="font-play caption-2 tw-text-white tw-font-bold">Caption-2-Bold</div>
          <div className="font-play caption-2 tw-text-white">Caption-2-Regural</div>
        </div>
      </div>
      <hr />
      <Colors />
      <hr />
      <Buttons />
    </div>
  )
}

