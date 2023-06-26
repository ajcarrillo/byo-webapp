import React, { useCallback, useEffect, useState } from 'react'

import { ProteusMappingConfig } from '../../../types/proteus-types'
import { getProteusLocalisedText } from '../../../localisation/proteus.locale'
import ProteusMappingButtons from './ProteusMappingButtons'
import ProteusMappingAnalog from './ProteusMappingAnalog'
import ProteusMappingTrigger from './ProteusMappingTrigger'
import './ProteusMapping.css'

interface IProteusMappingProps {
  workspace: string,
  language: string,
  mapping: ProteusMappingConfig | null,
  gamepadReady: boolean
}

const ProteusMapping: React.FC<IProteusMappingProps> = (props: IProteusMappingProps) => {
  const [mappingVisible, setMappingVisible] = useState(false)
  const [selectedControl, setSelectedControl] = useState(props.mapping?.control || '')
  const [moduleButtons, setModuleButtons] = useState(props.mapping?.module?.module.buttons || [])

  const handleClickControlRemap = (control: string, mappedTo: string) => {
    //
  }

  const updateSelectedControl = useCallback(() => {
    setSelectedControl(props.mapping?.control || '')
    setModuleButtons(props.mapping?.module?.module.buttons || [])
  }, [props.mapping?.control, props.mapping?.module?.module.buttons])

  useEffect(() => {
    updateSelectedControl()
  }, [props.mapping?.control, updateSelectedControl])

  useEffect(() => {
    setMappingVisible(props.workspace === 'mapping')
  }, [props.workspace])

  return (
    <>
      {props.workspace === 'mapping' ? (
        <div className={`Proteus-mapping-container ${mappingVisible ? 'open' : ''}`}>
          <div className='Proteus-mapping-header'>
            {getProteusLocalisedText(`mapping.title.${props.mapping === null ? 'initialise' : props.mapping?.mode}.${props.language}`)}
          </div>

          {props.mapping === null && (
            <div className='Proteus-mapping-inner-container'>
              {!props.gamepadReady ? (
                <>
                  <div style={{textAlign: 'center'}}><i className='fa-solid fa-gamepad Proteus-mapping-initialise-container__red'></i></div>  
                  <div className='Proteus-mapping-text'>Please initialise your controller by pressing any button.</div>          
                </>
              ) : (
                <>
                  <div style={{textAlign: 'center'}}><i className='fa-solid fa-gamepad Proteus-mapping-initialise-container__green'></i></div>
                  <div className='Proteus-mapping-text'>You can remap your controller by clicking any button or moving a joystick.</div>                  
                </>
              )}
            </div>
          )}

          {props.mapping?.mode === 'button' && (
            <ProteusMappingButtons 
              selectedControl={selectedControl}
              buttons={moduleButtons}
              handleClickControlRemap={handleClickControlRemap}
            />
          )}

          {props.mapping?.mode === 'analog' && (
            <ProteusMappingAnalog 
              selectedControl={selectedControl}
              buttons={moduleButtons}
              handleClickControlRemap={handleClickControlRemap}
            />
          )}

          {props.mapping?.mode === 'trigger' && (
            <ProteusMappingTrigger 
              selectedControl={selectedControl}
              buttons={moduleButtons}
              handleClickControlRemap={handleClickControlRemap}
            />
          )}

        </div>      
      ) : (
        null
      )}
    </>
  )
}

export default ProteusMapping