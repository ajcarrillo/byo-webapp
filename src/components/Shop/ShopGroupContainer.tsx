import React, { useCallback, useEffect, useState } from 'react'
import { Link, Redirect, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { getShopGroupProductsRequest } from '../../store/shop/shop-actions'
import { IStoreState } from '../../types/store-types'
import ShopProductSummary from './ShopProductSummary'
import './Shop.css'
import Spinner from '../Spinner'

type GroupAddress = {
  address: string,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IShopGroupContainerProps {}

const ShopGroupContainer: React.FC<IShopGroupContainerProps> = (props: IShopGroupContainerProps) => {
  const dispatch = useDispatch()
  const { 
    shop
  } = useSelector<IStoreState, IStoreState>((store) => store)
  const { address } = useParams<GroupAddress>()

  const [groupName, setGroupName] = useState('')

  useEffect(() => {
    if(!groupName){
      const grp = shop.groups?.find(g => g.groupAddress === address)
      if(grp) setGroupName(grp.groupName)
    }
  }, [address, groupName, shop.groups])

  /**
   * Loads the shop group products if they are not in the store
   */
  const loadShopGroupProducts = useCallback((gAddress: string) => {
    if(
      !shop.products || 
      !shop.groupsFetched?.includes(gAddress)
    ){
      dispatch(getShopGroupProductsRequest(gAddress))
    }
  }, [dispatch, shop.groupsFetched, shop.products])
  
  useEffect(() => {
    if(!shop.productsLoading){
      loadShopGroupProducts(address)
    }
  }, [address, loadShopGroupProducts, shop.productsLoading])
  
  /**
   * If group does not exist - redirect away
   */
  if(shop.groups && !shop.groups.some(g => g.groupAddress === address)){
    return <Redirect to='/404' />
  }

  return (
    <>
      {(shop.productsLoading) && (
        <Spinner />
      )}

      <div className='Shop-container'>
        <h1><span className="Colour-blue-bright">{groupName}</span></h1>

        <div className='Shop-breadcrumb-back'>
          <i className="fa-solid fa-circle-arrow-left"></i>
          <Link to='/shop' title='Back to shop'>Back to shop</Link>
        </div>
        
        <div>
          {shop.products?.filter(p => p.productGroups.includes(address)).map(prod => (
            <ShopProductSummary 
              key={prod.productAddress} 
              address={prod.productAddress}
              name={prod.productName}
              desc={prod.productDescription}
              image={prod.productImages[0]}
              price={prod.productPrice}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default ShopGroupContainer