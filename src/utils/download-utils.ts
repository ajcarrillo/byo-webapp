import { apiDownload } from './api-utils'
import { getStoredAccessToken } from './user-utils'

/**
 * Downloads a product file
 * @param fileAddress The file address to download
 * @returns {Promise<any>} The API response
 */
const downloadProductFile = async (fileAddress: string): Promise<any> => {
  const token = getStoredAccessToken().accesToken
  const response = await apiDownload(
    `${process.env.REACT_APP_API_BASE_URL}/media/download/product/file/${fileAddress}`,
    'GET',
    token,
    undefined
  )

  return response
}

export {
  downloadProductFile
}
