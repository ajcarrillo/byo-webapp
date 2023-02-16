import React, { useEffect, useState } from 'react'
import parse from 'html-react-parser'

import { getProteusLocalisedText } from '../../../localisation/proteus.locale'
import './ProteusGallery.css'

interface IProteusGalleryProps {
  workspace: string,
  language: string
}

const ProteusGallery: React.FC<IProteusGalleryProps> = (props: IProteusGalleryProps) => {
  const [mappingVisible, setMappingVisible] = useState(false)

  useEffect(() => {
    setMappingVisible(props.workspace === 'gallery')
  }, [props.workspace])

  return (
    <>
      {props.workspace === 'gallery' ? (
        <div className={`Proteus-gallery-container ${mappingVisible ? 'open' : ''}`}>
          <div className='Proteus-gallery-header'>Controller Gallery</div>
        </div>      
      ) : (
        null
      )}
    </>
  )
}

export default ProteusGallery