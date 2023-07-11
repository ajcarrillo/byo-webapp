import React, { useCallback, useEffect, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IDownloadsDocumentsProps {}

const DownloadsDocuments: React.FC<IDownloadsDocumentsProps> = (props: IDownloadsDocumentsProps) => {

  return (
    <div className='Downloads-panel-container'>
      <div className='Downloads-documents-container'>
        <h3>Terms &amp; Conditions</h3>
      </div>
    </div>
  )
}

export default DownloadsDocuments