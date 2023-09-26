import React from 'react'

import './Community.css'

interface ICommunityControllerItemProps {
  controllerAddress: string,
  image: string,
  name: string,
  profileName: string,
  rating: number,
  tags: string | undefined,
  isOwner: boolean,
  deleteController: (address: string) => void
}

const CommunityControllerItem: React.FC<ICommunityControllerItemProps> = (props: ICommunityControllerItemProps) => {
  const {controllerAddress, image, name, profileName, rating, tags, isOwner, deleteController} = props

  const resolveRating = (star: number) => 
    rating === 0 ? 'regular' : rating >= star ? 'solid' : 'regular'

  return (
    <div className='Community-controller-item-container'>
      <div className='Community-controller-item-header'>
        <div className='Community-controller-item-profile'>{profileName}</div>
        {isOwner && (
          <button 
            className='Button-icon' 
            title='Delete' 
            onClick={() => deleteController(controllerAddress)}
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
        )}
      </div>

      <div className='Community-controller-item-name'>{name}</div>
      
      <img src={'https://byowave-resources-proteus.ams3.digitaloceanspaces.com/proteus-app-controller-images/306ff3dbb370454d9f855fb9becb47bac03eaef1.png'} alt='Controller Image' />

      {tags && (
        <div className='Community-controller-tag-container'>
          {tags.split(',').map(t => <div key={t} className='Community-controller-tag-item'>{`#${t} `}</div>)}
        </div>
      )}

      <div className='Community-controller-item-footer'>
        <div className='Community-controller-item-rating'>
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

export default CommunityControllerItem