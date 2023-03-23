import React from 'react'
import Carousel from 'nuka-carousel'

import './ImageSlider.css'

interface IImageSliderProps {
  images: string[],
  width: string,
  height: string,
  carouselClass: string,
}

export const ImageSlider: React.FC<IImageSliderProps> = (props: IImageSliderProps) => {
  const { carouselClass, images, width, height } = props

  return (
    <div style={{width, height}}>
      <Carousel
        wrapAround={false} 
        slidesToShow={1}
      >
        {images.map((image: string, index: number) => 
          <img key={index} src={image} style={{width: '100%'}} />
        )}
      </Carousel>
    </div>
  )
}