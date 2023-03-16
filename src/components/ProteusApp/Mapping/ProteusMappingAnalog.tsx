import React, { useEffect, useState } from 'react'

import { ModuleButton } from '../../../types/controller-types'
import { getXBoxButtonParamFromString } from '../../../transformers/controller-transformers'
import ScrollPanel from '../../ScrollPanel'
import { Checkbox, RadioButton } from '../../CustomControls'
import './ProteusMapping.css'

interface IProteusMappingAnalogProps {
  selectedControl: string,
  buttons: ModuleButton[],
  handleClickControlRemap: (control: string, val: string) => void
}

const ProteusMappingAnalog: React.FC<IProteusMappingAnalogProps> = (props: IProteusMappingAnalogProps) => {
  const { buttons, selectedControl, handleClickControlRemap } = props
  const [inverted, setInverted] = useState('no')

  useEffect(() => {
    const invertedControl = buttons.find(b => b.defaultMapping === getXBoxButtonParamFromString(`${selectedControl}YStandard`))
    setInverted(invertedControl?.defaultMapping !== invertedControl?.mappedTo ? 'yes' : 'no')
  }, [buttons, selectedControl])

  return (
    <ScrollPanel 
      width={'100%'} 
      height={'calc(100% - 64px)'} 
      content={
        <div className='Proteus-mapping-inner-container'>
          <div className='Proteus-mapping-text'>Please note that flipping this analog stick&apos;s mapping, will also flip the other analog stick if attached. Two left sticks or two right sticks is not allowed.</div>  
          <div className='Proteus-mapping-radio-spacer' style={{marginTop: '2rem'}}>
            <RadioButton
              size='big' 
              value="leftAnalog"
              selected={selectedControl}
              text="L Stick"
              onChange={(val: string) => handleClickControlRemap(selectedControl, val)} 
            />              
          </div>
          <div className='Proteus-mapping-radio-spacer'>
            <RadioButton
              size='big' 
              value="rightAnalog"
              selected={selectedControl}
              text="R Stick"
              onChange={(val: string) => handleClickControlRemap(selectedControl, val)} 
            />              
          </div>
          <div className='Proteus-mapping-radio-spacer' style={{marginTop: '2rem'}}>
            <Checkbox
              size='big' 
              selectedValue="yes" 
              unselectedValue="no"
              value={inverted}
              text="Invert Y Axis"
              onChange={(val: string) => handleClickControlRemap(selectedControl, val)} 
            />
          </div>
        </div>
      } 
    />         
  )
}

export default ProteusMappingAnalog