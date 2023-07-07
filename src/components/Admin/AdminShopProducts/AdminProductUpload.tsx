import React, { useEffect, useState } from 'react'

import { ProdFile, ProductUploadingState } from './AdminShopProducts'
import ProgressBar from '../../ProgressBar'

interface IAdminProductUploadProps {
  isNewProduct: boolean,
  productImageList: ProdFile[],
  productFile: ProdFile | null,
  uploadState: ProductUploadingState,
  uploadImages: () => void,
  uploadFile: () => void,
  saveProduct: () => Promise<void>,
  returnToProductForm: React.Dispatch<React.SetStateAction<string>>,
  resetAll: () => void
}

const AdminProductUpload: React.FC<IAdminProductUploadProps> = (props: IAdminProductUploadProps) => {
  const { 
    isNewProduct,
    productImageList, 
    productFile, 
    uploadState,
    uploadImages,
    uploadFile,
    saveProduct,
    returnToProductForm,
    resetAll
  } = props

  const [mediaSaving, setMediaSaving] = useState(false)
  const [productSaved, setProductSaved] = useState(false)

  /**
   * Generates image upload progress bars
   * @returns The progress bars JSX
   */
  const generateImageUploads = () => {
    const bars: JSX.Element[] = []
    productImageList.forEach(img => {
      bars.push(<div key={`upload-progressbar-${img.index}`}  className='AdminProductUpload-file-summary-container'>
        <div className="AdminProductUpload-filename">{img.file.name}</div>
        <div><ProgressBar identifier={img.index} progress={img.upload?.progress || 0} /></div>
      </div>)
    })
    if(bars.length === 0){
      bars.push(<div key='img-upload-none'  className='AdminProductUpload-file-summary-container'>
        <div className="AdminProductUpload-filename">There are no new images to upload.</div>
      </div>)
    }
    return bars
  }

  /**
   * Generates file upload progress bars
   * @returns The progress bar JSX
   */
  const generateFileUpload = () => {
    return <div key={`upload-progressbar-${productFile?.index}`}  className='AdminProductUpload-file-summary-container'>
      <div className="AdminProductUpload-filename">{productFile?.file.name}</div>
      <div><ProgressBar identifier={productFile?.index || ''} progress={productFile?.upload?.progress || 0} /></div>
    </div>
  }

  /**
   * Uploads images and file (if available)
   */
  const saveMedia = () => {
    setMediaSaving(true)
    if(productFile){
      uploadFile()
    }
    uploadImages()
  }

  /**
   * Saves the product once images and file have been uploaded
   */
  useEffect(() => {
    if(productFile){
      if(uploadState.uploadingFileSuccess && uploadState.uploadingImagesSuccess){
        if(!uploadState.savingProduct && !productSaved){
          setProductSaved(true)
          saveProduct()
        }
      }
    } else {
      if(uploadState.uploadingImagesSuccess){
        if(!uploadState.savingProduct && !productSaved){
          setProductSaved(true)
          saveProduct()
        }
      }
    }
  }, [productFile, productImageList.length, productSaved, saveProduct, uploadState.savingProduct, uploadState.uploadingFileSuccess, uploadState.uploadingImagesSuccess])

  return (
    <div className='AdminProductUpload-container'>
      <div style={{width: '70%', paddingRight: '2rem'}}>
        <div className="PanelLabel" style={{margin: '0 0 .4rem 0'}}>Image Uploads</div>
        {generateImageUploads()}

        {productFile && (
          <>
            <div className="PanelLabel" style={{margin: '1rem 0 .4rem 0'}}>File Upload</div>
            {generateFileUpload()}
          </>
        )}
      </div>

      <div style={{width: '30%'}}>
        <div className="PanelLabel" style={{border: '1px solid rgb(67,69,81)'}}>
          <div style={{marginBottom: '1rem'}}>Your product is now ready to save. After you click the save button, please do not close or refresh your browser until all uploads have completed.</div>
          {uploadState.savingProductComplete || uploadState.savingProductError ? (
            <button 
              className='Button-standard'
              onClick={() => resetAll()}
            >
              {isNewProduct ? 'Create Another Product' : 'Edit Another Product'}
            </button> 
          ) : (
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              {!isNewProduct && (
                <button 
                  className={mediaSaving ? 'Button-standard-disabled' : 'Button-standard'} 
                  onClick={() => returnToProductForm('prepare')}
                  disabled={mediaSaving}
                >
                  Back
                </button>                 
              )}
              <button 
                className={mediaSaving ? 'Button-standard-disabled' : 'Button-standard'} 
                onClick={() => saveMedia()}
                disabled={mediaSaving}
              >
                {mediaSaving ? 'Please wait...' : 'Save Product'}
              </button>
            </div>
          )}
        </div>

        {mediaSaving && (
          <div className="PanelLabel" style={{marginTop: '1rem'}}>
            {productImageList.length > 0 && (
              <div className='AdminProductUpload-status-container' style={{marginBottom: '.6rem'}}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <i className="fa-regular fa-image"></i>
                  Uploading Images              
                </div>
                {uploadState.uploadingImages && (
                  <div className='AdminProductUpload-status-spinner'>
                    <i className="fa-solid fa-spinner"></i>
                  </div>              
                )}
                {uploadState.uploadingImagesSuccess && (
                  <i className="fa-solid fa-check" style={{color: 'green'}}></i>
                )}
                {uploadState.uploadingImagesFail && (
                  <i className="fa-solid fa-xmark" style={{color: 'red'}}></i>
                )}
              </div>              
            )}

            {productFile && (
              <div className='AdminProductUpload-status-container' style={{marginBottom: '.6rem'}}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <i className="fa-solid fa-file"></i>
                  Uploading File              
                </div>
                {uploadState.uploadingFile && (
                  <div className='AdminProductUpload-status-spinner'>
                    <i className="fa-solid fa-spinner"></i>
                  </div>              
                )}
                {uploadState.uploadingFileSuccess && (
                  <i className="fa-solid fa-check" style={{color: 'green'}}></i>
                )}
                {uploadState.uploadingFileFail && (
                  <i className="fa-solid fa-xmark" style={{color: 'red'}}></i>
                )}
              </div>            
            )}

            <div className='AdminProductUpload-status-container'> 
              <div style={{display: 'flex', alignItems: 'center'}}>
                <i className="fa-solid fa-floppy-disk"></i>
                Saving Product             
              </div>
              {!uploadState.savingProductComplete && !uploadState.savingProductError && mediaSaving && (
                <div className='AdminProductUpload-status-spinner'>
                  <i className="fa-solid fa-spinner"></i>
                </div>              
              )}
              {uploadState.savingProductComplete && (
                <i className="fa-solid fa-check" style={{color: 'green'}}></i>
              )}
              {uploadState.savingProductError && (
                <i className="fa-solid fa-xmark" style={{color: 'red'}}></i>
              )}
            </div>

            {uploadState.savingProductError && (
              <div className='Formfield-error-inline' style={{marginTop: '1rem'}}>{uploadState.savingProductError}</div>
            )}
          </div>          
        )}

      </div>
    </div>
  )
}

export default AdminProductUpload
