import React, { useState } from 'react'

import ImageUploader from '../../ImageUploader'

interface IAdminGroupFormProps {
  isNewGroup: boolean,
  errors: any,
  apiLoading: boolean,
  apiError: string,
  saveComplete: boolean,
  coverImage: string,
  name: string,
  description: string,
  descriptionLimit: number,
  updateImage: (type: string, url: string) => void,
  uploadImage: (type: string, image: File) => void,
  handleNameChange: (value: string) => void,
  handleDescriptionChange: (value: string) => void,
  handleClickSave: () => void,
  setSaveComplete: React.Dispatch<React.SetStateAction<boolean>>
}

const AdminGroupForm: React.FC<IAdminGroupFormProps> = (props: IAdminGroupFormProps) => {
  const { 
    isNewGroup,
    errors,
    apiLoading,
    apiError,
    saveComplete,
    coverImage,
    name,
    description,
    descriptionLimit,
    updateImage,
    uploadImage,
    handleNameChange,
    handleDescriptionChange,
    handleClickSave,
    setSaveComplete
  } = props

  const coverImageInput = React.useRef<HTMLInputElement>(null)
  
  return (
    <div style={{display: 'flex'}}>
      <div style={{width: '50%', paddingRight: '2rem'}}>
        <div className="PanelLabel" style={{marginBottom: '.4rem'}}>Ensure your group image is square, and in PNG or JPG format no larger than 1000px by 1000px in size. Max file size 2MB.</div>
        <div style={{borderRadius: '.4rem', padding: '.5rem'}}>
          <div className='ImageUpload-container-square' style={{marginTop: '.3rem', backgroundImage: `url(${coverImage})`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}} >
            <span className="ImageUpload-icon fa-solid fa-circle-up" onClick={() => coverImageInput?.current?.click()}></span>
          </div>
        </div>
        <ImageUploader ref={coverImageInput} type='cover' update={updateImage} upload={uploadImage} /> 
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
          <div style={{textAlign: 'right', fontSize: '.89rem', color: 'rgb(140,140,140)', marginBottom: '1rem'}}>{descriptionLimit - description.length || 0}</div>
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
            {isNewGroup ? 'New Group Created' : 'Group Updated'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminGroupForm