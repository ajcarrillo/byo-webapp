import React from 'react'
import { Link } from 'react-router-dom'
import parse from 'html-react-parser'

import { OrdersItem } from '../../types/orders-types'
import './Orders.css'

interface IOrdersListItemProps {
  order: OrdersItem | undefined,
}

const OrdersListItem: React.FC<IOrdersListItemProps> = (props: IOrdersListItemProps) => {
  const { 
    order
  } = props 

  /**
   * Returns a localised date from a Unix timestamp
   * @param unixTimestamp Unix timestamp
   * @returns A date - localised
   */
  const dateFromTimestamp = (unixTimestamp: number) => {
    const date = new Date(unixTimestamp * 1000)
    return date.toLocaleDateString()
  }

  return (
    <div className='OrdersItem-container'>
      <div className='OrdersItem-product-list-container'>
        <h3 style={{marginBottom: '.6rem'}}>Items</h3>
        {order && order.products.map(p => (
          <div key={p.productCode} className='OrdersItem-product-container'>
            <div className='OrdersItem-product-image-container'><img src={p.productImages[0]} alt={p.productName} /></div>
            <div className='OrdersItem-product-text-container'>
              <Link to={`/product/${p.productAddress}`} title={p.productName}>
                {p.productName}
              </Link>
              <p>Product code: {p.productCode}</p>
              <p>Quantity: {p.amount}</p>
            </div>     
          </div>
        ))}
      </div>

      <div className='OrdersItem-summay-container'>
        <h3 style={{marginBottom: '.3rem'}}>Details</h3>
        <div className='OrdersItem-summary-item'>
          <p>Order date:</p><p>{dateFromTimestamp(parseInt(order?.orderDate || ''))}</p>
        </div>
        <div className='OrdersItem-summary-item'>
          <p>Order number:</p><p>{order?.orderTransactionId}</p>
        </div>
        <div className='OrdersItem-summary-item'>
          <p>Order status:</p><p>{order?.orderStatus}</p>
        </div>
        <div className='OrdersItem-summary-item'>
          <p>Payment status:</p><p>{order?.paymentStatus}</p>
        </div>

        <h3 style={{marginTop: '1.4rem', marginBottom: '.3rem'}}>Summary</h3>
        <div className='OrdersItem-summary-item'>
          <p>Subtotal:</p><p>{parse(`&euro;${order?.orderPaymentSummary.sub}`)}</p>
        </div>
        <div className='OrdersItem-summary-item'>
          <p>Shipping:</p><p>{parse(`&euro;${order?.orderPaymentSummary.shipping}`)}</p>
        </div>
        <div className='OrdersItem-summary-item'>
          <p>Sales Tax:</p><p>{parse(`&euro;${order?.orderPaymentSummary.tax}`)}</p>
        </div>
        <div className='OrdersItem-summary-item'>
          <p><strong>Total:</strong></p><p><strong>{parse(`&euro;${order?.orderPaymentSummary.total}`)}</strong></p>
        </div>
      </div>
    </div>
  )
}

export default OrdersListItem
