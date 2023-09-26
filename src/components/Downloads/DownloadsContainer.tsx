import React, { useCallback, useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { downloadDocumentFile } from '../../utils/download-utils'
import { 
  DownloadsDocuments,
  DownloadsUtilities,
} from '.'
import './Downloads.css'

const DownloadsContainer: React.FC = () => {
  const [panel, setPanel] = useState('documents')
  const location = useLocation()
  const history = useHistory()

  /**
   * Opens a PDF document in a new window, if the URL contains a ?document=<address> param
   * @param address The document address
   */
  const openDocumentFromQueryString = async (address: string) => {
    const response = await downloadDocumentFile(address)
    if(response.status === 200){
      const file = new Blob([response.data], {type: 'application/pdf'})
      const fileURL = URL.createObjectURL(file)
      window.open(fileURL, '_self')
    }
  }

  /**
   * Switches tabs
   * @param tab 
   */
  const handleClickTab = (tab: string) => {
    if(panel !== tab) setPanel(tab)
  }

  /**
   * Switches tabs via a URL query string
   * @param tab 
   */
  const handleQueryTab = useCallback((tab: string) => {
    if(panel !== tab) setPanel(tab)
  }, [panel])

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)

    if(queryParams.has('tab')){
      handleQueryTab(queryParams.get('tab') || '')
      queryParams.delete('tab')
      history.replace({
        search: queryParams.toString(),
      })
    }

    if(queryParams.has('document')){
      openDocumentFromQueryString(queryParams.get('document') || '')
    }

  }, [handleQueryTab, history, location.search])

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