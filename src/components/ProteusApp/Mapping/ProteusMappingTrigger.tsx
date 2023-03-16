import React from 'react'

import { ModuleButton } from '../../../types/controller-types'
import ScrollPanel from '../../ScrollPanel'
import { RadioButton } from '../../CustomControls'
import './ProteusMapping.css'

interface IProteusMappingTriggerProps {
  selectedControl: string,
  buttons: ModuleButton[],
  handleClickControlRemap: (control: string, val: string) => void
}

const ProteusMappingTrigger: React.FC<IProteusMappingTriggerProps> = (props: IProteusMappingTriggerProps) => {
  const { selectedControl, handleClickControlRemap } = props

  return (
    <ScrollPanel 
      width={'100%'} 
      height={'calc(100% - 64px)'} 
      content={
        <div className='Proteus-mapping-inner-container'>
          <div className='Proteus-mapping-text'>Please note that flipping this trigger&apos;s mapping, will also flip the other trigger if attached. Two left triggers or two right triggers is not allowed.</div>  
          <div className='Proteus-mapping-radio-spacer' style={{marginTop: '2rem'}}>
            <RadioButton
              size='big' 
              value="leftTrigger"
              selected={selectedControl}
              text="L Trigger"
              onChange={(val: string) => handleClickControlRemap(selectedControl, val)} 
            />              
          </div>
          <div className='Proteus-mapping-radio-spacer'>
            <RadioButton
              size='big' 
              value="rightTrigger"
              selected={selectedControl}
              text="R Trigger"
              onChange={(val: string) => handleClickControlRemap(selectedControl, val)} 
            />              
          </div>
        </div>
      } 
    />         
  )
}

export default ProteusMappingTrigger