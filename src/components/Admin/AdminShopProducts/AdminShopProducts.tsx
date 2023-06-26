import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { IStoreState } from '../../../types/store-types'
import AdminShopProductsNewGroup from './AdminShopProductsNewGroup'
import AdminShopProductsEditGroup from './AdminShopProductsEditGroup'
import AdminShopProductsNewProduct from './AdminShopProductsNewProduct'
import AdminShopProductsEditProduct from './AdminShopProductsEditProduct'
import './AdminShopProducts.css'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IAdminShopProductsProps {}

const AdminShopProducts: React.FC<IAdminShopProductsProps> = (props: IAdminShopProductsProps) => {
  const dispatch = useDispatch()
  const { 
    shop
  } = useSelector<IStoreState, IStoreState>((store) => store)

  const [workspace, setWorkspace] = useState('newGroup')
  
  return (
    <>
      {/* {community.postsLoading && (
        <Spinner />
      )} */}

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
            <AdminShopProductsNewProduct formData={null}/>
          )}

          {workspace === 'editProduct' && (
            <AdminShopProductsEditProduct />
          )}
        </div>

      </div>
    </>
  )
}

export default AdminShopProducts
