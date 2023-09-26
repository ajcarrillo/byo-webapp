import { APIError } from './api-types'

export interface ICommunityState {
  apiError: APIError | null,
  postsLoading: boolean,
  adminLoading: boolean,
  posts: PostItem[] | null,
  isAdmin: boolean,
}

export type PostItem = {
  address: string,
  title: string,
  description: string,
  keywords: string,
  body: string,
  images: PostImage[],
  status: 'public' | 'private',
}

export type PostImage = {
  address?: string,
  tag: string,
  url: string,
}
