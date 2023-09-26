import React, { useCallback, useEffect, useState } from 'react'
import Select, { SingleValue } from 'react-select'

import { SelectType } from '../../../types/global-types'
import { PdfDocument } from '../../../types/media-types'
import { isEmpty, isPunctuatedText } from '../../../utils/validation-utils'
import { apiCall, uploadWithProgress } from '../../../utils/api-utils'
import { getStoredAccessToken, updateStoredAccessToken } from '../../../utils/user-utils'
import { useEffectOnlyOnce } from '../../../utils/hooks'
import { ReactSelectInput } from '../../CustomControls/SelectDropdown/ReactSelectInput'
import { reactSelectCustomStyles } from '../../CustomControls/SelectDropdown/custom-styles'
import AdminDocumentForm from './AdminDocumentForm'
import { DocumentFile, ExistingDocumentFile } from './AdminDocuments'
import { ClipboardButton } from '../../CustomControls'

const initialErrors = {
  name: '',
  description: '',
  category: '',
  file: '',
}

interface IAdminDocumentsEditProps {
  descriptionLimit: number,
  maxFileSizeMB: number,
  categoryList: readonly SelectType[]
}

const AdminDocumentsEdit: React.FC<IAdminDocumentsEditProps> = (props: IAdminDocumentsEditProps) => {
  const { descriptionLimit, maxFileSizeMB, categoryList }  = props

  const [gettingDocuments, setGettingDocuments] = useState(false)
  const [documentList, setDocumentList] = useState<SelectType[]>([])
  const [selectedDocument, setSelectedDocument] = useState<SelectType | null>(null)
  const [documents, setDocumets] = useState<PdfDocument[]>([])

  const [errors, setErrors] = useState(initialErrors)
  const [apiLoading, setApiLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [saveComplete, setSaveComplete] = useState(false)

  const [documentAddress, setDocumentAddress] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<SelectType | null>(null)
  const [documentFile, setDocumentFile] = useState<DocumentFile | null>(null)
  const [existingDocumentFile, setExistingDocumentFile] = useState<ExistingDocumentFile | null>(null)

  const handleNameChange = (value: string) => {
    setName(value)
  }

  const handleCategoryChange = (value: SingleValue<SelectType>) => {
    setCategory(value)
  }

  const handleDescriptionChange = (value: string) => {
    const desc = value.slice(0, descriptionLimit)
    setDescription(desc)
  }

  /**
   * Selects a document file
   * @param identifier An identifier for the file
   * @param file The file object
   */
  const handleSelectDocumentFile = (identifier: string | number, file: any) => {
    setDocumentFile({
      index: 'file-0',
      name: file.name,
      upload: {progress: 0, response: null},
      file,
    })

    if(existingDocumentFile) setExistingDocumentFile(null)
  }

  const resetForm = () => {
    // setName('')
    // setDescription('')
    // setCategory(null)
    // setDocumentFile(null)
    getDocumentList()
    setSelectedDocument({value: documentAddress, label: name})
  }

  const handleClickSave = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = {}

    if (isEmpty(name) || !isPunctuatedText(name))
      e.name = 'Please give this document a name.'

    if (isEmpty(description) || !isPunctuatedText(description))
      e.description = 'Please give this document a description.'

    if(!category)
      e.category = 'Please select a document category.'

    if(!existingDocumentFile && !documentFile)
      e.file = 'Please select a PDF file.'

    if(documentFile){
      if(documentFile.file.size > 1024 * 1024 * maxFileSizeMB){
        e.file = `File ${documentFile.name} is too large - max size ${maxFileSizeMB}MB`
      }
    }

    if (Object.keys(e).length === 0) {
      setErrors(initialErrors)
      saveExistingDocument()
    } else {
      setErrors(e)
    }
  }

  const saveExistingDocument = async () => {
    setApiLoading(true)
    setApiError('')

    const token = getStoredAccessToken().accesToken

    const postData = new FormData()
    if(documentFile) postData.append('documentFile', documentFile?.file as File)
    postData.append('replaceDocumentFile', documentFile ? 'true' : 'false')
    postData.append('address', documentAddress)
    postData.append('name', name)
    postData.append('description', description)
    postData.append('category', category?.value || '')
    const response = await uploadWithProgress(
      `${process.env.REACT_APP_API_BASE_URL}/admin/document/update`,
      token,
      postData
    )

    if(response.status === 200){
      resetForm()
      setSaveComplete(true)
      setApiLoading(false)
    }else{
      if(response.status === 401) {
        updateStoredAccessToken('', false)
        window.location.reload()
      } else {
        setApiLoading(false)
        switch(response.message){
        case'DUPLICATE_NAME':
          setApiError('A document with that name already exists.')
          break
        case'ERROR':
          setApiError('There was an error - please try again.')
          break
        default:
          setApiError('There was an error - please try again.')
          break
        }
      }
    }
  }

  /**
   * Updates the selected document
   * @param value 
   */
  const handleDocumentSelectionChange = (value: SingleValue<SelectType>) => {
    setSelectedDocument(value)
  }

  /**
   * Populates the form with the selected document details
   */
  const editDocument = useCallback((address: string) => {
    if(address !== documentAddress){
      const selected = documents.find(d => d.documentAddress === address)
      setDocumentAddress(selected?.documentAddress || '')
      setName(selected?.documentName || '')
      setDescription(selected?.documentDescription || '')
      setCategory(categoryList.find(c => c.value === selected?.documentCategory) || null)
      setExistingDocumentFile({name: selected?.documentFileName || '', address: selected?.documentFileAddress || ''})
    }
  }, [categoryList, documentAddress, documents])

  useEffect(() => {
    if(selectedDocument) editDocument(selectedDocument.value)
  }, [editDocument, selectedDocument])

  /**
   * Fetches a list of documents
   */
  const getDocumentList = async () => {
    setGettingDocuments(true)
    const response = await apiCall(
      `${process.env.REACT_APP_API_BASE_URL}/media/documents`,
      'GET',
      undefined,
      'json'
    )

    if(response.status === 200){
      setGettingDocuments(false)
      setDocumentList(
        response.data.documents.map((d: PdfDocument) => ({value: d.documentAddress, label: d.documentName}))
      )
      setDocumets(
        response.data.documents.map((d: PdfDocument) => ({...d}))
      )
    }else if(response.status === 401){
      updateStoredAccessToken('', false)
      window.location.reload()
    }else{
      setGettingDocuments(false)
    }
  }

  useEffectOnlyOnce(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (dependencies) => {
      getDocumentList()
    },
    [true],
    (dependencies) => dependencies[0] === true
  )

  return (
    <>
      <div className="PanelLabel" style={{border: '1px solid rgb(67,69,81)', marginBottom: '1rem'}}>
        <div style={{marginBottom: '.6rem'}}>Edit document</div>
        <Select 
          isDisabled={gettingDocuments}
          styles={reactSelectCustomStyles} 
          options={documentList} 
          value={selectedDocument} 
          onChange={(opt) => handleDocumentSelectionChange(opt)} 
          placeholder='Select a document to edit' 
          components={{ Input: ReactSelectInput }} 
        /> 
      </div>

      {documentAddress && (
        <>
          <div className="PanelLabel" style={{border: '1px solid rgb(67,69,81)', marginBottom: '1rem'}}>
            <div className='Admin-documents-url-container'>

              <div style={{display: 'flex', alignItems: 'center'}}>
                <i className="fa-solid fa-face-grin-tongue-wink"></i>
                <div style={{marginLeft: '.8rem'}}>
                  <div>
                    <div style={{color: 'var(--byowave-heading-text-colour)'}}>You can create a hyperlink to this document using the following URL:</div>
                    <a href={`/downloads?document=${existingDocumentFile?.address}`} rel="noreferrer" target='_blank'>{`/downloads?document=${existingDocumentFile?.address}`}</a>
                  </div>
                </div>
              </div>

              <ClipboardButton
                key={Date.now()}
                copyText={`<a href='/downloads?document=${existingDocumentFile?.address}' rel='noreferrer' target='_blank'>${existingDocumentFile?.name}</a>`}
              />
            </div>
          </div>

          <AdminDocumentForm 
            isNewDocument={false}
            errors={errors}
            apiLoading={apiLoading}
            apiError={apiError}
            saveComplete={saveComplete}
            categoryList={categoryList}
            name={name}
            description={description}
            descriptionLimit={descriptionLimit}    
            category={category}  
            documentFile={documentFile}
            existingDocumentFile={existingDocumentFile}
            handleNameChange={handleNameChange}
            handleDescriptionChange={handleDescriptionChange}
            handleCategoryChange={handleCategoryChange}
            handleSelectDocumentFile={handleSelectDocumentFile}
            handleClickSave={handleClickSave}
            setSaveComplete={setSaveComplete}
          />
        </>
      )}
    </>
  )
}

export default AdminDocumentsEdit