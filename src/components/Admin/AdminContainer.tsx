import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { 
  AdminShopProducts,
  AdminOrders,
  AdminCampaigns,
  AdminDocuments,
  AdminFirmware,
} from '.'
import { isAdminRequest } from '../../store/community/community-actions'
import { IStoreState } from '../../types/store-types'
import Spinner from '../Spinner'
import './Admin.css'

const AdminContainer = (): ReactElement => {
  const dispatch = useDispatch()
  const { 
    community
  } = useSelector<IStoreState, IStoreState>((store) => store)

  const [adminWorkspace, setAdminWorkspace] = useState('products')

  /**
   * Switches tabs
   * @param tab 
   */
  const handleClickTab = (tab: string) => {
    if(adminWorkspace !== tab) setAdminWorkspace(tab)
  }

  /**
   * Checks for admin privileges
   */
  const isAdmin = useCallback(() => {
    dispatch(isAdminRequest())
  }, [dispatch])
  
  useEffect(() => {
    isAdmin()
  }, [isAdmin])
  
  if(community.apiError && community.apiError.message  === 'NOT_ADMIN'){
    return <Redirect to='/404' />
  }

  return (
    <>
      {community.adminLoading && (
        <Spinner />
      )}

      <div className='Admin-container'>
        <h2><span className="Colour-blue-bright">Admin</span></h2>
        <div className='Admin-tabs-container'>
          <div 
            className={`Admin-tab${adminWorkspace === 'products' ? '__selected' : ''}`} 
            style={{marginRight: '1px'}} 
            onClick={() => handleClickTab('products')}
          >
            Products
          </div>
          <div 
            className={`Admin-tab${adminWorkspace === 'orders' ? '__selected' : ''}`} 
            style={{marginRight: '1px'}} 
            onClick={() => handleClickTab('orders')}
          >
            Orders
          </div>
          <div 
            className={`Admin-tab${adminWorkspace === 'campaigns' ? '__selected' : ''}`} 
            style={{marginRight: '1px'}} 
            onClick={() => handleClickTab('campaigns')}
          >
            Campaigns
          </div>
          <div 
            className={`Admin-tab${adminWorkspace === 'affiliates' ? '__selected' : ''}`} 
            style={{marginRight: '1px'}} 
            onClick={() => handleClickTab('affiliates')}
          >
            Affiliates
          </div>
          <div 
            className={`Admin-tab${adminWorkspace === 'documents' ? '__selected' : ''}`} 
            style={{marginRight: '1px'}} 
            onClick={() => handleClickTab('documents')}
          >
            Documents
          </div>
          <div 
            className={`Admin-tab${adminWorkspace === 'news' ? '__selected' : ''}`} 
            style={{marginRight: '1px'}} 
            onClick={() => handleClickTab('news')}
          >
            News
          </div>
          <div 
            className={`Admin-tab${adminWorkspace === 'polls' ? '__selected' : ''}`} 
            onClick={() => handleClickTab('polls')}
          >
            Polls
          </div>
          <div 
            className={`Admin-tab${adminWorkspace === 'firmware' ? '__selected' : ''}`} 
            onClick={() => handleClickTab('firmware')}
          >
            Firmware
          </div>
        </div>

        {adminWorkspace === 'products' && (
          <AdminShopProducts />
        )}

        {adminWorkspace === 'orders' && (
          <AdminOrders />
        )}

        {adminWorkspace === 'campaigns' && (
          <AdminCampaigns />
        )}

        {adminWorkspace === 'documents' && (
          <AdminDocuments />
        )}

        {adminWorkspace === 'firmware' && (
          <AdminFirmware />
        )}
      </div>
    </>
  )
}

export default AdminContainer
