import React from 'react'

import AppContainer from './components/Framework/AppContainer'
import { applyAccessibilityColours, getStoredAccessibilityColours, saveDefaultSiteColours, updateStoredDefaultColours } from './utils/accessibility-utils'
import './assets/fonts/fontawesome-all.css'
import './App.css'

/**
 * Stores default site colours, and applies custom accessibility colours if available
 */
if (typeof window !== 'undefined') {
  if(getStoredAccessibilityColours() !== null){
    saveDefaultSiteColours()
    applyAccessibilityColours()
  }else{
    updateStoredDefaultColours()
  }
}

const App: React.FC = () => {
  return (
    <AppContainer />
  )
}

export default App