import React from 'react'
import { Link } from 'react-router-dom'

import './Shop.css'

interface IShopCheckoutProgressProps {
  checkoutStage: string,
  updateCheckoutStage: (stage: string) => void,
  contactDetailsStageAllowed: boolean,
  summaryStageAllowed: boolean,
  paymentStageAllowed: boolean,
}

const ShopCheckoutProgress: React.FC<IShopCheckoutProgressProps> = (props: IShopCheckoutProgressProps) => {
  const { 
    checkoutStage, 
    updateCheckoutStage, 
    contactDetailsStageAllowed, 
    summaryStageAllowed,
    paymentStageAllowed
  } = props

  return (
    <div  className='PanelLabel' style={{marginTop: '1.6rem'}}>
      <div className='ShopCheckout-breadcrumb-container'>
        <Link to='/basket' title='Basket'>Basket</Link>
        <i className='fa-solid fa-caret-right'></i>
        <div 
          title='Contact Details'
          className={`ShopCheckout-breadcrumb-link${checkoutStage === 'contactDetails' ? '__active' : contactDetailsStageAllowed ? '' : '__inactive'}`}
          onClick={() => updateCheckoutStage('contactDetails')}
        >
          Contact Details
        </div>
        <i className='fa-solid fa-caret-right'></i>
        <div 
          title='Summary'
          className={`ShopCheckout-breadcrumb-link${checkoutStage === 'summary' ? '__active' : summaryStageAllowed ? '' : '__inactive'}`}
          onClick={() => updateCheckoutStage('summary')}
        >
          Summary
        </div>
        <i className='fa-solid fa-caret-right'></i>
        <div 
          title='Payment'
          className={`ShopCheckout-breadcrumb-link${checkoutStage === 'payment' ? '__active' : paymentStageAllowed ? '' : '__inactive'}`}
          onClick={() => updateCheckoutStage('payment')}
        >
          Payment
        </div>
      </div>
    </div>
  )
}

export default ShopCheckoutProgress