import { APIError, APIResponse } from '../types/api-types'

export const generateApiError = (scope: string, response: APIResponse | undefined, apiMessages?: any): APIError => {
  const { message, status } = response || { message: 'Error', status: 500 }

  return {
    status,
    scope,
    message: apiMessages ? apiMessages[message] : message,
    code: 'API_ERROR'
  }
}

export const generateControllerConnectionError = (error: string, errMessages: any): string => 
  errMessages[error] || 'Error'
