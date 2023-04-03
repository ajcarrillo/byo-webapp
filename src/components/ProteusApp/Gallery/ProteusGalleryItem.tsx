import React from 'react'

import './ProteusGallery.css'

interface IProteusGalleryItemProps {
  image: string,
  name: string,
  profileName: string,
  rating: number
}

const ProteusGalleryItem: React.FC<IProteusGalleryItemProps> = (props: IProteusGalleryItemProps) => {
  const {image, name, profileName, rating} = props

  const resolveRating = (star: number) => 
    rating === 0 ? 'regular' : rating >= star ? 'solid' : 'regular'

  return (
    <div className='Proteus-gallery-item-container'>
      <img src={image} alt='Controller Image' />
      <div className='Proteus-gallery-item-name'>{name}</div>
      <div className='Proteus-gallery-item-footer'>
        <div className='Proteus-gallery-item-profile'>{profileName}</div>
        <div className='Proteus-gallery-item-rating'>
          <i className={`fa-${resolveRating(1)} fa-star`}></i>
          <i className={`fa-${resolveRating(2)} fa-star`}></i>
          <i className={`fa-${resolveRating(3)} fa-star`}></i>
          <i className={`fa-${resolveRating(4)} fa-star`}></i>
          <i className={`fa-${resolveRating(5)} fa-star`}></i>
        </div>
      </div>
    </div>
  )
}

export default ProteusGalleryItem