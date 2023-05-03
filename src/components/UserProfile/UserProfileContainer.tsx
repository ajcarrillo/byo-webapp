import React, { ReactElement, useCallback, useEffect } from 'react'
import { useParams, Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { 
  UserProfileHeader,
} from '.'
import Spinner from '../Spinner'
import { getProfileDetailsRequest } from '../../store/user-profile/user-profile-actions'
import { IStoreState } from '../../types/store-types'
import { UserProfileAddress } from '../../types/user-types'
import './UserProfile.css'

const UserProfileContainer = (): ReactElement => {
  const dispatch = useDispatch()
  const { 
    userProfile
  } = useSelector<IStoreState, IStoreState>((store) => store)

  const { address } = useParams<UserProfileAddress>()

  /**
   * Loads the profile details
   */
  const loadProfileDetails = useCallback(() => {
    dispatch(getProfileDetailsRequest(address))
  }, [dispatch, address])
  
  useEffect(() => {
    loadProfileDetails()
  }, [loadProfileDetails])

  // const loadSiteModules = useCallback(() => {
  //   dispatch(getSiteModulesRequest())
  // }, [dispatch])

  // useEffect(() => {
  //   if(!site.modules){
  //     loadSiteModules()
  //   }
  // }, [loadSiteModules, site.modules])
  
  if(userProfile.apiError && userProfile.apiError.message  === 'NOT_FOUND'){
    return <Redirect to='/404' />
  }

  return (
    <>
      {userProfile.userProfileLoading && (
        <Spinner />
      )}

      <div className='UserProfile-container'>
        <div className='UserProfile-leftCol'>
          <UserProfileHeader 
            avatarImage={userProfile.profile?.avatarImage} 
            bannerImage={userProfile.profile?.bannerImage} 
            address={address} 
          />

        </div>
        <div className='UserProfile-rightCol'>
          
        </div>
      </div>
    </>
  )
}

export default UserProfileContainer
