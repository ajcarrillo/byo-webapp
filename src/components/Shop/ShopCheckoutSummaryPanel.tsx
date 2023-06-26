import React from 'react'
import parse from 'html-react-parser'

import { ShopCheckoutSummary } from '../../types/shop-types'
import './Shop.css'

interface IShopCheckoutSummaryPanelProps {
  summary: ShopCheckoutSummary,
}

const ShopCheckoutSummaryPanel: React.FC<IShopCheckoutSummaryPanelProps> = (props: IShopCheckoutSummaryPanelProps) => {
  const { summary: {sub, shipping, tax, total} } = props
  return (
    <>
      <div className='ShopCheckout-summary-item'>
        <p>Subtotal:</p><p>{parse(`&euro;${sub}`)}</p>
      </div>
      <div className='ShopCheckout-summary-item'>
        <p>Shipping:</p><p>{parse(`&euro;${shipping}`)}</p>
      </div>
      <div className='ShopCheckout-summary-item'>
        <p>Sales Tax:</p><p>{parse(`&euro;${tax}`)}</p>
      </div>
      <div className='ShopCheckout-summary-item'>
        <p><strong>Total:</strong></p><p><strong>{parse(`&euro;${total}`)}</strong></p>
      </div>
    </>
  )
}

export default ShopCheckoutSummaryPanel