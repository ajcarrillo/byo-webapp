import React, { useCallback, useEffect, useState } from 'react'
import { useParams, Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { getShopProductsRequest } from '../../store/shop/shop-actions'
import { IStoreState } from '../../types/store-types'
import { ShopBasketItem, ShopProduct } from '../../types/shop-types'
import { updateShoppingBasketObservable } from '../../utils/events'
import ImageSlider from '../ImageSlider'
import Spinner from '../Spinner'
import './Shop.css'

export type ProductAddress = {
  address: string,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IShopProductContainerProps {}

const ShopProductContainer: React.FC<IShopProductContainerProps> = (props: IShopProductContainerProps) => {
  const dispatch = useDispatch()
  const { 
    shop
  } = useSelector<IStoreState, IStoreState>((store) => store)

  const { address } = useParams<ProductAddress>()
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct>()

  const selectProductFromStore = useCallback((pAddress: string) => {
    const product = shop.products?.find(p => p.productAddress === pAddress)
    if(product){
      setSelectedProduct(product)
    }
  }, [shop.products])

  useEffect(() => {
    selectProductFromStore(address)
  }, [address, selectProductFromStore])

  const loadShopProducts = useCallback(() => {
    dispatch(getShopProductsRequest())
  }, [dispatch])
  
  useEffect(() => {
    if(!shop.products){
      loadShopProducts()
    }
  }, [loadShopProducts, shop.products])

  if(shop.products && !shop.products.some(p => p.productAddress === address)){
    return <Redirect to='/404' />
  }

  const doBasketThing = (amount: number) => {
    if(selectedProduct){
      const item: ShopBasketItem = {
        item: selectedProduct,
        amount,
      }
      updateShoppingBasketObservable.next(item)      
    }
  }

  return (
    <>
      {(shop.productsLoading) && (
        <Spinner />
      )}

      <div className='Shop-container'>
        <h1><span className="Colour-blue-bright">Shop</span></h1>

        <ImageSlider 
          images={selectedProduct?.productImages || []} 
          width='300px' 
          height='200px' 
          carouselClass='ShopProduct-image-carousel'
        />

        <button onClick={() => doBasketThing(1)}>add 1</button>
        <button onClick={() => doBasketThing(0)}>remove</button>
        <button onClick={() => doBasketThing(2)}>add 2</button>
      </div>
    </>
  )
}

export default ShopProductContainer
