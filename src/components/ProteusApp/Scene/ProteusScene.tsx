import React, { useCallback, useEffect, useState } from 'react'
import Select, { SingleValue } from 'react-select'

import { SelectType } from '../../../types/global-types'
import { getProteusLocalisedText } from '../../../localisation/proteus.locale'
import { reactSelectCustomStyles } from '../../CustomControls/SelectDropdown/custom-styles'
import { ReactSelectInput } from '../../CustomControls/SelectDropdown/ReactSelectInput'
import './ProteusScene.css'

interface IProteusSceneProps {
  workspace: string,
  language: string,
  rotateController: (axis: string) => void,
  updateSceneLighting: (scene: string) => void
}

const ProteusScene: React.FC<IProteusSceneProps> = (props: IProteusSceneProps) => {
  const [homeVisible, setHomeVisible] = useState(false)
  const [lightingSelectionList, setLightingSelectionList] = useState<SelectType[]>([])
  const [selectedLightingName, setSelectedLightingName] = useState<SelectType | null>(null)

  const handleClickRotate = (axis: string) => {
    props.rotateController(axis)
  }

  const handleSceneLighting = (value: SingleValue<SelectType>) => {
    setSelectedLightingName(value)
    props.updateSceneLighting(value?.value || '')
  }

  /**
   * Generates a list of lighting setups
   */
  const generateTemplateSelectList = useCallback(() => {
    const list: SelectType[] = [
      {value: 'default', label: 'Default'},
      {value: 'morning', label: 'Morning'},
      {value: 'evening', label: 'Evening'},
      {value: 'photo', label: 'Photo Studio'},
      {value: 'cinema', label: 'Cinema'}
    ]   
    setLightingSelectionList(list)
    setSelectedLightingName({value: 'default', label: 'Default'})
  }, [])

  useEffect(() => {
    if(lightingSelectionList.length === 0) generateTemplateSelectList()
  }, [generateTemplateSelectList, lightingSelectionList.length])

  useEffect(() => {
    setHomeVisible(props.workspace === 'home')
  }, [props.workspace])

  return (
    <>
      {props.workspace === 'home' ? (
        <div className={`Proteus-scene-container ${homeVisible ? 'open' : ''}`}>
          <div className='Proteus-scene-header'>
            {getProteusLocalisedText(`scene.title.${props.language}`)}
          </div>

          <div className='Proteus-scene-inner-container'>
            <div className='Proteus-scene-text'>Use the rotation buttons to orient the 3D controller.</div>

            <div className='Proteus-scene-button-container'>
              <button className='Button-standard' onClick={() => handleClickRotate('x')}>X</button>
              <button className='Button-standard' onClick={() => handleClickRotate('y')}>Y</button>
              <button className='Button-standard' onClick={() => handleClickRotate('z')}>Z</button>
            </div>

            <div className='Proteus-scene-text'>Change the scene lighting.</div>

            <div className='Proteus-scene-select-container'>
              <Select 
                key={Date.now()}
                styles={reactSelectCustomStyles} 
                options={lightingSelectionList} 
                value={selectedLightingName} 
                onChange={(opt) => handleSceneLighting(opt)} 
                placeholder='Select a colour template' 
                components={{ Input: ReactSelectInput }} 
              /> 
            </div>
          </div>
        </div>      
      ) : (
        null
      )}
    </>
  )
}

export default ProteusScene