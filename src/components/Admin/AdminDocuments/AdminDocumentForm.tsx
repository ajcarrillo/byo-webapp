import React, { useState } from 'react'
import Select, { SingleValue } from 'react-select'

import { PdfDocument } from '../../../types/media-types'
import { downloadDocumentFile } from '../../../utils/download-utils'
import { updateStoredAccessToken } from '../../../utils/user-utils'
import { ExistingDocumentFile, DocumentFile } from './AdminDocuments'
import FileSelector from '../../FileSelector'
import { reactSelectCustomStyles } from '../../CustomControls/SelectDropdown/custom-styles'
import { SelectType } from '../../../types/global-types'
import { ReactSelectInput } from '../../CustomControls/SelectDropdown/ReactSelectInput'

interface IAdminDocumentFormProps {
  isNewDocument: boolean,
  errors: any,
  apiLoading: boolean,
  apiError: string,
  saveComplete: boolean,
  categoryList: readonly SelectType[],
  name: string,
  description: string,
  descriptionLimit: number,
  category: SingleValue<SelectType>,
  documentFile: DocumentFile | null,
  existingDocumentFile: ExistingDocumentFile | null,
  handleNameChange: (value: string) => void,
  handleDescriptionChange: (value: string) => void,
  handleCategoryChange: (value: SingleValue<SelectType>) => void,
  handleSelectDocumentFile: (identifier: string | number, file: any) => void,
  handleClickSave: () => void,
  setSaveComplete: React.Dispatch<React.SetStateAction<boolean>>
}

const AdminDocumentForm: React.FC<IAdminDocumentFormProps> = (props: IAdminDocumentFormProps) => {
  const { 
    isNewDocument,
    errors, 
    apiLoading,
    apiError,
    saveComplete,
    categoryList,
    name,
    description,
    descriptionLimit,
    category,
    documentFile,
    existingDocumentFile,
    handleNameChange,
    handleDescriptionChange,
    handleCategoryChange,
    handleSelectDocumentFile,
    handleClickSave,
    setSaveComplete
  } = props

  const fileSelectInput = React.useRef<HTMLInputElement>(null)

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
    <div style={{display: 'flex'}}>

      <div style={{width: '60%', paddingRight: '2rem'}}>
        <div className="PanelLabel" style={{marginBottom: '.4rem'}}>1. Details</div>

        <div style={{marginBottom: '1rem'}}>
          <input
            className="Textfield-dark" 
            type='text' 
            onChange={(e) => handleNameChange(e.target.value)} 
            value={name}
            placeholder="Document name.." 
            style={{ width: '100%' }}
            data-lpignore="true"
            autoComplete='off'
          />
          {errors.name && (
            <div className="Formfield-error-inline">{errors.name}</div>
          )}
        </div>

        <div style={{marginBottom: '1rem'}}>
          <textarea
            className={'Textfield-dark'}
            onChange={(e) => handleDescriptionChange(e.target.value)} 
            placeholder="Document description.." 
            style={{ width: '100%' }} 
            rows={3} 
            value={description}
          ></textarea>
          {errors.description && (
            <div className="Formfield-error-inline" style={{marginTop: '.2rem', marginBottom: '.2rem'}}>{errors.description}</div>
          )}            
          <div style={{textAlign: 'right', fontSize: '.89rem', color: 'rgb(140,140,140)', marginBottom: '1rem'}}>{descriptionLimit - description.length || 0}</div>
        </div>

        <div className="PanelLabel" style={{marginBottom: '.4rem'}}>2. Category</div>

        <div style={{marginBottom: '1rem'}}>
          <Select  
            styles={reactSelectCustomStyles} 
            options={categoryList} 
            value={category} 
            onChange={(opt) => handleCategoryChange(opt)} 
            placeholder='Document category..' 
            components={{ Input: ReactSelectInput }} 
            maxMenuHeight={200}
          />
          {errors.category && (
            <div className="Formfield-error-inline">{errors.category}</div>
          )}
        </div>
      </div>

      <div style={{width: '40%'}}>
        <div className="PanelLabel" style={{margin: '0 0 .4rem 0'}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div>3. PDF File</div>
            <button
              className="Button-small"
              onClick={() => fileSelectInput?.current?.click()}
            >
              {documentFile || existingDocumentFile ? 'Reselect PDF File' : 'Select PDF File'}
            </button>
          </div>
        </div>
        {errors.file && (
          <div className="Formfield-error-inline" style={{marginTop: '.2rem', marginBottom: '.2rem'}}>{errors.file}</div>
        )}
        <FileSelector ref={fileSelectInput} accept='application/pdf' identifier={'-not-used-'} update={handleSelectDocumentFile} />
        {documentFile && (
          <div className='Admin-shop-new-product-image-container'>
            <div>{documentFile.name}</div>
          </div>
        )}
        {existingDocumentFile && (
          <div className='Admin-shop-new-product-image-container'>
            <div>
              {downloading ? (
                <div className='OrdersItem-downloading-spinner'>
                  <i className="fa-solid fa-spinner"></i>
                </div>
              ) : (
                <button 
                  className="Button-icon-small" 
                  onClick={() => downloadFile(existingDocumentFile.address)} 
                  title='Download this file'
                >
                  <i className="fa-solid fa-cloud-arrow-down"></i>
                </button>                      
              )}
            </div>
            <div>{existingDocumentFile.name}</div>
          </div>
        )}

        <div style={{marginBottom: '1rem', marginTop: '1rem'}}>
          <button 
            disabled={apiLoading}
            className={apiLoading ? 'Button-standard-disabled' : 'Button-standard'} 
            onClick={() => handleClickSave()}
          >
            Save Document
          </button>
          {apiError && (
            <div className="Formfield-error-inline" style={{marginTop: '.6rem', marginBottom: '.2rem'}}>{apiError}</div>
          )} 
          <div 
            className={`Accessibility-save-panel ${saveComplete ? 'AlertShow' : 'AlertHide'}`} 
            onTransitionEnd={() => setSaveComplete(false)}
          >
            {isNewDocument ? 'New Document Created' : 'Document Updated'}
          </div>
        </div>
      </div>

    </div>
  )
}

export default AdminDocumentForm