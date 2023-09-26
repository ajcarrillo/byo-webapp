import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { apiCall } from '../../utils/api-utils'
import { updateStoredAccessToken } from '../../utils/user-utils'
import { SelectType } from '../../types/global-types'
import { PdfDocument } from '../../types/media-types'
import DownloadsDocumentItem from './DownloadsDocumentItem'
import Spinner from '../Spinner'

type DocumentCategory = {
  name: string,
  items: JSX.Element[],
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IDownloadsDocumentsProps {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DownloadsDocuments: React.FC<IDownloadsDocumentsProps> = (props: IDownloadsDocumentsProps) => {
  const [gettingDocuments, setGettingDocuments] = useState(false)
  const [documents, setDocumets] = useState<PdfDocument[]>([])
  const [documentList, setDocumentList] = useState<DocumentCategory[]>([])

  const documentCategories: SelectType[] = [
    {value: 'licencing', label: 'Licence Agreements'},
    {value: 'manual', label: 'Product Manuals'},
    {value: 'privacy', label: 'Privacy Policies'},
    {value: 'returns', label: 'Returns Policies'},
    {value: 'terms', label: 'Terms and Conditions'},
    {value: 'warranty', label: 'Warranties'},
  ]

  /**
   * Builds the list of downloadable documents
   */
  const buildDocumentList = useCallback(() => {
    const cats: DocumentCategory[] = []
    for(let d = 0; d < documents.length; d++){
      if(!cats.some(c => c.name === documents[d].documentCategory))
        cats.push({name: documents[d].documentCategory, items: []})

      const catIndex = cats.findIndex(c => c.name === documents[d].documentCategory)
      const catItems = [...(cats.find(c => c.name === documents[d].documentCategory) || {items: []}).items]
      catItems.push(<DownloadsDocumentItem key={`doc-${documents[d].documentAddress}`} pdfDoc={documents[d]} />)
      if(catIndex > -1){
        cats[catIndex].items = catItems
      }
    }

    setDocumentList(cats)
  }, [documents])

  useEffect(() => {
    if(documents.length > 0  && documentList.length === 0) buildDocumentList()
  }, [buildDocumentList, documentList.length, documents.length])
  
  /**
   * Used to abort an API call
   */
  const abortController = useMemo(() => {
    return new AbortController()
  }, [])

  /**
   * Fetches a list of documents
   */
  const getDocumentList = useCallback(async () => {
    try{
      setGettingDocuments(true)
      const response = await apiCall(
        `${process.env.REACT_APP_API_BASE_URL}/media/documents`,
        'GET',
        undefined,
        null,
        'json',
        abortController,
      )

      if(response.status === 200){
        setGettingDocuments(false)
        setDocumets(
          response.data.documents.map((d: PdfDocument) => ({...d}))
        )
      }else if(response.status === 401){
        updateStoredAccessToken('', false)
        window.location.reload()
      }else{
        setGettingDocuments(false)
      }    
    } catch(e) {
      // Call aborted
    }
  }, [abortController])

  useEffect(() => {
    getDocumentList()
    
    return () => {
      abortController.abort()
    }
  }, [abortController, getDocumentList])

  return (
    <>
      {gettingDocuments && (
        <Spinner />
      )}
      
      <div className='Downloads-panel-container'>
        <div className='Downloads-documents-container'>
          {documentList.map(c => (
            <div key={`cat-${c.name}`} className='Downloads-documents-category-container'>
              <h3>{documentCategories.find(dc => dc.value === c.name)?.label}</h3>
              {c.items.map(d => d)}
            </div>
          ))}
          
        </div>
      </div>    
    </>
  )
}

export default DownloadsDocuments