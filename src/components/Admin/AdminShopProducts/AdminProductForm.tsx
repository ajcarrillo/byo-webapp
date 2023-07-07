import React, { useState } from 'react'
import Select from 'react-select'

import { ShopProduct } from '../../../types/shop-types'
import { reactSelectCustomStyles } from '../../CustomControls/SelectDropdown/custom-styles'
import { SelectType } from '../../../types/global-types'
import { downloadProductFile } from '../../../utils/download-utils'
import { updateStoredAccessToken } from '../../../utils/user-utils'
import { ExistingProdFile, ProdFile } from './AdminShopProducts'
import FileSelector from '../../FileSelector'

interface IAdminProductFormProps {
  isNewProduct: boolean,
  errors: any,
  state: ShopProduct,
  metaDescriptionLimit: number,
  metaKeywordsLimit: number,
  productDescriptionLimit: number,
  productGroupsList: readonly SelectType[],
  selectedProductGroups: readonly SelectType[],
  productImageList: ProdFile[],
  existingProductImageList: ExistingProdFile[]
  productFile: ProdFile | null,
  existingProductFile: ExistingProdFile | null,
  handleInputChange: (param: string, value: string) => void,
  handleSelectProductGroups: (groupsSelected: readonly SelectType[]) => void,
  handleSelectProductImage: (identifier: string | number, file: any) => void,
  handleClickRemoveImage: (index: string) => void,
  handleClickRemoveExistingImage: (address: string) => void,
  setProductFile: React.Dispatch<React.SetStateAction<ProdFile | null>>,
  setExistingProductFile: React.Dispatch<React.SetStateAction<ExistingProdFile | null>> | null,
  handleSelectProductFile: (identifier: string | number, file: any) => void,
  runChecks: () => void
}

