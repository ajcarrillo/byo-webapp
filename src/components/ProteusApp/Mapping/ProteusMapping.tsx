import React, { useEffect, useState } from 'react'
import parse from 'html-react-parser'

import { ProteusMappingConfig } from '../../../types/proteus-types'
import { RadioButton } from '../../CustomControls'
import { getProteusLocalisedText } from '../../../localisation/proteus.locale'
import './ProteusMapping.css'
import ScrollPanel from '../../ScrollPanel'

interface IProteusMappingProps {
  workspace: string,
  language: string,
  mapping: ProteusMappingConfig | null,
  gamepadReady: boolean
}

const ProteusMapping: React.FC<IProteusMappingProps> = (props: IProteusMappingProps) => {
  const [mappingVisible, setMappingVisible] = useState(false)
  const [buttonMapping, setBUttonMapping] = useState(props.mapping?.control || '')

  const handleClickButtonRemap = (button: string) => {
    setBUttonMapping(button)
  }

  useEffect(() => {
    handleClickButtonRemap(props.mapping?.control || '')
  }, [props.mapping?.control])

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
                  <div className='Proteus-mapping-initialise-text'>Please initialise your controller by clicking any button.</div>          
                </>
              ) : (
                <>
                  <div style={{textAlign: 'center'}}><i className='fa-solid fa-gamepad Proteus-mapping-initialise-container__green'></i></div>
                  <div className='Proteus-mapping-initialise-text'>Thank you. You may now remap your controller by clicking any button or moving a joystick.</div>                  
                </>
              )}
            </div>
          )}

          {props.mapping?.mode === 'button' && (
            <ScrollPanel 
              width={'100%'} 
              height={'calc(100% - 64px)'} 
              content={
                <div className='Proteus-mapping-inner-container'>
                  <div className='Proteus-mapping-radio-spacer'>
                    <RadioButton
                      size='big' 
                      value="y"
                      selected={buttonMapping}
                      text="Y"
                      onChange={(val: string) => handleClickButtonRemap(val)} 
                    />              
                  </div>
                  <div className='Proteus-mapping-radio-spacer'>
                    <RadioButton
                      size='big' 
                      value="b"
                      selected={buttonMapping}
                      text="B"
                      onChange={(val: string) => handleClickButtonRemap(val)} 
                    />              
                  </div>
                  <div className='Proteus-mapping-radio-spacer'>
                    <RadioButton
                      size='big' 
                      value="a"
                      selected={buttonMapping}
                      text="A"
                      onChange={(val: string) => handleClickButtonRemap(val)} 
                    />              
                  </div>
                  <div className='Proteus-mapping-radio-spacer'>
                    <RadioButton
                      size='big' 
                      value="x"
                      selected={buttonMapping}
                      text="X"
                      onChange={(val: string) => handleClickButtonRemap(val)} 
                    />              
                  </div>
                  <div className='Proteus-mapping-radio-spacer'>
                    <RadioButton
                      size='big' 
                      value="leftButton"
                      selected={buttonMapping}
                      text="L Bumper"
                      onChange={(val: string) => handleClickButtonRemap(val)} 
                    />              
                  </div>
                  <div className='Proteus-mapping-radio-spacer'>
                    <RadioButton
                      size='big' 
                      value="rightButton"
                      selected={buttonMapping}
                      text="R Bumper"
                      onChange={(val: string) => handleClickButtonRemap(val)} 
                    />              
                  </div>
                  <div className='Proteus-mapping-radio-spacer'>
                    <RadioButton
                      size='big' 
                      value="leftAnalogPress"
                      selected={buttonMapping}
                      text="L Stick Press"
                      onChange={(val: string) => handleClickButtonRemap(val)} 
                    />              
                  </div>
                  <div className='Proteus-mapping-radio-spacer'>
                    <RadioButton
                      size='big' 
                      value="rightAnalogPress"
                      selected={buttonMapping}
                      text="R Stick Press"
                      onChange={(val: string) => handleClickButtonRemap(val)} 
                    />              
                  </div>
                  <div className='Proteus-mapping-radio-spacer'>
                    <RadioButton
                      size='big' 
                      value="dPadUp"
                      selected={buttonMapping}
                      text="DPad Up"
                      onChange={(val: string) => handleClickButtonRemap(val)} 
                    />              
                  </div>
                  <div className='Proteus-mapping-radio-spacer'>
                    <RadioButton
                      size='big' 
                      value="dPadDown"
                      selected={buttonMapping}
                      text="DPad Down"
                      onChange={(val: string) => handleClickButtonRemap(val)} 
                    />              
                  </div>
                  <div className='Proteus-mapping-radio-spacer'>
                    <RadioButton
                      size='big' 
                      value="dPadLeft"
                      selected={buttonMapping}
                      text="DPad Left"
                      onChange={(val: string) => handleClickButtonRemap(val)} 
                    />              
                  </div>
                  <div className='Proteus-mapping-radio-spacer'>
                    <RadioButton
                      size='big' 
                      value="dPadRight"
                      selected={buttonMapping}
                      text="DPad Right"
                      onChange={(val: string) => handleClickButtonRemap(val)} 
                    />              
                  </div>
                </div>
              } 
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