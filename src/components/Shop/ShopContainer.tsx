import React, { ReactElement, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { 
  ShopGroupCard,
} from '.'
import Spinner from '../Spinner'
import { getShopGroupsRequest } from '../../store/shop/shop-actions'
import { IStoreState } from '../../types/store-types'
import './Shop.css'

const ShopContainer = (): ReactElement => {
  const dispatch = useDispatch()
  const { 
    shop
  } = useSelector<IStoreState, IStoreState>((store) => store)

  const loadShopGroups = useCallback(() => {
    dispatch(getShopGroupsRequest())
  }, [dispatch])
  
  useEffect(() => {
    if(!shop.groups){
      loadShopGroups()
    }
  }, [loadShopGroups, shop.groups])

  return (
    <>
      {(shop.groupsLoading) && (
        <Spinner />
      )}

      <div className='Shop-container'>
        <h1><span className="Colour-blue-bright">Shop</span></h1>
        <div>
          {shop.groups?.map(g => (
            <ShopGroupCard 
              key={g.groupAddress} 
              address={g.groupAddress}
              name={g.groupName}
              desc={g.groupDescription}
              image={g.groupImage}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default ShopContainer
