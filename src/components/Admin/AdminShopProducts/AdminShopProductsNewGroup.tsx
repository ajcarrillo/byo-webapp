import React, { useState } from 'react'

import ImageUploader from '../../ImageUploader'
import { isEmpty, isPunctuatedText } from '../../../utils/validation-utils'
import { getStoredAccessToken, updateStoredAccessToken } from '../../../utils/user-utils'
import { uploadWithProgress } from '../../../utils/api-utils'

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
  const coverImageInput = React.useRef<HTMLInputElement>(null)

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
      `${process.env.REACT_APP_API_BASE_URL}/admin/shop/new-group`,
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
    <div style={{display: 'flex'}}>

      <div style={{width: '50%', paddingRight: '2rem'}}>
        <div className="PanelLabel" style={{marginBottom: '.4rem'}}>Ensure your group image is square, and in PNG or JPG format no larger than 1000px by 1000px in size. Max file size 2MB.</div>
        <div style={{borderRadius: '.4rem', padding: '.5rem'}}>
          <div className='ImageUpload-container-square' style={{marginTop: '.3rem', backgroundImage: `url(${coverImage})`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}} >
            <span className="ImageUpload-icon fa-solid fa-circle-up" onClick={() => coverImageInput?.current?.click()}></span>
          </div>
        </div>
        <ImageUploader ref={coverImageInput} type='cover' update={updateImage} upload={uploadImage}/> 
        {errors.image && (
          <div className="Formfield-error-inline" style={{marginTop: '.2rem', marginBottom: '.2rem'}}>{errors.image}</div>
        )} 
      </div>

      <div style={{width: '50%'}}>
        <div style={{marginBottom: '1rem'}}>
          <input
            className="Textfield-dark" 
            type='text' 
            onChange={(e) => handleNameChange(e.target.value)} 
            value={name}
            placeholder="Group name" 
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
            placeholder="Group description" 
            style={{ width: '100%' }} 
            rows={3} 
            value={description}
          ></textarea>
          {errors.description && (
            <div className="Formfield-error-inline" style={{marginTop: '.2rem', marginBottom: '.2rem'}}>{errors.description}</div>
          )}            
          <div style={{textAlign: 'right', fontSize: '.89rem', color: 'rgb(140,140,140)', marginBottom: '1rem'}}>{DESCRIPTION_LIMIT - description.length || 0}</div>
        </div>

        <div style={{marginBottom: '1rem'}}>
          <button 
            disabled={apiLoading}
            className={apiLoading ? 'Button-standard-disabled' : 'Button-standard'} 
            onClick={() => handleClickSave()}
          >
            Save Group
          </button>
          {apiError && (
            <div className="Formfield-error-inline" style={{marginTop: '.6rem', marginBottom: '.2rem'}}>{apiError}</div>
          )} 
          <div 
            className={`Accessibility-save-panel ${saveComplete ? 'AlertShow' : 'AlertHide'}`} 
            onTransitionEnd={() => setSaveComplete(false)}
          >
            New Group Created
          </div>
        </div>
      </div>

    </div>
  )
}

export default AdminShopProductsNewGroup