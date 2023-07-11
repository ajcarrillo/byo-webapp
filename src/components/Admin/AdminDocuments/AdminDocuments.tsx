import React, { useState } from 'react'

import './AdminDocuments.css'
import AdminDocumentsNew from './AdminDocumentsNew'
import AdminDocumentsEdit from './AdminDocumentsEdit'
import { SelectType } from '../../../types/global-types'

export type DocumentFileUpload = {
  progress: number,
  response: any,
}

export type DocumentFile = {
  index: string,
  name: string,
  upload: DocumentFileUpload,
  file: File,
}

export type ExistingDocumentFile = {
  name: string,
  address: string,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IAdminDocumentsProps {}

const AdminDocuments: React.FC<IAdminDocumentsProps> = (props: IAdminDocumentsProps) => {
  const [workspace, setWorkspace] = useState('newDocument')

  const DESCRIPTION_LIMIT = 128
  const FILE_MAX_SIZE_MB = 4

  const documentCategoryList: readonly SelectType[] = [
    {value: 'licencing', label: 'Licencing'},
    {value: 'manual', label: 'Product Manuals'},
    {value: 'privacy', label: 'Privacy'},
    {value: 'returns', label: 'Returns'},
    {value: 'terms', label: 'Terms'},
    {value: 'warranty', label: 'Warranty'},
  ]

  return (
    <div className='Admin-documents-container'>
      <div className='Admin-menu-container'>
        <div 
          title='New Document'
          className={`Admin-menu-link${workspace === 'newDocument' ? '__active' : ''}`}
          onClick={() => setWorkspace('newDocument')}
        >
          New Document
        </div>
        <i className='fa-solid fa-minus'></i>
        <div 
          title='Edit Document'
          className={`Admin-menu-link${workspace === 'editDocument' ? '__active' : ''}`}
          onClick={() => setWorkspace('editDocument')}
        >
          Edit Document
        </div>
      </div>

      <div className='Admin-workspace-container'>
        {workspace === 'newDocument' && (
          <AdminDocumentsNew 
            descriptionLimit={DESCRIPTION_LIMIT}
            maxFileSizeMB={FILE_MAX_SIZE_MB}
            categoryList={documentCategoryList}
          />
        )}

        {workspace === 'editDocument' && (
          <AdminDocumentsEdit 
            descriptionLimit={DESCRIPTION_LIMIT}
            maxFileSizeMB={FILE_MAX_SIZE_MB}
            categoryList={documentCategoryList}
          />
        )}
      </div>
    </div>
  )
}

export default AdminDocuments
