import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { IStoreState } from '../../../types/store-types'
// import { 
//   getUserSocialFollowerCountRequest, 
//   getUserSocialMutualFollowStatusRequest,
//   updateUserSocialLoadRefreshCounter
// } from '../../../store/user-social/user-social-actions'
import { getStoredAccessToken, getStoredUserAddress } from '../../../utils/user-utils'
import { apiCall } from '../../../utils/api-utils'
import './UserProfileHeader.css'

interface IUserProfileHeaderProps {
  avatarImage: string | undefined;
  bannerImage: string | undefined;
  address: string | undefined;
}

const UserProfileHeader: React.FC<IUserProfileHeaderProps> = (props: IUserProfileHeaderProps) => {
  const dispatch = useDispatch()
  // const { 
  //   userSocial
  // } = useSelector<IStoreState, IStoreState>((store) => store)

  const [iFollowProfile, setIFollowProfile] = useState(false)
  const isOwnProfile = props.address === getStoredUserAddress()

  // const updateLoadRefreshCounter = useCallback(() => {
  //   dispatch(updateUserSocialLoadRefreshCounter())
  // }, [dispatch])

  // const loadProfileSocial = useCallback((add: string) => {
  //   dispatch(getUserSocialFollowerCountRequest(add))
    
  //   if(!isOwnProfile)
  //     dispatch(getUserSocialMutualFollowStatusRequest(add))
  // }, [dispatch, isOwnProfile])
  
  // useEffect(() => {
  //   if(props.address){
  //     loadProfileSocial(props.address)
  //   }

  // }, [loadProfileSocial, props.address, userSocial.loadRefreshCounter])

  // useEffect(() => {
  //   if(userSocial.social?.mutualFollowStatus){
  //     const iFollow = userSocial.social?.mutualFollowStatus.some(fStatus => {
  //       if(fStatus.address === getStoredUserAddress() && fStatus.follows === props.address)
  //         return true
  //       else 
  //         return false
  //     })
  //     setIFollowProfile(iFollow)
  //   }
  // }, [props.address, userSocial.social?.mutualFollowStatus])
  
  // const toggleFollowProfile = async (choice: string) => {
  //   const response = await apiCall(
  //     `${process.env.REACT_APP_API_BASE_URL}/social/${choice}`,
  //     'POST',
  //     getStoredAccessToken().accesToken,
  //     {address: props.address},
  //     'json'      
  //   )

  //   if(response.status === 200){
  //     updateLoadRefreshCounter()
  //   }
  // }

  return (
    <>
      <div className='UserProfileHeader' style={{backgroundImage: `url(${props.bannerImage})`}}></div>

      <div className='UserProfileHeader-button-container'>
        <div className='UserProfileHeader-buttons'>
          {isOwnProfile ? (
            <Link to="/profile-settings" title='Profile Settings'>
              <button className='Button-standard'>Edit Profile</button>
            </Link>
          ) : (
            <>
              {/* <button className='Button-icon' title={iFollowProfile ? 'Unfollow' : 'Follow'} onClick={() => toggleFollowProfile(iFollowProfile ? 'unfollow' : 'follow')}><i className={`fa-solid fa-user-${iFollowProfile ? 'minus' : 'plus'} Colour-orange-bright`}></i></button>
              <Link to={`/dashboard?mod=Messages&messageTo=${props.address}`} title='Message'>
                <button className='Button-icon' style={{marginLeft: '1.2rem'}}>
                  <i className="fa-solid fa-envelope Colour-orange-bright"></i>
                </button>
              </Link>   */}
              {/* <button className='Button-icon' title='Invest' style={{marginLeft: '1.2rem'}}><i className="fa-solid fa-coins Colour-orange-bright"></i></button>
              <button className='Button-icon' title='Promote' style={{marginLeft: '1.2rem'}}><i className="fa-solid fa-rocket Colour-orange-bright"></i></button>
              <button className='Button-icon' title='Book' style={{marginLeft: '1.2rem'}}><i className="fa-solid fa-store Colour-orange-bright"></i></button>
              <button className='Button-icon' title='Report' style={{marginLeft: '1.2rem'}}><i className="fa-solid fa-flag Colour-orange-bright"></i></button>           */}
            </>
          )}
        </div>

      </div>
    </>
  )
}

export default UserProfileHeader