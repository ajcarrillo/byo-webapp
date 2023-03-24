import React, { useCallback, useEffect, useState } from 'react'
import { useParams, Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { getShopProductsRequest } from '../../store/shop/shop-actions'
import { IStoreState } from '../../types/store-types'
import { ShopBasketItem, ShopProduct } from '../../types/shop-types'
import { updateShoppingBasketObservable } from '../../utils/events'
import ImageSlider from '../ImageSlider'
import BasketButton from '../CustomControls/BasketButton/BasketButton'
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
  const [selectedProductBasketAmount, setSelectedProductBasketAmount] = useState(0)

  /**
   * Grabs the requested product and basket item from the store
   */
  const selectProductFromStore = useCallback((pAddress: string) => {
    const product = shop.products?.find(p => p.productAddress === pAddress)
    if(product) setSelectedProduct(product)
    const basketProduct = shop.basketItems?.find(p => p.item.productAddress === pAddress)
    if(basketProduct){
      setSelectedProductBasketAmount(basketProduct.amount)
    }else{
      setSelectedProductBasketAmount(0)
    }
  }, [shop.basketItems, shop.products])

  useEffect(() => {
    selectProductFromStore(address)
  }, [address, selectProductFromStore])

  /**
   * Loads the shop products if they are not in the store
   */
  const loadShopProducts = useCallback(() => {
    dispatch(getShopProductsRequest())
  }, [dispatch])
  
  useEffect(() => {
    if(!shop.products){
      loadShopProducts()
    }
  }, [loadShopProducts, shop.products])

  /**
   * If product does not exist - redirect away
   */
  if(shop.products && !shop.products.some(p => p.productAddress === address)){
    return <Redirect to='/404' />
  }
  console.log(shop)
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

        <BasketButton 
          basketItemCount={selectedProductBasketAmount} 
          selectedProduct={selectedProduct}
        />

      </div>
    </>
  )
}

export default ShopProductContainer
