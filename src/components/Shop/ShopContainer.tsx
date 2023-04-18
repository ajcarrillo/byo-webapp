import React, { ReactElement, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { 
  ShopProductSummary,
} from '.'
import Spinner from '../Spinner'
import { getShopProductsRequest } from '../../store/shop/shop-actions'
import { IStoreState } from '../../types/store-types'
import './Shop.css'

const ShopContainer = (): ReactElement => {
  const dispatch = useDispatch()
  const { 
    shop
  } = useSelector<IStoreState, IStoreState>((store) => store)

  const loadShopProducts = useCallback(() => {
    dispatch(getShopProductsRequest())
  }, [dispatch])
  
  useEffect(() => {
    if(!shop.products){
      loadShopProducts()
    }
  }, [loadShopProducts, shop.products])

  return (
    <>
      {(shop.productsLoading) && (
        <Spinner />
      )}

      <div className='Shop-container'>
        <h1><span className="Colour-blue-bright">Shop</span></h1>
        <div>
          {shop.products?.map(p => (
            <ShopProductSummary 
              key={p.productAddress} 
              address={p.productAddress}
              name={p.productName}
              desc={p.productDescription}
              price={p.productPrice}
              image={p.productImages[0]}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default ShopContainer
