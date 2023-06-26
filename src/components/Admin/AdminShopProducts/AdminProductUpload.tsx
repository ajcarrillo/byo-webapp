import React, { useEffect, useState } from 'react'

import { ProdFile, UploadingState } from './AdminShopProductsNewProduct'
import ProgressBar from '../../ProgressBar'

interface IAdminProductUploadProps {
  productImageList: ProdFile[],
  productFile: ProdFile | null,
  uploadState: UploadingState,
  uploadImages: () => void,
  uploadFile: () => void,
  saveProduct: () => Promise<void>,
  resetAll: () => void
}

const AdminProductUpload: React.FC<IAdminProductUploadProps> = (props: IAdminProductUploadProps) => {
  const { 
    productImageList, 
    productFile, 
    uploadState,
    uploadImages,
    uploadFile,
    saveProduct,
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
  }, [productFile, saveProduct, productSaved, uploadState])

  console.log(productImageList)
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
        <div className="PanelLabel">
          <div style={{marginBottom: '1rem'}}>Your new product is now ready to save. After you click the save button, please do not close or refresh your browser until all uploads have completed.</div>
          {uploadState.savingProductComplete || uploadState.savingProductError ? (
            <button 
              className='Button-standard'
              onClick={() => resetAll()}
            >
              Start Again
            </button> 
          ) : (
            <button 
              className={mediaSaving ? 'Button-standard-disabled' : 'Button-standard'} 
              onClick={() => saveMedia()}
              disabled={mediaSaving}
            >
              {mediaSaving ? 'Please wait...' : 'Save Product'}
            </button>            
          )}
        </div>

        {mediaSaving && (
          <div className="PanelLabel" style={{marginTop: '1rem'}}>
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
