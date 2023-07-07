import React, { useCallback, useEffect, useState } from 'react'
import Select, { SingleValue } from 'react-select'

import { SelectType } from '../../../types/global-types'
import { apiCall, uploadWithProgress } from '../../../utils/api-utils'
import { getStoredAccessToken, updateStoredAccessToken } from '../../../utils/user-utils'
import { useEffectOnlyOnce } from '../../../utils/hooks'
import { reactSelectCustomStyles } from '../../CustomControls/SelectDropdown/custom-styles'
import { ReactSelectInput } from '../../CustomControls/SelectDropdown/ReactSelectInput'
import { isEmpty, isPunctuatedText } from '../../../utils/validation-utils'
import AdminGroupForm from './AdminGroupForm'

type GroupItem = {
  groupName: string,
  groupAddress: string,
  groupDescription: string,
  groupImage: string,
}

const initialErrors = {
  name: '',
  description: '',
  image: '',
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IAdminShopProductsEditGroupProps {}

const AdminShopProductsEditGroup: React.FC<IAdminShopProductsEditGroupProps> = (props: IAdminShopProductsEditGroupProps) => {
  const [gettingGroups, setGettingGroups] = useState(false)
  const [groupList, setGroupList] = useState<SelectType[]>([])
  const [selectedGroup, setSelectedGroup] = useState<SelectType | null>(null)
  const [groups, setGroups] = useState<GroupItem[]>([])

  const [errors, setErrors] = useState(initialErrors)
  const [apiLoading, setApiLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [saveComplete, setSaveComplete] = useState(false)

  const [replaceGroupImage, setReplaceGroupImage] = useState(false)
  const [groupAddress, setGroupAddress] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [coverImageSize, setCoverImageSize] = useState('')
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)

  const DESCRIPTION_LIMIT = 256
  const IMAGE_MAX_SIZE = 1000

  const handleNameChange = (value: string) => {
    setName(value)
  }

  const handleDescriptionChange = (value: string) => {
    const desc = value.slice(0, DESCRIPTION_LIMIT)
    setDescription(desc)
  }

  const handleClickSave = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = {}

    if (isEmpty(name) || !isPunctuatedText(name))
      e.name = 'Please give this group a valid name.'

    if (isEmpty(description) || !isPunctuatedText(description))
      e.description = 'Please give this group a valid description.'

    if(replaceGroupImage){
      const imageIsCorrectSize = coverImageSize.split(',')[0] === coverImageSize.split(',')[1] && parseInt(coverImageSize.split(',')[0]) <= IMAGE_MAX_SIZE
      
      if (!imageIsCorrectSize)
        e.image = `Please ensure your image is square, and no larger than ${IMAGE_MAX_SIZE}px.`
        
      if (!coverImage)
        e.image = 'Please supply an image.'
    }

    if (Object.keys(e).length === 0) {
      setErrors(initialErrors)
      saveGroup()
    } else {
      setErrors(e)
    }
  }

  const updateImage = (type: string, url: string): void => {
    setCoverImage(url)
    setReplaceGroupImage(true)
    const img = new Image()
    img.onload = () => setCoverImageSize(img.width+','+img.height)
    img.src = url
  }

  const uploadImage = (type: string, image: File): void => {
    setCoverImageFile(image)
  }

  const resetAfterSave = () => {
    getGroupList()
    setSelectedGroup({value: groupAddress, label: name})
  }

  const saveGroup = async () => {
    setApiLoading(true)
    setApiError('')

    const token = getStoredAccessToken().accesToken

    const postData = new FormData()
    if(replaceGroupImage) postData.append('shopGroupImage', coverImageFile as File)
    postData.append('replaceGroupImage', String(replaceGroupImage))
    postData.append('address', groupAddress)
    postData.append('name', name)
    postData.append('description', description)
    const response = await uploadWithProgress(
      `${process.env.REACT_APP_API_BASE_URL}/admin/shop/group/update`,
      token,
      postData
    )

    if(response.status === 200){
      resetAfterSave()
      setSaveComplete(true)
      setApiLoading(false)
    }else{
      if(response.status === 401) {
        updateStoredAccessToken('', false)
        window.location.reload()
      } else {
        setApiLoading(false)
        switch(response.message){
        case'DUPLICATE_NAME':
          setApiError('A group with that name already exists.')
          break
        case'ERROR':
          setApiError('There was an error - please try again.')
          break
        default:
          setApiError('There was an error - please try again.')
          break
        }
      }
    }
  }

  /**
   * Updates the selected group
   * @param value 
   */
  const handleGroupSelectionChange = (value: SingleValue<SelectType>) => {
    setSelectedGroup(value)
  }

  /**
   * Populates the form with the selected group details
   */
  const editGroup = useCallback((address: string) => {
    if(address !== groupAddress){
      const selected = groups.find(g => g.groupAddress === address)
      setGroupAddress(selected?.groupAddress || '')
      setName(selected?.groupName || '')
      setDescription(selected?.groupDescription || '')
      setCoverImage(selected?.groupImage || '')
      setReplaceGroupImage(false)
    }
  }, [groupAddress, groups])

  useEffect(() => {
    if(selectedGroup) editGroup(selectedGroup.value)
  }, [editGroup, selectedGroup])

  /**
   * Fetches a list of groups
   */
  const getGroupList = async () => {
    setGettingGroups(true)
    const response = await apiCall(
      `${process.env.REACT_APP_API_BASE_URL}/shop/groups`,
      'GET',
      undefined,
      'json'
    )

    if(response.status === 200){
      setGettingGroups(false)
      setGroupList(
        response.data.groups.map((g: GroupItem) => ({value: g.groupAddress, label: g.groupName}))
      )
      setGroups(
        response.data.groups.map((g: GroupItem) => ({...g}))
      )
    }else if(response.status === 401){
      updateStoredAccessToken('', false)
      window.location.reload()
    }else{
      setGettingGroups(false)
    }
  }

  useEffectOnlyOnce(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (dependencies) => {
      getGroupList()
    },
    [true],
    (dependencies) => dependencies[0] === true
  )

  return (
    <>
      <div className="PanelLabel" style={{border: '1px solid rgb(67,69,81)', marginBottom: '1rem'}}>
        <div style={{marginBottom: '.6rem'}}>Edit group</div>
        <Select 
          isDisabled={gettingGroups}
          styles={reactSelectCustomStyles} 
          options={groupList} 
          value={selectedGroup} 
          onChange={(opt) => handleGroupSelectionChange(opt)} 
          placeholder='Select a group to edit' 
          components={{ Input: ReactSelectInput }} 
        /> 
      </div>

      {groupAddress && (
        <AdminGroupForm 
          isNewGroup={false}
          errors={errors}
          apiLoading={apiLoading}
          apiError={apiError}
          saveComplete={saveComplete}
          coverImage={coverImage}
          name={name}
          description={description}
          descriptionLimit={DESCRIPTION_LIMIT}      
          updateImage={updateImage}
          uploadImage={uploadImage}
          handleNameChange={handleNameChange}
          handleDescriptionChange={handleDescriptionChange}
          handleClickSave={handleClickSave}
          setSaveComplete={setSaveComplete}
        />
      )}
    </>
  )
}

export default AdminShopProductsEditGroup
