import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { IStoreState } from '../../../types/store-types'
import { getCommunityPostsRequest } from '../../../store/community/community-actions'
import Spinner from '../../Spinner'
import AdminCommunityNewPost from './AdminCommunityNewPost'
import './AdminCommunityPosts.css'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IAdminCommunityPostsProps {}

const AdminCommunityPosts: React.FC<IAdminCommunityPostsProps> = (props: IAdminCommunityPostsProps) => {
  const dispatch = useDispatch()
  const { 
    community
  } = useSelector<IStoreState, IStoreState>((store) => store)

  const [postsWorkspace, setPostsWorkspace] = useState('new')

  /**
   * Checks for admin privileges
   */
  const getPosts = useCallback(() => {
    dispatch(getCommunityPostsRequest())
  }, [dispatch])
  
  useEffect(() => {
    if(!community.posts) getPosts()
  }, [community.posts, getPosts])
  
  return (
    <>
      {community.postsLoading && (
        <Spinner />
      )}

      <div className='Admin-posts-container'>
        {postsWorkspace === 'new' ? (
          <AdminCommunityNewPost />
        ) : (
          <></>
        )}
      </div>
    </>
  )
}

export default AdminCommunityPosts
