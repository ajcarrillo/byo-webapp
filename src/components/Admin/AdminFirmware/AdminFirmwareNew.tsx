import React, { useState } from 'react'

import { isEmpty, isPunctuatedText } from '../../../utils/validation-utils'
import { getStoredAccessToken, updateStoredAccessToken } from '../../../utils/user-utils'
import { uploadWithProgress } from '../../../utils/api-utils'
import AdminFirmwareForm from './AdminFirmwareForm'
import { FirmwareFile } from './AdminFirmware'
import { SelectType } from '../../../types/global-types'
import { SingleValue } from 'react-select'

const initialErrors = {
  name: '',
  description: '',
  category: '',
  file: '',
}

interface IAdminFirmwareNewProps {
  changeLogLimit: number,
  maxFileSizeMB: number,
  moduleList: readonly SelectType[]
}

const AdminFirmwareNew: React.FC<IAdminFirmwareNewProps> = (props: IAdminFirmwareNewProps) => {
  const { changeLogLimit, maxFileSizeMB, moduleList }  = props
  
  const [errors, setErrors] = useState(initialErrors)
  const [apiLoading, setApiLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [saveComplete, setSaveComplete] = useState(false)
  const [version, setVersion] = useState('')
  const [changeLog, setChangeLog] = useState('')
  const [module, setModule] = useState<SelectType | null>(null)
  const [firmwareFile, setFirmwareFile] = useState<FirmwareFile | null>(null)

  const handleVersionChange = (value: string) => {
    setVersion(value)
  }

  const handleModuleChange = (value: SingleValue<SelectType>) => {
    setModule(value)
  }

  const handleChangeLogChange = (value: string) => {
    const cLog = value.slice(0, changeLogLimit)
    setChangeLog(cLog)
  }

  /**
   * Selects a firmware file
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
  }

  const resetForm = () => {
    setVersion('')
    setChangeLog('')
    setModule(null)
    setFirmwareFile(null)
  }

  const handleClickSave = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = {}

    if (isEmpty(version) || !isPunctuatedText(version))
      e.version = 'Please give this firmware a version.'

    if (isEmpty(changeLog) || !isPunctuatedText(changeLog))
      e.changeLog = 'Please enter a change log.'

    if(!module)
      e.module = 'Please select a cube module.'

    if(!firmwareFile)
      e.file = 'Please select a Bin file.'

    if(firmwareFile){
      if(firmwareFile.file.size > 1024 * 1024 * maxFileSizeMB){
        e.file = `File ${firmwareFile.name} is too large - max size ${maxFileSizeMB}MB`
      }
    }

    if (Object.keys(e).length === 0) {
      setErrors(initialErrors)
      saveNewDocument()
    } else {
      setErrors(e)
    }
  }

  const saveNewDocument = async () => {
    setApiLoading(true)
    setApiError('')

    const token = getStoredAccessToken().accesToken

    const postData = new FormData()
    postData.append('firmwareFile', firmwareFile?.file as File)
    postData.append('version', version)
    postData.append('changeLog', changeLog)
    postData.append('module', module?.value || '')
    const response = await uploadWithProgress(
      `${process.env.REACT_APP_API_BASE_URL}/admin/firmware/new`,
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

  return (
    <AdminFirmwareForm 
      isNewDocument={true}
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
      existingFirmwareFile={null}
      handleVersionChange={handleVersionChange}
      handleChangeLogChange={handleChangeLogChange}
      handleModuleChange={handleModuleChange}
      handleSelectFirmwareFile={handleSelectFirmwareFile}
      handleClickSave={handleClickSave}
      setSaveComplete={setSaveComplete}
    />
  )
}

export default AdminFirmwareNew