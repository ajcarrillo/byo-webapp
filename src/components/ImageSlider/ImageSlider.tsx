import React from 'react'
import Carousel from 'nuka-carousel'

import './ImageSlider.css'

interface IImageSliderProps {
  images: string[],
  carouselClass: string,
}

export const ImageSlider: React.FC<IImageSliderProps> = (props: IImageSliderProps) => {
  const { carouselClass, images } = props

  const defaultControlsConfig = {
    nextButtonText: '>',
    prevButtonText: '<',
    pagingDotsStyle: {
      fill: 'red'
    }
  }

  const renderDotControls = (prop: any) => {
    const {slideCount, currentSlide, goToSlide} = prop
    return (
      <div
        style={{
          position: 'absolute',
          bottom: '0px',
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      >
        <ul
          style={{
            position: 'relative',
            margin: '0px',
            top: '28px',
            padding: '0px',
            display: 'flex'
          }}
        >
          {[...Array(slideCount)].map((sc, i) => (
            <li
              style={{ listStyleType: 'none', display: 'inline-block' }}
              key={i + 1}
            >
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  background: currentSlide === i ? 'var(--byowave-custom-control-inner-colour)' : 'var(--byowave-custom-control-bg-colour)',
                  borderRadius: '8px',
                  margin: '0 3px',
                  cursor: currentSlide === i ? 'default' : 'pointer'
                }}
                onClick={() => goToSlide(i)}
              ></div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div style={{paddingBottom: '36px'}}>
      <Carousel
        className={carouselClass}
        wrapAround={false} 
        slidesToShow={1}
        defaultControlsConfig={defaultControlsConfig} 
        renderBottomCenterControls={(props) => renderDotControls(props)}
      >
        {images.map((image: string, index: number) => 
          <img key={index} src={image} style={{maxWidth: '100%', height: '-webkit-fill-available'}} />
        )}
      </Carousel>
    </div>
  )
}