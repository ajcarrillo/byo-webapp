import React, { useState } from 'react'

import AdminShopProductsNewGroup from './AdminShopProductsNewGroup'
import AdminShopProductsEditGroup from './AdminShopProductsEditGroup'
import AdminShopProductsNewProduct from './AdminShopProductsNewProduct'
import AdminShopProductsEditProduct from './AdminShopProductsEditProduct'
import './AdminShopProducts.css'

export type ProductFileUpload = {
  progress: number,
  response: any,
}

export type ProdFile = {
  index: string,
  name: string,
  upload: ProductFileUpload,
  file: File,
}

export type ExistingProdFile = {
  url: string,
  name: string,
  address: string,
}

export type ProductUploadingState = {
  uploadingImages: boolean,
  uploadingImagesComplete: boolean,
  uploadingImagesSuccess: boolean,
  uploadingImagesFail: boolean,
  uploadingFile: boolean,
  uploadingFileComplete: boolean,
  uploadingFileSuccess: boolean,
  uploadingFileFail: boolean,
  savingProduct: boolean,
  savingProductComplete: boolean,
  savingProductError: string,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IAdminShopProductsProps {}

const AdminShopProducts: React.FC<IAdminShopProductsProps> = (props: IAdminShopProductsProps) => {

  const [workspace, setWorkspace] = useState('newGroup')

  const META_DESCRIPTION_LIMIT = 256
  const META_KEYWORDS_LIMIT = 256
  const PRODUCT_DESCRIPTION_LIMIT = 1000
  const MAX_IMAGE_SIZE_MB = 2
  const MAX_FILE_SIZE_MB = 100
  
  return (
    <>
      <div className='Admin-shop-products-container'>

        <div className='Admin-menu-container'>
          <div 
            title='New Group'
            className={`Admin-menu-link${workspace === 'newGroup' ? '__active' : ''}`}
            onClick={() => setWorkspace('newGroup')}
          >
            New Group
          </div>
          <i className='fa-solid fa-minus'></i>
          <div 
            title='Edit Group'
            className={`Admin-menu-link${workspace === 'editGroup' ? '__active' : ''}`}
            onClick={() => setWorkspace('editGroup')}
          >
            Edit Group
          </div>
          <i className='fa-solid fa-minus'></i>
          <div 
            title='New Product'
            className={`Admin-menu-link${workspace === 'newProduct' ? '__active' : ''}`}
            onClick={() => setWorkspace('newProduct')}
          >
            New Product
          </div>
          <i className='fa-solid fa-minus'></i>
          <div 
            title='Edit Product'
            className={`Admin-menu-link${workspace === 'editProduct' ? '__active' : ''}`}
            onClick={() => setWorkspace('editProduct')}
          >
            Edit Product
          </div>
        </div>

        <div className='Admin-workspace-container'>
          {workspace === 'newGroup' && (
            <AdminShopProductsNewGroup />
          )}

          {workspace === 'editGroup' && (
            <AdminShopProductsEditGroup />
          )}

          {workspace === 'newProduct' && (
            <AdminShopProductsNewProduct 
              metaDescriptionLimit={META_DESCRIPTION_LIMIT}
              metaKeywordsLimit={META_KEYWORDS_LIMIT}
              productDescriptionLimit={PRODUCT_DESCRIPTION_LIMIT}
              maxImageSizeMB={MAX_IMAGE_SIZE_MB}
              maxFileSizeMB={MAX_FILE_SIZE_MB}
            />
          )}

          {workspace === 'editProduct' && (
            <AdminShopProductsEditProduct 
              metaDescriptionLimit={META_DESCRIPTION_LIMIT}
              metaKeywordsLimit={META_KEYWORDS_LIMIT}
              productDescriptionLimit={PRODUCT_DESCRIPTION_LIMIT}
              maxImageSizeMB={MAX_IMAGE_SIZE_MB}
              maxFileSizeMB={MAX_FILE_SIZE_MB}
            />
          )}
        </div>

      </div>
    </>
  )
}

export default AdminShopProducts
