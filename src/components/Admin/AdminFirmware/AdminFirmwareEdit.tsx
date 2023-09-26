import React, { useCallback, useEffect, useState } from 'react'
import Select, { SingleValue } from 'react-select'

import { SelectType } from '../../../types/global-types'
import { FirmwareBinary } from '../../../types/media-types'
import { isEmpty, isPunctuatedText } from '../../../utils/validation-utils'
import { apiCall, uploadWithProgress } from '../../../utils/api-utils'
import { getStoredAccessToken, updateStoredAccessToken } from '../../../utils/user-utils'
import { useEffectOnlyOnce } from '../../../utils/hooks'
import { ReactSelectInput } from '../../CustomControls/SelectDropdown/ReactSelectInput'
import { reactSelectCustomStyles } from '../../CustomControls/SelectDropdown/custom-styles'
import AdminFirmwareForm from './AdminFirmwareForm'
import { FirmwareFile, ExistingFirmwareFile } from './AdminFirmware'
import { ClipboardButton } from '../../CustomControls'

const initialErrors = {
  version: '',
  changeLog: '',
  module: '',
  file: '',
}

interface IAdminFirmwareEditProps {
  changeLogLimit: number,
  maxFileSizeMB: number,
  moduleList: readonly SelectType[]
}

const AdminFirmwareEdit: React.FC<IAdminFirmwareEditProps> = (props: IAdminFirmwareEditProps) => {
  const { changeLogLimit, maxFileSizeMB, moduleList }  = props

  const [gettingFirmware, setGettingFirmware] = useState(false)
  const [firmwareList, setFirmwareList] = useState<SelectType[]>([])
  const [selectedFirmware, setSelectedFirmware] = useState<SelectType | null>(null)
  const [firmware, setFirmware] = useState<FirmwareBinary[]>([])

  const [errors, setErrors] = useState(initialErrors)
  const [apiLoading, setApiLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [saveComplete, setSaveComplete] = useState(false)

  const [firmwareAddress, setFirmwareAddress] = useState('')
  const [version, setVersion] = useState('')
  const [changeLog, setChangeLog] = useState('')
  const [module, setModule] = useState<SelectType | null>(null)
  const [firmwareFile, setFirmwareFile] = useState<FirmwareFile | null>(null)
  const [existingFirmwareFile, setExistingFirmwareFile] = useState<ExistingFirmwareFile | null>(null)

  const handleVersionChange = (value: string) => {
    setVersion(value)
  }

  const handleModuleChange = (value: SingleValue<SelectType>) => {
    setModule(value)
  }

  const handleChangeLogChange = (value: string) => {
    const lg = value.slice(0, changeLogLimit)
    setChangeLog(lg)
  }

  /**
   * Selects a binary file
   * @param identifier An identifier for the file
   * @param file The file object
   */
  const handleSelectFirmwareFile = (identifier: string | number, file: any) => {
    setFirmwareFile({
      index: 'file-0',
      name: file.name,
      upload: {progress: 0, response: null},
      file,
    })

    if(existingFirmwareFile) setExistingFirmwareFile(null)
  }

  const resetForm = () => {
    getFirmwareList()
    setSelectedFirmware({value: firmwareAddress, label: `${module?.label} : ${version}`})
  }

  const handleClickSave = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = {}

    if (isEmpty(version) || !isPunctuatedText(version))
      e.version = 'Please give this firmwre a version number.'

    if (isEmpty(changeLog) || !isPunctuatedText(changeLog))
      e.changeLog = 'Please give this firmwre a change log.'

    if(!module)
      e.module = 'Please select a firmwre module.'

    if(!existingFirmwareFile && !firmwareFile)
      e.file = 'Please select a Bin file.'

    if(firmwareFile){
      if(firmwareFile.file.size > 1024 * 1024 * maxFileSizeMB){
        e.file = `File ${firmwareFile.name} is too large - max size ${maxFileSizeMB}MB`
      }
    }

    if (Object.keys(e).length === 0) {
      setErrors(initialErrors)
      saveExistingFirmware()
    } else {
      setErrors(e)
    }
  }

  const saveExistingFirmware = async () => {
    setApiLoading(true)
    setApiError('')

    const token = getStoredAccessToken().accesToken

    const postData = new FormData()
    if(firmwareFile) postData.append('firmwareFile', firmwareFile?.file as File)
    postData.append('replaceFirmwareFile', firmwareFile ? 'true' : 'false')
    postData.append('address', firmwareAddress)
    postData.append('version', version)
    postData.append('changeLog', changeLog)
    postData.append('module', module?.value || '')
    const response = await uploadWithProgress(
      `${process.env.REACT_APP_API_BASE_URL}/admin/firmware/update`,
      token,
      postData
    )

    if(response.status === 200){
      resetForm()
      setSaveComplete(true)
      setApiLoading(false)
    }else{
      if(response.status === 401) {
        updateStoredAccessToken('', false)
        window.location.reload()
      } else {
        setApiLoading(false)
        switch(response.message){
        case'DUPLICATE_VERSION':
          setApiError('A module with that version already exists.')
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
   * Updates the selected document
   * @param value 
   */
  const handleFirmwareSelectionChange = (value: SingleValue<SelectType>) => {
    setSelectedFirmware(value)
  }

  /**
   * Populates the form with the selected document details
   */
  const editFirmware = useCallback((address: string) => {
    if(address !== firmwareAddress){
      const selected = firmware.find(d => d.firmwareAddress === address)
      setFirmwareAddress(selected?.firmwareAddress || '')
      setVersion(selected?.firmwareVersion || '')
      setChangeLog(selected?.firmwareChangeLog || '')
      setModule(moduleList.find(c => c.value === selected?.firmwareModule) || null)
      setExistingFirmwareFile({name: selected?.firmwareFileName || '', address: selected?.firmwareFileAddress || ''})
    }
  }, [moduleList, firmwareAddress, firmware])

  useEffect(() => {
    if(selectedFirmware) editFirmware(selectedFirmware.value)
  }, [editFirmware, selectedFirmware])

  /**
   * Fetches a list of firmware
   */
  const getFirmwareList = async () => {
    setGettingFirmware(true)
    const response = await apiCall(
      `${process.env.REACT_APP_API_BASE_URL}/media/firmware`,
      'GET',
      undefined,
      'json'
    )

    if(response.status === 200){
      setGettingFirmware(false)
      setFirmwareList(
        response.data.firmware.map((d: FirmwareBinary) => 
          ({value: d.firmwareAddress, label: `${moduleList.find(m => m.value === d.firmwareModule)?.label} : ${d.firmwareVersion}`}))
      )
      setFirmware(
        response.data.firmware.map((d: FirmwareBinary) => ({...d}))
      )
    }else if(response.status === 401){
      updateStoredAccessToken('', false)
      window.location.reload()
    }else{
      setGettingFirmware(false)
    }
  }

  useEffectOnlyOnce(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (dependencies) => {
      getFirmwareList()
    },
    [true],
    (dependencies) => dependencies[0] === true
  )

  return (
    <>
      <div className="PanelLabel" style={{border: '1px solid rgb(67,69,81)', marginBottom: '1rem'}}>
        <div style={{marginBottom: '.6rem'}}>Edit document</div>
        <Select 
          isDisabled={gettingFirmware}
          styles={reactSelectCustomStyles} 
          options={firmwareList} 
          value={selectedFirmware} 
          onChange={(opt) => handleFirmwareSelectionChange(opt)} 
          placeholder='Select a firmware to edit' 
          components={{ Input: ReactSelectInput }} 
        /> 
      </div>

      {firmwareAddress && (
        <>
          <div className="PanelLabel" style={{border: '1px solid rgb(67,69,81)', marginBottom: '1rem'}}>
            <div className='AdminFirmware-url-container'>

              <div style={{display: 'flex', alignItems: 'center'}}>
                <i className="fa-solid fa-face-grin-tongue-wink"></i>
                <div style={{marginLeft: '.8rem'}}>
                  <div>
                    <div style={{color: 'var(--byowave-heading-text-colour)'}}>You can create a hyperlink to this firmware using the following URL:</div>
                    <a href={`/downloads?document=${existingFirmwareFile?.address}`} rel="noreferrer" target='_blank'>{`/downloads?firmware=${existingFirmwareFile?.address}`}</a>
                  </div>
                </div>
              </div>

              <ClipboardButton
                key={Date.now()}
                copyText={`<a href='/downloads?firmware=${existingFirmwareFile?.address}' rel='noreferrer' target='_blank'>${existingFirmwareFile?.name}</a>`}
              />
            </div>
          </div>

          <AdminFirmwareForm 
            isNewDocument={false}
            errors={errors}
            apiLoading={apiLoading}
            apiError={apiError}
            saveComplete={saveComplete}
            moduleList={moduleList}
            version={version}
            changeLog={changeLog}
            changeLogLimit={changeLogLimit}    
            module={module} 
            firmwareFile={firmwareFile}
            existingFirmwareFile={existingFirmwareFile}
            handleVersionChange={handleVersionChange}
            handleChangeLogChange={handleChangeLogChange}
            handleModuleChange={handleModuleChange}
            handleSelectFirmwareFile={handleSelectFirmwareFile}
            handleClickSave={handleClickSave}
            setSaveComplete={setSaveComplete}
          />
        </>
      )}
    </>
  )
}

export default AdminFirmwareEdit