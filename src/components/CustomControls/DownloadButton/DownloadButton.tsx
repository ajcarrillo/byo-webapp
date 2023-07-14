import React, { useState } from 'react'

import { apiCall } from '../../../utils/api-utils'
import { updateStoredAccessToken } from '../../../utils/user-utils'
import { useEffectOnlyOnce } from '../../../utils/hooks'
import { downloadFreeProductFile } from '../../../utils/download-utils'
import './DownloadButton.css'

interface IDownloadButtonProps {
    productAddress: string | undefined;
  }

export const DownloadButton: React.FC<IDownloadButtonProps> = (props: IDownloadButtonProps) =>{
  const { productAddress } = props

  const [gettingAddress, setGettingAddress] = useState(false)
  const [fileAddress, setFileAddress] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)

  /**
   * Downloads a product file
   * @param address The file address
   */
  const downloadFile = async (address: string) => {
    if(downloading) return

    setDownloading(true)
    const response = await downloadFreeProductFile(address)
    if(response.status === 200){
      const fileURL = URL.createObjectURL(response.data)
      const anchor = document.createElement('a')
      anchor.href = fileURL
      anchor.download = response.filename
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
      URL.revokeObjectURL(fileURL)
      setDownloading(false)
    }else if(response.status === 401){
      updateStoredAccessToken('', false)
      window.location.reload()
    }else{
      setDownloading(false)
    }
  }
  
  /**
   * Fetches the file address
   */
  const getFileAddress = async () => {
    if(!productAddress) return

    setGettingAddress(true)
    const response = await apiCall(
      `${process.env.REACT_APP_API_BASE_URL}/shop/product/free/${productAddress}/file`,
      'GET',
      undefined,
      'json'
    )

    if(response.status === 200){
      setGettingAddress(false)
      setFileAddress(response.data.fileAddress)
    }else if(response.status === 401){
      updateStoredAccessToken('', false)
      window.location.reload()
    }else{
      setGettingAddress(false)
    }
  }
  
  useEffectOnlyOnce(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (dependencies) => {
      getFileAddress()
    },
    [true],
    (dependencies) => dependencies[0] === true
  )

  return (
    <>
      <button 
        disabled={gettingAddress || !fileAddress}
        className={gettingAddress || !fileAddress ? 'Button-standard-disabled' : 'Button-standard'}
        onClick={() => downloadFile(fileAddress || '')} 
        title='Download this file'
      >
        {downloading ? (
          <div><div className='DownloadButton-downloading-spinner'><i className="fa-solid fa-spinner"></i></div> Downloading</div>
        ) : (
          <div><i className="fa-solid fa-cloud-arrow-down"></i> Download</div>
        )}
      </button>
    </>
  )
}

export default DownloadButton