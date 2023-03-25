import { AccessibilitySiteColour } from '../types/disability-types'

const getSiteColourList = (): AccessibilitySiteColour[] => {
  return [
    {name: 'byowave-cta-colour', desc: 'Call to action colour', colour: ''},
    {name: 'byowave-cta-dark-colour', desc: 'Call to action dark colour', colour: ''},
    {name: 'byowave-cta-hover-colour', desc: 'Call to action hover colour', colour: ''},
    {name: 'byowave-cta-disabled-colour', desc: 'Call to action disabled colour', colour: ''},
    {name: 'byowave-cta-text-colour', desc: 'Call to action text colour', colour: ''},
    {name: 'byowave-cta-disabled-text-colour', desc: 'Call to action disabled text colour', colour: ''} ,
    {name: 'byowave-alert-colour', desc: 'Alert colour', colour: ''},
    {name: 'byowave-alert-text-colour', desc: 'Alert text colour', colour: ''},
    {name: 'byowave-paragraph-text-colour', desc: 'Paragraph text colour', colour: ''},
    {name: 'byowave-heading-text-colour', desc: 'Heading text colour', colour: ''},
    {name: 'byowave-panel-bg-colour', desc: 'Panel background colour', colour: ''},
    {name: 'byowave-panel-hover-bg-colour', desc: 'Panel hover colour', colour: ''},
    {name: 'byowave-panel-text-colour', desc: 'Panel text colour', colour: ''},
    {name: 'byowave-panel-text-light-colour', desc: 'Panel light text colour', colour: ''},
    {name: 'byowave-inputfield-bg-colour', desc: 'Input field background colour', colour: ''},
    {name: 'byowave-inputfield-text-colour', desc: 'Input field text colour', colour: ''},
    {name: 'byowave-inputfield-text-disabled-colour', desc: 'Input field disabled text colour', colour: ''},
    {name: 'byowave-inputfield-placeholder-text-colour', desc: 'Input field placeholder text colour', colour: ''},
    {name: 'byowave-custom-control-border-colour', desc: 'Form control border colour', colour: ''},
    {name: 'byowave-custom-control-bg-colour', desc: 'Form control background colour', colour: ''},
    {name: 'byowave-custom-control-inner-colour', desc: 'Form control inner colour', colour: ''},
    {name: 'byowave-custom-control-text-colour', desc: 'Form control text colour', colour: ''},
    {name: 'byowave-image-border-colour', desc: 'Image border colour', colour: ''},
  ]
}

const saveDefaultSiteColours = () => {
  const defaultColours: AccessibilitySiteColour[] = getSiteColourList().map(c => {
    return {
      name: c.name,
      desc: c.desc,
      colour: getComputedStyle(document.documentElement).getPropertyValue(`--${c.name}`)
    }
  })
  updateStoredDefaultColours(defaultColours)
}

const updateStoredAccessibilityColours = (colours?: AccessibilitySiteColour[]) => {
  if(colours)
    window.localStorage.setItem('accessibility.colours', btoa(JSON.stringify(colours)))
  else
    window.localStorage.removeItem('accessibility.colours')
}
  
const getStoredAccessibilityColours = (): AccessibilitySiteColour[] => {
  if(window.localStorage.getItem('accessibility.colours') === null){
    return []
  } else {
    const items = window.localStorage.getItem('accessibility.colours') || ''
    return JSON.parse(atob(items))
  }
}

const applyAccessibilityColours = () => {
  const colours = getStoredAccessibilityColours()
  if(colours){
    colours.forEach(c => {
      document.documentElement.style.setProperty(`--${c.name}`, c.colour)
    })
  }
}

const updateStoredDefaultColours = (colours?: AccessibilitySiteColour[]) => {
  if(colours)
    window.localStorage.setItem('accessibility.default', btoa(JSON.stringify(colours)))
  else
    window.localStorage.removeItem('accessibility.default')
}
  
const getStoredDefaultColours = (): AccessibilitySiteColour[] => {
  if(window.localStorage.getItem('accessibility.default') === null){
    return []
  } else {
    const items = window.localStorage.getItem('accessibility.default') || ''
    return JSON.parse(atob(items))
  }
}

const applyDefaultColours = () => {
  const colours = getStoredDefaultColours()
  if(colours){
    colours.forEach(c => {
      document.documentElement.style.setProperty(`--${c.name}`, c.colour)
    })
  }
}

export {
  applyAccessibilityColours,
  applyDefaultColours,
  getSiteColourList,
  getStoredAccessibilityColours,
  saveDefaultSiteColours,
  updateStoredAccessibilityColours,
  updateStoredDefaultColours,
}