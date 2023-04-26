import React, { useCallback, useEffect, useState } from 'react'
import { RgbColorPicker } from 'react-colorful'
import Select, { SingleValue } from 'react-select'

import { AccessibilitySiteColour } from '../../types/disability-types'
import { 
  applyDefaultColours, 
  getSiteColourList, 
  applySiteColourTemplate, 
  getSiteColourTemplateList, 
  updateStoredAccessibilityColours 
} from '../../utils/accessibility-utils'
import { Checkbox } from '../CustomControls'
import { reactSelectCustomStyles } from '../CustomControls/SelectDropdown/custom-styles'
import { ReactSelectInput } from '../CustomControls/SelectDropdown/ReactSelectInput'
import './Accessibility.css'

type SelectType = {
  readonly value: string,
  readonly label: string,
}

type RGBColour = {
  r: number,
  g: number,
  b: number,
}

const AccessibilityContainer: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('template')

  const [defaultColours, setDefaultColours] = useState<AccessibilitySiteColour[]>()

  const [colourSelectionList, setColourSelectionList] = useState<SelectType[]>([])
  const [selectedColourName, setSelectedColourName] = useState<SelectType | null>(null)
  const [selectedColour, setSelectedColour] = useState<RGBColour>({r: 255, g: 255, b: 255})

  const [templateSelectionList, setTemplateSelectionList] = useState<SelectType[]>([])
  const [selectedTemplateName, setSelectedTemplateName] = useState<SelectType | null>(null)

  const [saveComplete, setSaveComplete] = useState(false)
  const [dummyCheckbox, setDummyCheckbox] = useState('no')

  /**
   * Returns the RGB value for a selected CSS variable
   * @returns The RGB value
   */
  const getSelectedColour = (colourName: string): RGBColour => {
    const col = getComputedStyle(document.documentElement).getPropertyValue(`--${colourName}`).replace(/\s/g,'')
    console.log(col)
    if(col){
      const rgb = col.substring(4, col.length-1).split(',')
      console.log(rgb)
      return { r: parseInt(rgb[0].trim()), g: parseInt(rgb[1].trim()), b: parseInt(rgb[2].trim()) }    
    } else {
      return {r: 255, g: 255, b: 255}
    }
  }

  /**
   * Generates a list of templates to select from
   */
  const generateTemplateSelectList = useCallback(() => {
    const templates = getSiteColourTemplateList()
    const list: SelectType[] = templates.map(t => {
      return {
        value: t.value,
        label: t.label,
      }
    })    
    setTemplateSelectionList(list)
  }, [])

  /**
   * Generates a list of colours to select from
   */
  const generateColourSelectList = useCallback(() => {
    if(defaultColours){
      const list: SelectType[] = defaultColours.map(c => {
        return {
          value: c.name,
          label: c.desc,
        }
      })    
      setColourSelectionList(list)
    }
  }, [defaultColours])

  /**
   * Grab the colour variables from App.css
   */
  const getSiteDefaultColours = () => {
    const defaultColourList = getSiteColourList()
    defaultColourList.forEach((c: AccessibilitySiteColour) => {
      c.colour = getComputedStyle(document.documentElement).getPropertyValue(`--${c.name}`)
    })
    setDefaultColours(defaultColourList)
  }

  /**
   * Handles the colour selection
   * @param value 
   */
  const handleColourSelectionChange = (value: SingleValue<SelectType>) => {
    setSelectedColourName(value)
    setSelectedColour(getSelectedColour(value?.value || ''))
  }

  /**
   * Handles the colour change
   * @param value 
   */
  const handleColourChange = (value: RGBColour) => {
    document.documentElement.style.setProperty(`--${selectedColourName?.value}`, `rgb(${value.r},${value.g},${value.b})`)
  }

  /**
   * Handles the colour selection
   * @param value 
   */
  const handleTemplateSelectionChange = (value: SingleValue<SelectType>) => {
    setSelectedTemplateName(value)
    applySiteColourTemplate(value?.value || '')
  }

  /**
   * Handles save button click - saves new colours or restores defaults
   */
  const handleClickSaveColours = (saveNew: boolean) => {
    if(saveNew){
      if(defaultColours){
        const newColours: AccessibilitySiteColour[] = defaultColours.map(c => {
          return {
            name: c.name,
            desc: c.desc,
            colour: getComputedStyle(document.documentElement).getPropertyValue(`--${c.name}`)
          }
        })
        updateStoredAccessibilityColours(newColours)  
        setSaveComplete(true)
        setSelectedColourName(null)
        setSelectedColour(getSelectedColour(''))
        setSelectedTemplateName(null)
      }      
    }else{
      updateStoredAccessibilityColours()
      applyDefaultColours()
      setSelectedColourName(null)
      setSelectedColour(getSelectedColour(''))
      setSelectedTemplateName(null)
    }
  }

  /**
   * Dummy click handler for form controls
   * @param value 
   */
  const handleClickDummyCheckbox = (value: string) => {
    setDummyCheckbox(value)
  }

  /**
   * Switches gallery tabs
   * @param tab 
   */
  const handleClickTab = (tab: string) => {
    if(selectedTab !== tab) setSelectedTab(tab)
  }

  useEffect(() => {
    if(!defaultColours) getSiteDefaultColours()
  }, [defaultColours])

  useEffect(() => {
    if(defaultColours && colourSelectionList.length === 0) generateColourSelectList()
  }, [colourSelectionList, defaultColours, generateColourSelectList])

  useEffect(() => {
    if(templateSelectionList.length === 0) generateTemplateSelectList()
  }, [generateTemplateSelectList, templateSelectionList.length])

  return (
    <div className={'App-container'}>
      <div className='Accessibility-container'>
        <h1><span className="Colour-blue-bright">Accessibility</span><span className="Colour-white-bright"> For</span><span className="Colour-blue-bright"> All</span></h1>
        <p style={{ marginTop: '1rem', color: 'rgb(175,182,219)', fontSize: '.9rem'}}>At Byowave we are passionate about ensuring that everything we create is accessibile to everyone, no matter what your disability may be. Using this tool you can customise the colours on our website, which we trust will help those of you with colour blindness or other colour-contrast related issues.</p>
        <p style={{ marginTop: '.6rem', color: 'rgb(175,182,219)', fontSize: '.9rem'}}>Below is an example form of the components we use on our website in their default colours. Use the menu on the right to select the colours you want to change, then using the color picker select a new colour for the components. Don’t forget to save your changes when you are finished.</p>
        
        <div className='Accessibility-colours-container'>
          <div className='Accessibility-colours-leftCol'>
            <div className="PanelLabel">Panels are used to relay information about the content on a page.</div>
            
            <h2 style={{ marginTop: '1rem'}}>Hello, I&apos;m a Heading</h2>

            <p style={{ marginTop: '1rem'}}>Hello, I&apos;m a Paragraph</p>

            <a href='#' title='Hello, I&apos;m a Hyperlink using the Call To Action colours' style={{ marginTop: '1rem', display: 'block'}}>Hello, I&apos;m a Hyperlink using the Call To Action colours</a>
            
            <input
              className="Textfield-dark" 
              type='text' 
              placeholder="Input field plceholder text" 
              style={{ marginTop: '1rem', width: '100%' }}
              data-lpignore="true"
              autoComplete='off'
            />

            <input
              className="Textfield-dark" 
              type='text' 
              defaultValue='Input field text'
              placeholder="Input field text" 
              style={{ marginTop: '1rem', width: '100%' }}
              data-lpignore="true"
              autoComplete='off'
            />

            <div className="Formfield-error-inline" style={{ marginTop: '1rem' }}>Alerts on forms are displayed like this.</div>

            <div style={{ marginTop: '1rem'}}>
              <button className='Button-standard'>Buttons use the Call To Action colours</button>
            </div>

            <div style={{ marginTop: '1rem'}}>
              <button className='Button-standard-disabled'>Disabled buttons use the Call To Action colours</button>
            </div>

            <div style={{marginTop: '1rem'}}>
              <Checkbox
                size='small' 
                selectedValue="yes" 
                unselectedValue="no"
                value={dummyCheckbox}
                text={(<span>Checkboxes & Radio Buttons use the Form Control colours.</span>)}
                onChange={(val: string) => handleClickDummyCheckbox(val)} 
              />                    
            </div>
          </div>

          <div className='Accessibility-colours-rightCol'>
            <div className='Accessibility-tabs-container'>
              <div 
                className={`Accessibility-tab${selectedTab === 'template' ? '__selected' : ''}`} 
                style={{marginRight: '3px'}} 
                onClick={() => handleClickTab('template')}
              >
                Template
              </div>
              <div 
                className={`Accessibility-tab${selectedTab === 'custom' ? '__selected' : ''}`} 
                onClick={() => handleClickTab('custom')}
              >
                Custom
              </div>
            </div>

            <div className='Accessibility-colours-rightCol-inner'>
              {selectedTab === 'template' ? (
                <div>
                  <div style={{zIndex: '20', position: 'relative'}}>
                    <Select 
                      key={Date.now()}
                      styles={reactSelectCustomStyles} 
                      options={templateSelectionList} 
                      value={selectedTemplateName} 
                      onChange={(opt) => handleTemplateSelectionChange(opt)} 
                      placeholder='Select a colour template' 
                      components={{ Input: ReactSelectInput }} 
                    />              
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{zIndex: '20', position: 'relative'}}>
                    <Select 
                      key={Date.now()}
                      styles={reactSelectCustomStyles} 
                      options={colourSelectionList} 
                      value={selectedColourName} 
                      onChange={(opt) => handleColourSelectionChange(opt)} 
                      placeholder='Select a colour to change' 
                      components={{ Input: ReactSelectInput }} 
                    />              
                  </div>
                  <div className='Accessibility-picker-container'>
                    <RgbColorPicker color={selectedColour} onChange={handleColourChange} />
                  </div>
                </div>
              )}

              <div className='Accessibility-button-container'>
                <button 
                  className='Button-standard' 
                  onClick={() => handleClickSaveColours(false)}
                >
                  Restore default colours
                </button>
                <button 
                  className='Button-standard' 
                  onClick={() => handleClickSaveColours(true)}
                >
                  Save
                </button>
              </div>
            </div>

            <div 
              className={`Accessibility-save-panel ${saveComplete ? 'AlertShow' : 'AlertHide'}`} 
              onTransitionEnd={() => setSaveComplete(false)}
            >
              New Colours Saved
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AccessibilityContainer