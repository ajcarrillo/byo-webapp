import axios from 'axios'
import { Subscriber } from 'rxjs'

import { APIResponse, ContentHeaders } from '../types/api-types'
import { filesUploadProgress } from './events'

const jsonContentHeaders: ContentHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}

const multipartContentHeaders: ContentHeaders = {
  'Accept': 'application/json'
}

export const apiCall = async (
  url: string,
  verb: string,
  token?: string | null,
  body?: any,
  contentType?: string,
  abortController?: any
): Promise<APIResponse> => {
  const resp = await fetch(url, {
    ...(abortController && {signal: abortController.signal}),
    method: verb,
    headers: {
      ...(contentType === 'json' && jsonContentHeaders),
      ...(contentType === 'multipart' && multipartContentHeaders),
      ...(token && {'Authorization': `Bearer ${token}`}),
    },
    ...(body && contentType === 'json' && {body: JSON.stringify(body)}),
    ...(body && contentType === 'multipart' && {body: body}),
  })

  return await resp.json()
}

export const apiDownload = async (
  url: string,
  verb: string,
  token?: string | null,
  body?: any,
  abortController?: any
): Promise<any> => {
  const resp = await fetch(url, {
    ...(abortController && {signal: abortController.signal}),
    method: verb,
    headers: {
      ...(token && {'Authorization': `Bearer ${token}`}),
    },
    ...(body && {body: JSON.stringify(body)}),
  })

  const header = resp.headers.get('Content-Disposition')
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const parts = header!.split(';')
  const filename = parts[1].split('=')[1]
  const data = await resp.blob()
  return {status: resp.status, filename, data}
}

export const apiCallWithObservable = async (
  url: string,
  verb: string,
  token: string | null,
  contentType: string,
  identifier: string,
  sub: Subscriber<any>,
  body?: any,
  abortController?: any
): Promise<APIResponse> => {

  sub.next({id: identifier, status: 'loading'})

  const resp = await fetch(url, {
    ...(abortController && {signal: abortController.signal}),
    method: verb,
    headers: {
      ...(contentType === 'json' && jsonContentHeaders),
      ...(contentType === 'multipart' && multipartContentHeaders),
      ...(token && {'Authorization': `Bearer ${token}`}),
    },
    ...(body && contentType === 'json' && {body: JSON.stringify(body)}),
    ...(body && contentType === 'multipart' && {body: body}),
  })
  const jsonResponse = await resp.json()

  if(jsonResponse.status === 200)
    sub.next({id: identifier, status: 'response', response: jsonResponse})
  else
    sub.error({id: identifier, status: 'response', response: jsonResponse})

  return jsonResponse
}

export const uploadWithProgress = async (
  url: string,
  token: string | null,
  body: any
): Promise<APIResponse> => {
  try {
    const resp = await axios.post(url, body, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token && {'Authorization': `Bearer ${token}`}),
      },
      onUploadProgress: (progressEvent) => {
        const working = progressEvent.loaded !== progressEvent.total
        filesUploadProgress.next({isUploading: working, progress: Math.round(100 * (progressEvent.loaded / progressEvent.total))})
      }
    })

    const { status, data, statusText } = resp
    return {status, data, message: statusText}
  } catch(e: any) {
    const { status, data, statusText } = e.response
    return {status, data, message: data.message}
  }
}

export const uploadWithObservable = async (
  url: string,
  token: string | null,
  body: any,
  fileIdentifier: string,
  sub: Subscriber<any> 
): Promise<APIResponse> => {
  try {
    const resp = await axios.post(url, body, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token && {'Authorization': `Bearer ${token}`}),
      },
      onUploadProgress: (progressEvent) => {
        sub.next({id: fileIdentifier, status: 'progress', progress: Math.round(100 * (progressEvent.loaded / progressEvent.total))})
      }
    })

    sub.next({id: fileIdentifier, status: 'response', response: resp.data})

    const { status, data, statusText } = resp
    return {status, data, message: statusText}
  } 
  catch(err: any) {
    if(err.response){
      const { status, data } = err.response
      sub.error({status, data, message: data.message})
      return {status, data, message: data.message}    
    } else {
      // No response from server - server down, or no internet
      sub.error({status: 0, data: null, message: 'The server is not responding. Please check your Internet connection and try again.'})
      return {status: 0, data: null, message: 'The server is not responding. Please check your Internet connection and try again.'}
    }
  }
}

export const streamWithObservable = async (
  url: string,
  token: string | null,
  fileIdentifier: string,
  sub: Subscriber<any> 
): Promise<APIResponse> => {
  try {
    const resp = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'audio/mpeg',
        ...(token && {'Authorization': `Bearer ${token}`}),
      },
      onDownloadProgress: (progressEvent) => {
        sub.next({id: fileIdentifier, status: 'progress', progress: Math.round(100 * (progressEvent.loaded / progressEvent.total))})
      }
    })

    sub.next({id: fileIdentifier, status: 'response', response: resp.data})

    const { status, data, statusText } = resp
    return {status, data, message: statusText}
  } 
  catch(err: any) {
    if(err.response){
      const { status, data } = err.response
      sub.error({status, data, message: data.message})
      return {status, data, message: data.message}    
    } else {
      // No response from server - server down, or no internet
      sub.error({status: 0, data: null, message: 'The server is not responding. Please check your Internet connection and try again.'})
      return {status: 0, data: null, message: 'The server is not responding. Please check your Internet connection and try again.'}
    }
  }
}