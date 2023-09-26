import React, { useState } from 'react'
import Select, { SingleValue } from 'react-select'

import { downloadFirmwareFile } from '../../../utils/download-utils'
import { updateStoredAccessToken } from '../../../utils/user-utils'
import { ExistingFirmwareFile, FirmwareFile } from './AdminFirmware'
import FileSelector from '../../FileSelector'
import { reactSelectCustomStyles } from '../../CustomControls/SelectDropdown/custom-styles'
import { SelectType } from '../../../types/global-types'
import { ReactSelectInput } from '../../CustomControls/SelectDropdown/ReactSelectInput'

interface IAdminFirmwareFormProps {
  isNewDocument: boolean,
  errors: any,
  apiLoading: boolean,
  apiError: string,
  saveComplete: boolean,
  moduleList: readonly SelectType[],
  version: string,
  changeLog: string,
  changeLogLimit: number,
  module: SingleValue<SelectType>,
  firmwareFile: FirmwareFile | null,
  existingFirmwareFile: ExistingFirmwareFile | null,
  handleVersionChange: (value: string) => void,
  handleChangeLogChange: (value: string) => void,
  handleModuleChange: (value: SingleValue<SelectType>) => void,
  handleSelectFirmwareFile: (identifier: string | number, file: any) => void,
  handleClickSave: () => void,
  setSaveComplete: React.Dispatch<React.SetStateAction<boolean>>
}

const AdminFirmwareForm: React.FC<IAdminFirmwareFormProps> = (props: IAdminFirmwareFormProps) => {
  const { 
    isNewDocument,
    errors, 
    apiLoading,
    apiError,
    saveComplete,
    moduleList,
    version,
    changeLog,
    changeLogLimit,
    module,
    firmwareFile,
    existingFirmwareFile,
    handleVersionChange,
    handleChangeLogChange,
    handleModuleChange,
    handleSelectFirmwareFile,
    handleClickSave,
    setSaveComplete
  } = props

  const fileSelectInput = React.useRef<HTMLInputElement>(null)

  const [downloading, setDownloading] = useState(false)

  const downloadFile = async (address: string) => {
    setDownloading(true)
    const response = await downloadFirmwareFile(address)
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
  
  return (
    <div style={{display: 'flex'}}>

      <div style={{width: '60%', paddingRight: '2rem'}}>
        <div className="PanelLabel" style={{marginBottom: '.4rem'}}>1. Version</div>

        <div style={{marginBottom: '1rem'}}>
          <input
            className="Textfield-dark" 
            type='text' 
            onChange={(e) => handleVersionChange(e.target.value)} 
            value={version}
            placeholder="Version number xx.xx.xx" 
            style={{ width: '100%' }}
            data-lpignore="true"
            autoComplete='off'
          />
          {errors.version && (
            <div className="Formfield-error-inline">{errors.version}</div>
          )}
        </div>

        <div style={{marginBottom: '1rem'}}>
          <textarea
            className={'Textfield-dark'}
            onChange={(e) => handleChangeLogChange(e.target.value)} 
            placeholder="Change log.." 
            style={{ width: '100%' }} 
            rows={6} 
            value={changeLog}
          ></textarea>
          {errors.changeLog && (
            <div className="Formfield-error-inline" style={{marginTop: '.2rem', marginBottom: '.2rem'}}>{errors.changeLog}</div>
          )}            
          <div style={{textAlign: 'right', fontSize: '.89rem', color: 'rgb(140,140,140)', marginBottom: '1rem'}}>{changeLogLimit - changeLog.length || 0}</div>
        </div>

        <div className="PanelLabel" style={{marginBottom: '.4rem'}}>2. Module</div>

        <div style={{marginBottom: '1rem'}}>
          <Select  
            styles={reactSelectCustomStyles} 
            options={moduleList} 
            value={module} 
            onChange={(opt) => handleModuleChange(opt)} 
            placeholder='Cube module..' 
            components={{ Input: ReactSelectInput }} 
            maxMenuHeight={200}
          />
          {errors.module && (
            <div className="Formfield-error-inline">{errors.module}</div>
          )}
        </div>
      </div>

      <div style={{width: '40%'}}>
        <div className="PanelLabel" style={{margin: '0 0 .4rem 0'}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div>3. Binary File</div>
            <button
              className="Button-small"
              onClick={() => fileSelectInput?.current?.click()}
            >
              {firmwareFile || existingFirmwareFile ? 'Reselect Bin File' : 'Select Bin File'}
            </button>
          </div>
        </div>
        {errors.file && (
          <div className="Formfield-error-inline" style={{marginTop: '.2rem', marginBottom: '.2rem'}}>{errors.file}</div>
        )}
        <FileSelector ref={fileSelectInput} accept='application/octet-stream' identifier={'-not-used-'} update={handleSelectFirmwareFile} />
        {firmwareFile && (
          <div className='AdminFirmware-new-file-container'>
            <div>{firmwareFile.name}</div>
          </div>
        )}
        {existingFirmwareFile && (
          <div className='AdminFirmware-new-file-container'>
            <div>
              {downloading ? (
                <div className='AdminFirmware-downloading-spinner'>
                  <i className="fa-solid fa-spinner"></i>
                </div>
              ) : (
                <button 
                  className="Button-icon-small" 
                  onClick={() => downloadFile(existingFirmwareFile.address)} 
                  title='Download this file'
                >
                  <i className="fa-solid fa-cloud-arrow-down"></i>
                </button>                      
              )}
            </div>
            <div>{existingFirmwareFile.name}</div>
          </div>
        )}

        <div style={{marginBottom: '1rem', marginTop: '1rem'}}>
          <button 
            disabled={apiLoading}
            className={apiLoading ? 'Button-standard-disabled' : 'Button-standard'} 
            onClick={() => handleClickSave()}
          >
            Save Firmware
          </button>
          {apiError && (
            <div className="Formfield-error-inline" style={{marginTop: '.6rem', marginBottom: '.2rem'}}>{apiError}</div>
          )} 
          <div 
            className={`AdminFirmware-save-panel ${saveComplete ? 'AlertShow' : 'AlertHide'}`} 
            onTransitionEnd={() => setSaveComplete(false)}
          >
            {isNewDocument ? 'New Firmware Created' : 'Firmware Updated'}
          </div>
        </div>
      </div>

    </div>
  )
}

export default AdminFirmwareForm