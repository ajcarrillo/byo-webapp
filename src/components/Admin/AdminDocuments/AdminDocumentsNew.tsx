import React, { useState } from 'react'

import { isEmpty, isPunctuatedText } from '../../../utils/validation-utils'
import { getStoredAccessToken, updateStoredAccessToken } from '../../../utils/user-utils'
import { uploadWithProgress } from '../../../utils/api-utils'
import AdminDocumentForm from './AdminDocumentForm'
import { DocumentFile } from './AdminDocuments'
import { SelectType } from '../../../types/global-types'
import { SingleValue } from 'react-select'

const initialErrors = {
  name: '',
  description: '',
  category: '',
  file: '',
}

interface IAdminDocumentsNewProps {
  descriptionLimit: number,
  maxFileSizeMB: number,
  categoryList: readonly SelectType[]
}

const AdminDocumentsNew: React.FC<IAdminDocumentsNewProps> = (props: IAdminDocumentsNewProps) => {
  const { descriptionLimit, maxFileSizeMB, categoryList }  = props
  
  const [errors, setErrors] = useState(initialErrors)
  const [apiLoading, setApiLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [saveComplete, setSaveComplete] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<SelectType | null>(null)
  const [documentFile, setDocumentFile] = useState<DocumentFile | null>(null)

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
  }

  const resetForm = () => {
    setName('')
    setDescription('')
    setCategory(null)
    setDocumentFile(null)
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

    if(!documentFile)
      e.file = 'Please select a PDF file.'

    if(documentFile){
      if(documentFile.file.size > 1024 * 1024 * maxFileSizeMB){
        e.file = `File ${documentFile.name} is too large - max size ${maxFileSizeMB}MB`
      }
    }

    if (Object.keys(e).length === 0) {
      setErrors(initialErrors)
      saveNewDocument()
    } else {
      setErrors(e)
    }
  }

  const saveNewDocument = async () => {
    setApiLoading(true)
    setApiError('')

    const token = getStoredAccessToken().accesToken

    const postData = new FormData()
    postData.append('documentFile', documentFile?.file as File)
    postData.append('name', name)
    postData.append('description', description)
    postData.append('category', category?.value || '')
    const response = await uploadWithProgress(
      `${process.env.REACT_APP_API_BASE_URL}/admin/document/new`,
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

  return (
    <AdminDocumentForm 
      isNewDocument={true}
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
      existingDocumentFile={null}
      handleNameChange={handleNameChange}
      handleDescriptionChange={handleDescriptionChange}
      handleCategoryChange={handleCategoryChange}
      handleSelectDocumentFile={handleSelectDocumentFile}
      handleClickSave={handleClickSave}
      setSaveComplete={setSaveComplete}
    />
  )
}

export default AdminDocumentsNew