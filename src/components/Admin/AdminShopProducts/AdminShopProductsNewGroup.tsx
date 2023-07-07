import React, { useState } from 'react'

import ImageUploader from '../../ImageUploader'
import { isEmpty, isPunctuatedText } from '../../../utils/validation-utils'
import { getStoredAccessToken, updateStoredAccessToken } from '../../../utils/user-utils'
import { uploadWithProgress } from '../../../utils/api-utils'
import AdminGroupForm from './AdminGroupForm'

const initialErrors = {
  name: '',
  description: '',
  image: '',
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IAdminShopProductsNewGroupProps {}

const AdminShopProductsNewGroup: React.FC<IAdminShopProductsNewGroupProps> = (props: IAdminShopProductsNewGroupProps) => {
  const [errors, setErrors] = useState(initialErrors)
  const [apiLoading, setApiLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [saveComplete, setSaveComplete] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [coverImageSize, setCoverImageSize] = useState('')
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)

  const DESCRIPTION_LIMIT = 256
  const IMAGE_MAX_SIZE = 1000

  const handleNameChange = (value: string) => {
    setName(value)
  }

  const handleDescriptionChange = (value: string) => {
    const desc = value.slice(0, DESCRIPTION_LIMIT)
    setDescription(desc)
  }

  const updateImage = (type: string, url: string): void => {
    setCoverImage(url)
    const img = new Image()
    img.onload = () => setCoverImageSize(img.width+','+img.height)
    img.src = url
  }

  const uploadImage = (type: string, image: File): void => {
    setCoverImageFile(image)
  }

  const resetForm = () => {
    setName('')
    setDescription('')
    setCoverImage('')
    setCoverImageSize('')
  }

  const handleClickSave = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = {}

    if (isEmpty(name) || !isPunctuatedText(name))
      e.name = 'Please give this group a valid name.'

    if (isEmpty(description) || !isPunctuatedText(description))
      e.description = 'Please give this group a valid description.'

    const imageIsCorrectSize = coverImageSize.split(',')[0] === coverImageSize.split(',')[1] && parseInt(coverImageSize.split(',')[0]) <= IMAGE_MAX_SIZE
    
    if (!imageIsCorrectSize)
      e.image = `Please ensure your image is square, and no larger than ${IMAGE_MAX_SIZE}px.`
      
    if (!coverImage)
      e.image = 'Please supply an image.'

    if (Object.keys(e).length === 0) {
      setErrors(initialErrors)
      saveNewGroup()
    } else {
      setErrors(e)
    }
  }

  const saveNewGroup = async () => {
    setApiLoading(true)
    setApiError('')

    const token = getStoredAccessToken().accesToken

    const postData = new FormData()
    postData.append('shopGroupImage', coverImageFile as File)
    postData.append('name', name)
    postData.append('description', description)
    const response = await uploadWithProgress(
      `${process.env.REACT_APP_API_BASE_URL}/admin/shop/group/new`,
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
          setApiError('A group with that name already exists.')
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
    <AdminGroupForm 
      isNewGroup={true}
      errors={errors}
      apiLoading={apiLoading}
      apiError={apiError}
      saveComplete={saveComplete}
      coverImage={coverImage}
      name={name}
      description={description}
      descriptionLimit={DESCRIPTION_LIMIT}      
      updateImage={updateImage}
      uploadImage={uploadImage}
      handleNameChange={handleNameChange}
      handleDescriptionChange={handleDescriptionChange}
      handleClickSave={handleClickSave}
      setSaveComplete={setSaveComplete}
    />
  )
}

export default AdminShopProductsNewGroup