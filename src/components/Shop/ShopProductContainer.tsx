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
import BasketButton from '../CustomControls/BasketButton/BasketButton'

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
  const [initAmount,setinitAmount] = useState(0)
  const selectProductFromStore = useCallback((pAddress: string) => {
    const product = shop.products?.find(p => p.productAddress === pAddress)
    if(product){
      const basketItemsIndex = shop.products?.indexOf(product)
      if(basketItemsIndex != null && shop.basketItems != null){
        if(shop.basketItems[basketItemsIndex]?.amount !== undefined){
          setinitAmount(shop.basketItems[basketItemsIndex]?.amount)
        }
      }
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

  const updateBasketCount = (amount: number) => {
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
        <BasketButton size={'big'} basketItems={initAmount} onChange={updateBasketCount}/>
      </div>
    </>
  )
}

export default ShopProductContainer
