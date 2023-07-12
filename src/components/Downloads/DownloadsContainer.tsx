import React, { useCallback, useEffect, useState } from 'react'

import { 
  DownloadsDocuments,
  DownloadsUtilities,
} from '.'
import './Downloads.css'

const DownloadsContainer: React.FC = () => {
  const [panel, setPanel] = useState('documents')

  /**
   * Switches tabs
   * @param tab 
   */
  const handleClickTab = (tab: string) => {
    if(panel !== tab) setPanel(tab)
  }

  return (
    <div className={'App-container'}>
      <div className='Downloads-container'>
        <h1><span className="Colour-blue-bright">Downloads</span></h1>
        <div className='Downloads-tabs-container'>
          <div 
            className={`Downloads-tab${panel === 'documents' ? '__selected' : ''}`} 
            style={{marginRight: '1px'}} 
            onClick={() => handleClickTab('documents')}
          >
            Documents
          </div>
          <div 
            className={`Downloads-tab${panel === 'utilities' ? '__selected' : ''}`} 
            style={{marginRight: '1px'}} 
            onClick={() => handleClickTab('utilities')}
          >
            Utilities
          </div>
        </div>

        {panel === 'documents' && (
          <DownloadsDocuments />
        )}

        {panel === 'utilities' && (
          <DownloadsUtilities />
        )}        
      </div>
    </div>
  )
}

export default DownloadsContainer