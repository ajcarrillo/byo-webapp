import React, { useCallback, useEffect, useState } from 'react'
import { useParams, Redirect, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import parse from 'html-react-parser'
import { Helmet } from 'react-helmet-async'

import { IStoreState } from '../../types/store-types'
import { ShopProduct, ShopSaleTracker } from '../../types/shop-types'
import { getShopProductRequest } from '../../store/shop/shop-actions'
import { BasketButton } from '../CustomControls'
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

  const [salesTrackers, setSalesTrackers] = useState<ShopSaleTracker[]>([])
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct>()
  const [selectedProductBasketAmount, setSelectedProductBasketAmount] = useState(0)

  /**
   * Checks if a product is in the Redux store
   */
  const productIsInStore = useCallback((pAddress: string) => {
    const product = shop.products?.find(p => p.productAddress === pAddress)
    if(!product)
      return false
    else
      return true
  }, [shop.products])

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
   * Fetches the product if not available
   */
  const loadProduct = useCallback((pAddress: string) => {
    dispatch(getShopProductRequest(pAddress))
  }, [dispatch])
  
  useEffect(() => {
    if(!productIsInStore(address) && !shop.productsLoading){
      loadProduct(address)
    }
  }, [address, loadProduct, productIsInStore, shop.productsLoading])

  /**
   * Checks for trackers in the URL
   */
  const addTrackers = useCallback((campaignTracker: string | null, affiliateTracker: string | null) => {
    if(salesTrackers.length === 0){
      const sT: ShopSaleTracker[] = []
      if(campaignTracker) sT.push({trackerType:'campaign', trackerCode: campaignTracker})
      if(affiliateTracker) sT.push({trackerType:'affiliate', trackerCode: affiliateTracker})
      console.log(sT)
      setSalesTrackers(sT)
    }
  }, [salesTrackers.length])

  useEffect(() => {
    const url = new URL(window.location.href)
    const campaignTracker = url.searchParams.get('cp')
    const affiliateTracker = url.searchParams.get('af')
    if(campaignTracker || affiliateTracker){
      addTrackers(campaignTracker, affiliateTracker)
    }
  }, [addTrackers])

  /**
   * If product does not exist - redirect away
   */
  if(shop.products && !shop.products?.some(p => p.productAddress === address)){
    return <Redirect to='/404' />
  }

  return (
    <>
      <Helmet>
        <title>{selectedProduct?.productMetaTitle}</title>
        <meta
          name="description"
          content={selectedProduct?.productMetaDescription}
        />
        <meta
          name="keywords"
          content={selectedProduct?.productMetaKeywords}
        />
        <link rel="canonical" href={`/product/${selectedProduct?.productAddress}`} />
      </Helmet>

      {(shop.productsLoading) && (
        <Spinner />
      )}

      <div className='Shop-container'>
        <h1><span className="Colour-blue-bright">Shop</span></h1>

        <div className='Shop-breadcrumb-back'>
          <i className="fa-solid fa-circle-arrow-left"></i>
          <Link to='/shop' title='Back to shop'>Back to shop</Link>
        </div>

        <div className='ShopProduct-container'>
          <div className='ShopProduct-container-leftCol'>
            <h3>{selectedProduct?.productName}</h3>
            <p>Product code: {selectedProduct?.productCode}</p>
            <p>{parse(selectedProduct?.productDescription || '')}</p>
          </div>
          <div className='ShopProduct-container-rightCol'>
            <ImageSlider 
              images={selectedProduct?.productImages || []} 
              carouselClass='ShopProduct-image-carousel'
            />
            <div className='ShopProduct-price-container'>
              <div>
                <h3>{parse(`&euro;${selectedProduct?.productPrice}`)}</h3>
                <p>{selectedProduct?.productStockLevel !== '0' ? 'In Stock' : 'Out of Stock'}</p>
                <p style={{lineHeight: '.8rem'}}>{selectedProduct?.productDispatchTime}</p>
              </div>
              <div>
                {selectedProduct?.productStockLevel !== '0' && (
                  <BasketButton 
                    size='standard'
                    basketItemCount={selectedProductBasketAmount} 
                    product={selectedProduct} 
                    trackers={salesTrackers}
                  />
                )}
              </div> 
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default ShopProductContainer
