import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import parse from 'html-react-parser'

import { IStoreState } from '../../types/store-types'
import { ShopBasketItem, ShopCheckoutSummary } from '../../types/shop-types'
import { addFloatValues, multiplyFloatValues } from '../../utils/financial-utils'
import Spinner from '../Spinner'
import ShopBasketProduct from './ShopBasketProduct'
import './Shop.css'

interface IShopBasketContainerProps {
  tokenIsValid: boolean,
}

const ShopBasketContainer: React.FC<IShopBasketContainerProps> = (props: IShopBasketContainerProps) => {
  const { 
    shop
  } = useSelector<IStoreState, IStoreState>((store) => store)

  const [checkoutSummary, setCheckoutSummary] = useState<ShopCheckoutSummary>()

  /**
   * Calculates the basket summary
   * @param basketItems
   * @param shipping
   * @param tax
   */
  const calculateBasketSummary = (basketItems: ShopBasketItem[], shipping: string, tax: string) => {
    const itemCosts: string[] = []
    basketItems.forEach(b => {
      itemCosts.push(multiplyFloatValues(b.item.productPrice, b.amount.toString()))
    })

    const summarySubTotal = addFloatValues(itemCosts)
    const summaryTotal = addFloatValues([summarySubTotal, shipping, tax])
    setCheckoutSummary({
      sub: summarySubTotal,
      shipping,
      tax,
      total: summaryTotal
    })
  }

  useEffect(() => {
    if(shop.basketItems && shop.basketItems?.length > 0){
      calculateBasketSummary(shop.basketItems, '0.00', '0.00')
    }
  }, [shop.basketItems])

  return (
    <>
      {(shop.customerDetailaLoading) && (
        <Spinner />
      )}

      <div className='Shop-container'>
        {shop.basketItems?.length === 0 ? (
          <div className='ShopCheckout-empty-container'>
            <div className='ShopCheckout-empty-leftCol'>
              <i className="fa-solid fa-face-sad-tear"></i>
            </div>
            <div className='ShopCheckout-empty-rightCol'>
              <h1>Oh no!</h1>
              <h3 style={{marginTop: '1rem'}}>You haven&apos;t added anything to your basket yet.</h3>
              <p style={{marginTop: '2rem'}}>Why not visit our shop, load up on goodies, then come back for another go.</p>
            </div>
          </div>
        ) : (
          <>
            <h1><span className="Colour-blue-bright">Basket</span></h1>

            <div className='ShopBasket-container'>
              <div className='ShopBasket-container-leftCol'>      
                <>
                  <h3>Basket Items</h3>
                  {shop.basketItems?.map((b, i) => (
                    <ShopBasketProduct key={i} basketItem={b} allowQuantityUpdates={true} />
                  ))}
                </>
              </div>
            
              <div className='ShopBasket-container-rightCol'>
                <>
                  <h3>Summary</h3>
                  <div className="PanelLabel" style={{marginTop: '1rem'}}>
                    <div className='ShopBasket-summary-item'>
                      <p>Subtotal:</p><p>{parse(`&euro;${checkoutSummary?.sub}`)}</p>
                    </div>
                    <div className='ShopBasket-summary-item'>
                      <p>Shipping:</p><p>{parse(`&euro;${checkoutSummary?.shipping}`)}</p>
                    </div>
                    <div className='ShopBasket-summary-item'>
                      <p>Sales Tax:</p><p>{parse(`&euro;${checkoutSummary?.tax}`)}</p>
                    </div>
                    <div className='ShopBasket-summary-item'>
                      <p><strong>Total:</strong></p><p><strong>{parse(`&euro;${checkoutSummary?.total}`)}</strong></p>
                    </div>
                  </div>

                  <div className="PanelAlert" style={{marginTop: '1.4rem', marginBottom: '1.6rem'}}>Please note, your shipping and sales tax costs will be calculated when you checkout your basket.</div>

                  <Link to="/checkout" title="Checkout Basket">
                    <button className='Button-standard'>Checkout your basket</button>
                  </Link>
                </>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default ShopBasketContainer
