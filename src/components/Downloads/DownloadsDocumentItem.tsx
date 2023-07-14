import React, { useCallback, useEffect, useState } from 'react'

import { updateStoredAccessToken } from '../../utils/user-utils'
import { downloadDocumentFile } from '../../utils/download-utils'
import { PdfDocument } from '../../types/media-types'
import PDFLogo from '../../assets/images/pdf-icon.png'

interface IDownloadsDocumentItemProps {
  pdfDoc: PdfDocument
}

const DownloadsDocumentItem: React.FC<IDownloadsDocumentItemProps> = (props: IDownloadsDocumentItemProps) => {
  const { pdfDoc } = props
  const [downloading, setDownloading] = useState(false)

  const downloadFile = async (address: string) => {
    setDownloading(true)
    const response = await downloadDocumentFile(address)
    if(response.status === 200){
      const fileURL = URL.createObjectURL(response.data)
      const anchor = document.createElement('a')
      anchor.href = fileURL
      anchor.download = response.filename
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
      URL.revokeObjectURL(fileURL)
      setDownloading(false)
    }else if(response.status === 401){
      updateStoredAccessToken('', false)
      window.location.reload()
    }else{
      setDownloading(false)
    }
  }
  
  return (
    <>
      <div className='Downloads-document-item'>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div style={{maxWidth: '30px'}}><img src={PDFLogo} alt='PDF Icon' style={{width: '100%'}} /></div>
          <div style={{marginLeft: '.8rem'}}>
            <div className='Downloads-document-item-title'>{pdfDoc.documentName}</div>
            <p>{pdfDoc.documentDescription}</p>            
          </div>
        </div>
        
        <div style={{marginLeft: '1rem'}}>
          {downloading ? (
            <div className='Downloads-document-item-spinner'>
              <i className="fa-solid fa-spinner"></i>
            </div>
          ) : (
            <button 
              className="Button-icon-small" 
              onClick={() => downloadFile(pdfDoc.documentFileAddress || '')} 
              title='Download this file'
            >
              <i className="fa-solid fa-cloud-arrow-down"></i>
            </button>                      
          )}          
        </div>
      </div>
    </>
  )
}

export default DownloadsDocumentItem