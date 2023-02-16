import React, { useEffect, useState } from 'react'
import parse from 'html-react-parser'

import { getProteusLocalisedText } from '../../../localisation/proteus.locale'
import './ProteusMapping.css'

interface IProteusMappingProps {
  workspace: string,
  language: string,
  mappingType: 'button' | 'analog' | 'trigger'
}

const ProteusMapping: React.FC<IProteusMappingProps> = (props: IProteusMappingProps) => {
  const [mappingVisible, setMappingVisible] = useState(false)

  useEffect(() => {
    setMappingVisible(props.workspace === 'mapping')
  }, [props.workspace])

  return (
    <>
      {props.workspace === 'mapping' ? (
        <div className={`Proteus-mapping-container ${mappingVisible ? 'open' : ''}`}>
          <div className='Proteus-mapping-header'>
            {`${props.mappingType.charAt(0).toUpperCase()}${props.mappingType.slice(1)} Mapping`}
          </div>
        </div>      
      ) : (
        null
      )}
    </>
  )
}

export default ProteusMapping