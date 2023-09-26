import React, { useState } from 'react'

import { useEffectOnlyOnce } from '../../utils/hooks'
import { apiCall } from '../../utils/api-utils'
import { getStoredAccessToken, getStoredUserAddress, updateStoredAccessToken } from '../../utils/user-utils'
import './Community.css'
import { Controller } from '../../types/controller-types'
import CommunityControllerItem from './CommunityControllerItem'

interface ICommunityContainerProps {
  tokenIsValid: boolean,
}

const CommunityContainer: React.FC<ICommunityContainerProps> = (props: ICommunityContainerProps) => {
  const [gettingControllers, setGettingControllers] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [userAddress, setUserAddress] = useState('')
  const [controllerList, setControllerList] = useState<{personal: Controller[], community: Controller[]} | null>(null)

  const handleSearchChange = (value: string) => {
    setSearchText(value)
  }

  const handleClickSearch = () => {
    if(searchText) searchCotrollers()
  }

  const handleClickDeleteController = async (address: string) => {
    const token = getStoredAccessToken().accesToken
    const response = await apiCall(
      `${process.env.REACT_APP_API_BASE_URL}/community/controllers/delete`,
      'POST',
      token,
      {address},
      'json'
    )

    if(response.status === 200){
      removeController(address)
    }else if(response.status === 401){
      updateStoredAccessToken('', false)
      window.location.reload()
    }else{
      //setControllerList(null)
    }
  }

  const removeController = (address: string) => {
    const controllers = controllerList?.personal.filter(c => c.controllerAddress !== address)
    setControllerList({personal: controllers || [], community: controllerList?.community || []})
  }

  const searchCotrollers = async () => {
    setGettingControllers(true)
    const token = getStoredAccessToken().accesToken
    const uAddress = getStoredUserAddress()
    setUserAddress(uAddress || '')
    const response = await apiCall(
      `${process.env.REACT_APP_API_BASE_URL}/community/tags/search/${searchText}`,
      'GET',
      token,
      'json'
    )

    if(response.status === 200){
      setGettingControllers(false)
      setControllerList(response.data.controllers)
    }else if(response.status === 401){
      updateStoredAccessToken('', false)
      window.location.reload()
    }else{
      setGettingControllers(false)
      setControllerList(null)
    }
  }

  /**
   * Fetches a list of controllers
   */
  const getControllerList = async () => {
    setGettingControllers(true)
    const token = getStoredAccessToken().accesToken
    const uAddress = getStoredUserAddress()
    setUserAddress(uAddress || '')
    const response = await apiCall(
      `${process.env.REACT_APP_API_BASE_URL}/community/controllers`,
      'GET',
      token,
      'json'
    )

    if(response.status === 200){
      setGettingControllers(false)
      setControllerList(response.data.controllers)
    }else if(response.status === 401){
      updateStoredAccessToken('', false)
      window.location.reload()
    }else{
      setGettingControllers(false)
      setControllerList(null)
    }
  }

  useEffectOnlyOnce(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (dependencies) => {
      getControllerList()
    },
    [true],
    (dependencies) => dependencies[0] === true
  )

  return (
    <div className={'App-container'}>
      <div className='Community-search-container'>
        <div style={{width: '200px'}}>
          <input
            className="Textfield-dark" 
            type='text' 
            onChange={(e) => handleSearchChange(e.target.value)} 
            value={searchText}
            placeholder="Search tags....." 
            style={{ width: '100%' }}
            data-lpignore="true"
            autoComplete='off'
          />          
        </div>

        <button 
          className='Button-standard'
          onClick={() => handleClickSearch()}
        >
          Search
        </button>
      </div>

      <div className='Community-controller-container'>
        {controllerList && (
          controllerList.personal.map((c: Controller) => 
            <CommunityControllerItem 
              key={c.controllerAddress}
              controllerAddress={c.controllerAddress}
              image={c.image}
              name={c.name}
              rating={c.rating}
              tags={c.tags || undefined}
              profileName={c.userProfileName}
              isOwner={c.userAddress === userAddress}
              deleteController={handleClickDeleteController}
            />  
          )
        )}
      </div>
    </div>
  )
}

export default CommunityContainer