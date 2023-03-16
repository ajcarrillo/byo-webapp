import React, { useEffect, useState } from 'react'

import { ModuleButton } from '../../../types/controller-types'
import ScrollPanel from '../../ScrollPanel'
import { RadioButton } from '../../CustomControls'
import './ProteusMapping.css'

interface IProteusMappingButtonsProps {
  selectedControl: string,
  buttons: ModuleButton[],
  handleClickControlRemap: (control: string, val: string) => void
}

const ProteusMappingButtons: React.FC<IProteusMappingButtonsProps> = (props: IProteusMappingButtonsProps) => {
  const { selectedControl, handleClickControlRemap } = props

  return (
    <ScrollPanel 
      width={'100%'} 
      height={'calc(100% - 64px)'} 
      content={
        <div className='Proteus-mapping-inner-container'>
          <div className='Proteus-mapping-radio-spacer'>
            <RadioButton
              size='big' 
              value="y"
              selected={selectedControl}
              text="Y"
              onChange={(val: string) => handleClickControlRemap(selectedControl, val)} 
            />              
          </div>
          <div className='Proteus-mapping-radio-spacer'>
            <RadioButton
              size='big' 
              value="b"
              selected={selectedControl}
              text="B"
              onChange={(val: string) => handleClickControlRemap(selectedControl, val)} 
            />              
          </div>
          <div className='Proteus-mapping-radio-spacer'>
            <RadioButton
              size='big' 
              value="a"
              selected={selectedControl}
              text="A"
              onChange={(val: string) => handleClickControlRemap(selectedControl, val)} 
            />              
          </div>
          <div className='Proteus-mapping-radio-spacer'>
            <RadioButton
              size='big' 
              value="x"
              selected={selectedControl}
              text="X"
              onChange={(val: string) => handleClickControlRemap(selectedControl, val)} 
            />              
          </div>
          <div className='Proteus-mapping-radio-spacer'>
            <RadioButton
              size='big' 
              value="leftButton"
              selected={selectedControl}
              text="L Bumper"
              onChange={(val: string) => handleClickControlRemap(selectedControl, val)} 
            />              
          </div>
          <div className='Proteus-mapping-radio-spacer'>
            <RadioButton
              size='big' 
              value="rightButton"
              selected={selectedControl}
              text="R Bumper"
              onChange={(val: string) => handleClickControlRemap(selectedControl, val)} 
            />              
          </div>
          <div className='Proteus-mapping-radio-spacer'>
            <RadioButton
              size='big' 
              value="leftAnalogPress"
              selected={selectedControl}
              text="L Stick Press"
              onChange={(val: string) => handleClickControlRemap(selectedControl, val)} 
            />              
          </div>
          <div className='Proteus-mapping-radio-spacer'>
            <RadioButton
              size='big' 
              value="rightAnalogPress"
              selected={selectedControl}
              text="R Stick Press"
              onChange={(val: string) => handleClickControlRemap(selectedControl, val)} 
            />              
          </div>
          <div className='Proteus-mapping-radio-spacer'>
            <RadioButton
              size='big' 
              value="dPadUp"
              selected={selectedControl}
              text="DPad Up"
              onChange={(val: string) => handleClickControlRemap(selectedControl, val)} 
            />              
          </div>
          <div className='Proteus-mapping-radio-spacer'>
            <RadioButton
              size='big' 
              value="dPadDown"
              selected={selectedControl}
              text="DPad Down"
              onChange={(val: string) => handleClickControlRemap(selectedControl, val)} 
            />              
          </div>
          <div className='Proteus-mapping-radio-spacer'>
            <RadioButton
              size='big' 
              value="dPadLeft"
              selected={selectedControl}
              text="DPad Left"
              onChange={(val: string) => handleClickControlRemap(selectedControl, val)} 
            />              
          </div>
          <div className='Proteus-mapping-radio-spacer'>
            <RadioButton
              size='big' 
              value="dPadRight"
              selected={selectedControl}
              text="DPad Right"
              onChange={(val: string) => handleClickControlRemap(selectedControl, val)} 
            />              
          </div>
        </div>
      } 
    />         
  )
}

export default ProteusMappingButtons