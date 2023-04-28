import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Observable } from 'rxjs'

import { appendGalleryItemRequest, getGalleryItemsRequest } from '../../../store/proteus/proteus-actions'
import { Controller } from '../../../types/controller-types'
import { uploadWithObservable } from '../../../utils/api-utils'
import { getStoredAccessToken, updateStoredAccessToken } from '../../../utils/user-utils'
import { isEmpty, isPunctuatedText } from '../../../utils/validation-utils'
import ScrollPanel from '../../ScrollPanel'
import ProteusGalleryItem from './ProteusGalleryItem'
import './ProteusGallery.css'

interface IProteusGalleryProps {
  workspace: string,
  takeScreenshot: (dataType?: string | undefined, quality?: number | undefined) => string | undefined,
  setNavigationDisabled: (disabled: boolean) => void,
  gallery: {personal: Controller[], community: Controller[]} | null,
  galleryLoading: boolean,
  controllerConfig: string,
  language: string
}

const ProteusGallery: React.FC<IProteusGalleryProps> = (props: IProteusGalleryProps) => {
  const dispatch = useDispatch()
  const [galleryVisible, setGalleryVisible] = useState(false)
  const [newControllerName, setNewControllerName] = useState('')
  const [gallerySaveErrors, setGallerySaveErrors] = useState<string[]>([])
  const [cameraClick, setCameraClick] = useState(false)
  const [savingController, setSavingController]  = useState(false)
  const [savingProgress, setSavingProgress]  = useState(0)
  const [selectedTab, setSelectedTab]  = useState('personal')

  /**
   * Handles the camera icon click
   */
  const handleClickCamera = () => {
    if(savingController) return

    setCameraClick((prev) => {
      if(!prev) resetSaveState()
      return !prev
    })
  }

  /**
   * Resets the save state
   */
  const resetSaveState = () => {
    setNewControllerName('')
    setGallerySaveErrors([])
    setSavingController(false)
    setSavingProgress(0)
  }

  /**
   * Converts a base64 image to a File object
   * @param dataUrl Image as base64
   * @param fileName 
   * @returns 
   */
  const dataUrlToFile = async (dataUrl: string, fileName: string): Promise<File> => {
    const res: Response = await fetch(dataUrl)
    const blob: Blob = await res.blob()
    return new File([blob], fileName, { type: 'image/png' })
  }

  /**
   * Posts a new gallery item to the microservice
   */
  const saveGalleryItem = async () => {
    const token = getStoredAccessToken().accesToken
    const screenshot = props.takeScreenshot('image/png', 1)
    if(!screenshot) return

    const img = await dataUrlToFile(screenshot, 'controller-image.png')

    const uploadObservable = new Observable((subscriber) => {
      setSavingController(true)
      const postData = new FormData()
      postData.append('controllerImage', img as File)
      postData.append('controllerName', newControllerName)
      postData.append('controllerConfig', props.controllerConfig)

      uploadWithObservable(
        `${process.env.REACT_APP_API_BASE_URL}/proteus/controller/create`,
        token,
        postData,
        'controller-upload',
        subscriber
      )
    })

    const subscription = uploadObservable.subscribe({
      next(x: any) { 
        if(x.status === 'progress'){
          setSavingProgress(x.progress)
        } 
        else if(x.status === 'response'){
          subscription.unsubscribe()
          resetSaveState()
          setCameraClick(false)
          dispatch(appendGalleryItemRequest(x.response.data))
        }
      },
      error(err) { 
        if(err.status === 401){
          updateStoredAccessToken('', false)
          window.location.reload()
        } 
        else if(err.status === 0){
          // no server response
          console.log(err)
        } 
        else {
          subscription.unsubscribe()
          console.log(err)      
        }

        resetSaveState()
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      complete() {}
    })
  }

  /**
   * Handles the save button click
   */
  const handleClickSave = () => {
    const e: string[] = []

    if (!isPunctuatedText(newControllerName) || isEmpty(newControllerName)){
      e.push('Please enter a controller name.')
    }

    if (e.length > 0) {
      setGallerySaveErrors(e)
    }else{
      saveGalleryItem()
    }
  }

  /**
   * Switches gallery tabs
   * @param tab 
   */
  const handleClickTab = (tab: string) => {
    if(selectedTab !== tab) setSelectedTab(tab)
  }

  /**
   * Shows the gallery
   */
  useEffect(() => {
    setGalleryVisible(props.workspace === 'gallery')

    return () => {
      if(props.workspace !== 'gallery') {
        resetSaveState()
        setCameraClick(false)
      }
    }
  }, [props.workspace])

  /**
   * Load the gallery if it is not in the store
   */
  const loadGallery = useCallback(() => {
    dispatch(getGalleryItemsRequest())
  }, [dispatch])

  useEffect(() => {
    if(!props.gallery && !props.galleryLoading && props.workspace === 'gallery') loadGallery()
  }, [loadGallery, props.gallery, props.galleryLoading, props.workspace])

  return (
    <>
      {props.workspace === 'gallery' ? (
        <>
          <div className={`Proteus-gallery-container ${galleryVisible ? 'open' : ''}`}>
            <div className='Proteus-gallery-header'>Controller Gallery</div>

            <div className='Proteus-gallery-tabs-container'>
              <div 
                className={`Proteus-gallery-tab${selectedTab === 'personal' ? '__selected' : ''}`} 
                style={{marginRight: '3px'}} 
                onClick={() => handleClickTab('personal')}
              >
                Personal
              </div>
              <div 
                className={`Proteus-gallery-tab${selectedTab === 'community' ? '__selected' : ''}`} 
                onClick={() => handleClickTab('community')}
              >
                Community
              </div>
            </div>

            <ScrollPanel 
              width={'100%'} 
              height={'calc(100% - 106px)'} 
              content={
                <div className='Proteus-gallery-inner-container'>
                  {selectedTab === 'personal' ? (
                    <>
                      {props.gallery?.personal.map((item) => (
                        <ProteusGalleryItem
                          key={item.controllerAddress}
                          image={item.image}
                          name={item.name}
                          profileName={item.userProfileName}
                          rating={item.rating}
                        />
                      ))}
                    </>
                  ) : (
                    <>
                      {props.gallery?.community.map((item) => (
                        <ProteusGalleryItem
                          key={item.controllerAddress}
                          image={item.image}
                          name={item.name}
                          profileName={item.userProfileName}
                          rating={item.rating}
                        />
                      ))}
                    </>
                  )}
                </div>
              }
            />
          </div>

          <div className={`Proteus-gallery-save-wrapper ${galleryVisible ? 'open' : ''}`}>
            <div className='Proteus-gallery-save-container'>
              <div className='Proteus-gallery-save-inner' style={{visibility: cameraClick ? 'visible' : 'hidden'}}>
                {savingController ? (
                  <div className='Proteus-gallery-save-progress-container'>
                    <div className='Proteus-gallery-save-progress-inner' style={{width: `${savingProgress}%`}}></div>
                  </div>
                ) : (
                  <>
                    <input
                      className="Proteus-gallery-save-textfield"
                      onChange={(e) => setNewControllerName(e.target.value)} 
                      value={newControllerName}
                      placeholder='Enter a controller name...'
                      type="text"
                    />
                    <button 
                      className='Proteus-gallery-save-button'
                      onClick={() => handleClickSave()}
                    >
                      Save
                    </button>
                  </>            
                )}
              </div>

              <button 
                className='Proteus-gallery-camera-button'
                onClick={() => handleClickCamera()}
              >
                <i className='fa-solid fa-camera'></i>
              </button>
            </div>

            <div className='Proteus-gallery-error-container' style={{visibility: gallerySaveErrors.length > 0 && cameraClick ? 'visible' : 'hidden'}}>
              <i className={'fa-solid fa-face-frown'} style={{fontSize: '1.5rem', marginRight: '.6rem'}}></i>
              <div>{gallerySaveErrors.map((e,i) => (
                <div key={i}>{e}</div>
              ))}</div>
            </div>
          </div>
        </>
      ) : (
        null
      )}
    </>
  )
}

export default ProteusGallery