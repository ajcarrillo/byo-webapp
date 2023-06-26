import React, { useCallback, useEffect, useState } from 'react'
import Select, { SingleValue } from 'react-select'

import { reactSelectCustomStyles } from '../../CustomControls/SelectDropdown/custom-styles'
import { ReactSelectInput } from '../../CustomControls/SelectDropdown/ReactSelectInput'
import { SelectType } from '../../../types/global-types'
import { PostImage } from '../../../types/community-types'
import './AdminCommunityPosts.css'
import ImageUploader from '../../ImageUploader'

const initialErrors = {
  title: '',
  description: '',
  body: '',
  images: '',
  status: '',
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IAdminCommunityNewPostProps {}

const AdminCommunityNewPost: React.FC<IAdminCommunityNewPostProps> = (props: IAdminCommunityNewPostProps) => {
  const [postStage, setPostStage] = useState('seo')

  const postStatus: readonly SelectType[] = [
    {value: 'public', label: 'Public'},
    {value: 'private', label: 'Private'}
  ]
  const [errors, setErrors] = useState(initialErrors)
  const [status, setStatus] = useState<SelectType | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [keywords, setKeywords] = useState('')
  const [body, setBody] = useState('')
  const [images, setImages] = useState<PostImage[]>([])

  const descriptionLimit = 256
  const bodyLimit = 1000

  const [coverImage, setCoverImage] = useState('')
  const [coverImageSize, setCoverImageSize] = useState('')
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const coverImageInput = React.useRef<HTMLInputElement>(null)

  const updateImage = (type: string, url: string): void => {
    setCoverImage(url)
    const img = new Image()
    img.onload = () => setCoverImageSize(img.width+','+img.height)
    img.src = url
  }

  const uploadImage = (type: string, image: File): void => {
    setCoverImageFile(image)
  }

  const handleClickUpdateStage = (stage: string) => {
    setPostStage(stage)
  }

  const handleStatusChange = (value: SingleValue<SelectType>) => {
    setStatus(value)
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
  }

  const handleDescriptionChange = (value: string) => {
    setDescription(value)
  }

  const handleBodyChange = (value: string) => {
    setBody(value)
  }

  return (
    <div className='Admin-post-new-container'>
      <h3>New Post</h3>
      <div  className='PanelLabel' style={{marginTop: '.6rem'}}>
        <div className='ShopCheckout-breadcrumb-container'>
          <div 
            title='SEO'
            className={`ShopCheckout-breadcrumb-link${postStage === 'seo' ? '__active' : ''}`}
            onClick={() => handleClickUpdateStage('seo')}
          >
            SEO
          </div>
          <i className='fa-solid fa-caret-right'></i>
          <div 
            title='Images'
            className={`ShopCheckout-breadcrumb-link${postStage === 'images' ? '__active' : ''}`}
            onClick={() => handleClickUpdateStage('images')}
          >
            Images
          </div>
          <i className='fa-solid fa-caret-right'></i>
          <div 
            title='Post'
            className={`ShopCheckout-breadcrumb-link${postStage === 'content' ? '__active' : ''}`}
            onClick={() => handleClickUpdateStage('content')}
          >
            Content
          </div>
        </div>
      </div>

      <div style={{width: '70%'}}>
        

        <div style={{margin: '1rem 0'}}>
          <Select  
            styles={reactSelectCustomStyles} 
            options={postStatus} 
            value={status} 
            onChange={(opt) => handleStatusChange(opt)} 
            placeholder='Status' 
            components={{ Input: ReactSelectInput }} 
            maxMenuHeight={200}
          />
          {errors.status && (
            <div className="Formfield-error-inline">{errors.status}</div>
          )}
        </div>

        <div style={{marginBottom: '1rem'}}>
          <input
            className="Textfield-dark" 
            type='text' 
            onChange={(e) => handleTitleChange(e.target.value)} 
            value={title}
            placeholder="Title" 
            style={{ width: '100%' }}
            data-lpignore="true"
            autoComplete='off'
          />
          {errors.title && (
            <div className="Formfield-error-inline">{errors.title}</div>
          )}
        </div>

        <div style={{marginBottom: '1rem'}}>
          <textarea
            className={'Textfield-dark'}
            onChange={(e) => handleDescriptionChange(e.target.value)} 
            placeholder="Description..." 
            style={{ width: '100%' }} 
            rows={3} 
            value={description}
          ></textarea>
          {errors.description && (
            <div className="Formfield-error-inline" style={{marginTop: '.2rem', marginBottom: '.2rem'}}>{errors.description}</div>
          )}            
          <div style={{textAlign: 'right', fontSize: '.89rem', color: 'rgb(140,140,140)', marginBottom: '1rem'}}>{descriptionLimit - description.length || 0}</div>
        </div>

        <div style={{marginBottom: '1rem'}}>
          <textarea
            className={'Textfield-dark'}
            onChange={(e) => handleBodyChange(e.target.value)} 
            placeholder="Body..." 
            style={{ width: '100%' }} 
            rows={12} 
            value={body}
          ></textarea>
          {errors.body && (
            <div className="Formfield-error-inline" style={{marginTop: '.2rem', marginBottom: '.2rem'}}>{errors.body}</div>
          )}            
          <div style={{textAlign: 'right', fontSize: '.89rem', color: 'rgb(140,140,140)', marginBottom: '1rem'}}>{bodyLimit - body.length || 0}</div>
        </div>
      </div>

      <div style={{width: '30%', paddingLeft: '2rem'}}>
        <h3>Images</h3>

        <div className="PanelLabel" style={{marginBottom: '.4rem', marginTop: '2rem'}}><strong className="Colour-orange-bright">5)</strong> Select a cover image. Ensure your image is a PNG of JPG format, and 2000px by 2000px in size. Max file size 5MB.</div>
        <div style={{borderRadius: '.4rem', backgroundColor: 'rgb(33,33,33)', padding: '.5rem'}}>
          <div className='ImageUpload-container-square' style={{marginTop: '.3rem', backgroundImage: `url(${coverImage})`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}} >
            <span className="ImageUpload-icon fa-solid fa-circle-up" onClick={() => coverImageInput?.current?.click()}></span>
          </div>
        </div>
        <ImageUploader ref={coverImageInput} type='cover' update={updateImage} upload={uploadImage}/> 
        
      </div>
    </div>
  )
}

export default AdminCommunityNewPost