const AdminProductForm: React.FC<IAdminProductFormProps> = (props: IAdminProductFormProps) => {
  const { 
    isNewProduct,
    errors, 
    state, 
    metaDescriptionLimit,
    metaKeywordsLimit,
    productDescriptionLimit,
    productGroupsList,
    selectedProductGroups,
    productImageList,
    existingProductImageList,
    productFile,
    existingProductFile,
    handleInputChange,
    handleSelectProductGroups,
    handleSelectProductImage,
    handleClickRemoveImage,
    handleClickRemoveExistingImage,
    setProductFile,
    setExistingProductFile,
    handleSelectProductFile,
    runChecks
  } = props

  const imageSelectInput = React.useRef<HTMLInputElement>(null)
  const fileSelectInput = React.useRef<HTMLInputElement>(null)

  const [downloading, setDownloading] = useState(false)

  const createProductImageItem = (index: string, image: File) => {
    const url = URL.createObjectURL(image)
    return <div key={`imageitem-${index}`} className='Admin-shop-new-product-image-container'>
      <div className='Admin-shop-new-product-image'>
        <img src={url} />
      </div>
      <div>{image.name}</div>
      <div>
        <button
          className="Button-small"
          onClick={() => handleClickRemoveImage(index)}
        >
          X
        </button>
      </div>
    </div>
  }

  const createExistingProductImageItem = (image: ExistingProdFile) => {
    return <div key={`imageitem-${image.address}`} className='Admin-shop-new-product-image-container'>
      <div className='Admin-shop-new-product-image'>
        <img src={image.url} />
      </div>
      <div>{image.name}</div>
      <div>
        <button
          className="Button-small"
          onClick={() => handleClickRemoveExistingImage(image.address)}
        >
          X
        </button>
      </div>
    </div>
  }

  const downloadFile = async (address: string) => {
    setDownloading(true)
    const response = await downloadProductFile(address)
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
        <div className="PanelLabel" style={{marginBottom: '.4rem'}}>1. Search Engine Optimisation</div>

        <div style={{marginBottom: '1rem'}}>
          <input
            className="Textfield-dark" 
            type='text' 
            onChange={(e) => handleInputChange('productMetaTitle', e.target.value)} 
            value={state.productMetaTitle}
            placeholder="Meta title" 
            style={{ width: '100%' }}
            data-lpignore="true"
            autoComplete='off'
          />
          {errors.metaTitle && (
            <div className="Formfield-error-inline">{errors.metaTitle}</div>
          )}
        </div>

        <div style={{marginBottom: '1rem'}}>
          <textarea
            className={'Textfield-dark'}
            onChange={(e) => handleInputChange('productMetaDescription', e.target.value)} 
            placeholder="Meta description" 
            style={{ width: '100%' }} 
            rows={3} 
            value={state.productMetaDescription}
          ></textarea>
          {errors.metaDescription && (
            <div className="Formfield-error-inline" style={{marginTop: '.2rem', marginBottom: '.2rem'}}>{errors.metaDescription}</div>
          )}            
          <div style={{textAlign: 'right', fontSize: '.89rem', color: 'rgb(140,140,140)', marginBottom: '1rem'}}>{metaDescriptionLimit - state.productMetaDescription.length || 0}</div>
        </div>

        <div style={{marginBottom: '1rem'}}>
          <textarea
            className={'Textfield-dark'}
            onChange={(e) => handleInputChange('productMetaKeywords', e.target.value)} 
            placeholder="Meta keywords" 
            style={{ width: '100%' }} 
            rows={3} 
            value={state.productMetaKeywords}
          ></textarea>
          {errors.metaKeywords && (
            <div className="Formfield-error-inline" style={{marginTop: '.2rem', marginBottom: '.2rem'}}>{errors.metaKeywords}</div>
          )}            
          <div style={{textAlign: 'right', fontSize: '.89rem', color: 'rgb(140,140,140)', marginBottom: '1rem'}}>{metaKeywordsLimit - state.productMetaKeywords.length || 0}</div>
        </div>

        <div className="PanelLabel" style={{marginBottom: '.4rem'}}>2. Product Details</div>

        <div style={{marginBottom: '1rem'}}>
          <Select 
            isMulti 
            closeMenuOnSelect={false} 
            styles={reactSelectCustomStyles} 
            options={productGroupsList} 
            value={selectedProductGroups} 
            placeholder='Product groups' 
            onChange={(opts) => handleSelectProductGroups(opts)}
          />
          {errors.groups && (
            <div className="Formfield-error-inline" style={{marginTop: '.2rem', marginBottom: '.2rem'}}>{errors.groups}</div>
          )} 
        </div>

        <div style={{marginBottom: '1rem'}}>
          <input
            className={isNewProduct ? 'Textfield-dark' : 'Textfield-dark-disabled'}
            type='text' 
            disabled={!isNewProduct}
            onChange={(e) => handleInputChange('productCode', e.target.value)} 
            value={state.productCode}
            placeholder="Product code" 
            style={{ width: '100%' }}
            data-lpignore="true"
            autoComplete='off'
          />
          {errors.productCode && (
            <div className="Formfield-error-inline">{errors.productCode}</div>
          )}
        </div>

        <div style={{marginBottom: '1rem'}}>
          <input
            className="Textfield-dark" 
            type='text' 
            onChange={(e) => handleInputChange('productName', e.target.value)} 
            value={state.productName}
            placeholder="Product name" 
            style={{ width: '100%' }}
            data-lpignore="true"
            autoComplete='off'
          />
          {errors.productName && (
            <div className="Formfield-error-inline">{errors.productName}</div>
          )}
        </div>

        <div style={{marginBottom: '1rem'}}>
          <textarea
            className={'Textfield-dark'}
            onChange={(e) => handleInputChange('productDescription', e.target.value)} 
            placeholder="Product description" 
            style={{ width: '100%' }} 
            rows={12} 
            value={state.productDescription}
          ></textarea>
          {errors.productDescription && (
            <div className="Formfield-error-inline" style={{marginTop: '.2rem', marginBottom: '.2rem'}}>{errors.productDescription}</div>
          )}            
          <div style={{textAlign: 'right', fontSize: '.89rem', color: 'rgb(140,140,140)', marginBottom: '1rem'}}>{productDescriptionLimit - state.productDescription.length || 0}</div>
        </div>

        <div className="PanelLabel" style={{marginBottom: '.4rem'}}>3. Stock &amp; Pricing</div>

        <div style={{marginBottom: '1rem'}}>
          <input
            className="Textfield-dark" 
            type='text' 
            onChange={(e) => handleInputChange('productPrice', e.target.value)} 
            value={state.productPrice}
            placeholder="Product price" 
            style={{ width: '100%' }}
            data-lpignore="true"
            autoComplete='off'
          />
          {errors.productPrice && (
            <div className="Formfield-error-inline">{errors.productPrice}</div>
          )}
        </div>

        <div style={{marginBottom: '1rem'}}>
          <input
            className="Textfield-dark" 
            type='text' 
            onChange={(e) => handleInputChange('productStockLevel', e.target.value)} 
            value={state.productStockLevel}
            placeholder="Stock level" 
            style={{ width: '100%' }}
            data-lpignore="true"
            autoComplete='off'
          />
          {errors.productStockLevel && (
            <div className="Formfield-error-inline">{errors.productStockLevel}</div>
          )}
        </div>

        <div style={{marginBottom: '1rem'}}>
          <input
            className="Textfield-dark" 
            type='text' 
            onChange={(e) => handleInputChange('productDispatchTime', e.target.value)} 
            value={state.productDispatchTime}
            placeholder="Dispatch time" 
            style={{ width: '100%' }}
            data-lpignore="true"
            autoComplete='off'
          />
          {errors.productDispatchTime && (
            <div className="Formfield-error-inline">{errors.productDispatchTime}</div>
          )}
        </div>
      </div>

      <div style={{width: '40%'}}>
        <div className="PanelLabel" style={{marginBottom: '.4rem'}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div>4. Product Images</div>
            <button
              className="Button-small"
              onClick={() => imageSelectInput?.current?.click()}
            >
              {productImageList.length === 0 && existingProductImageList.length === 0 ? 'Select Image' : 'Select Another Image'}
            </button>
          </div>
        </div>
        {errors.image && (
          <div className="Formfield-error-inline" style={{marginTop: '.2rem', marginBottom: '.2rem'}}>{errors.image}</div>
        )}
        <FileSelector ref={imageSelectInput} accept='image/png, image/jpeg' identifier={'-not-used-'} update={handleSelectProductImage} />
        <div>
          {productImageList.map(img => 
            createProductImageItem(img.index, img.file)
          )}
        </div>

        {!isNewProduct && (
          <div>
            {existingProductImageList.map(img => 
              createExistingProductImageItem(img)
            )}
          </div>          
        )}

        <div className="PanelLabel" style={{margin: '1rem 0 .4rem 0'}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div>5. Digital File</div>
            <button
              className="Button-small"
              onClick={() => fileSelectInput?.current?.click()}
            >
              {productFile || existingProductFile ? 'Reselect Zip File' : 'Select Zip File'}
            </button>
          </div>
        </div>
        {errors.file && (
          <div className="Formfield-error-inline" style={{marginTop: '.2rem', marginBottom: '.2rem'}}>{errors.file}</div>
        )}
        <FileSelector ref={fileSelectInput} accept='application/zip' identifier={'-not-used-'} update={handleSelectProductFile} />
        {productFile && (
          <div className='Admin-shop-new-product-image-container'>
            <div>{productFile.name}</div>
            <button
              className="Button-small"
              onClick={() => setProductFile(null)}
            >
              X
            </button>
          </div>
        )}
        {existingProductFile && (
          <div className='Admin-shop-new-product-image-container'>
            <div>
              {downloading ? (
                <div className='OrdersItem-downloading-spinner'>
                  <i className="fa-solid fa-spinner"></i>
                </div>
              ) : (
                <button 
                  className="Button-icon-small" 
                  onClick={() => downloadFile(existingProductFile.address)} 
                  title='Download this file'
                >
                  <i className="fa-solid fa-cloud-arrow-down"></i>
                </button>                      
              )}
            </div>
            <div>{existingProductFile.name}</div>
            <button
              className="Button-small"
              onClick={() => setExistingProductFile && setExistingProductFile(null)}
            >
              X
            </button>
          </div>
        )}

        <div className="PanelLabel" style={{border: '1px solid rgb(67,69,81)', marginTop: '2rem'}}>
          <div style={{marginBottom: '1rem'}}>When you have entered the product details, click the continue button to upload files and save your product.</div>
          <button
            className="Button-standard"
            onClick={() => runChecks()}
          >
            Continue
          </button>
        </div>
      </div>

    </div>
  )
}

export default AdminProductForm