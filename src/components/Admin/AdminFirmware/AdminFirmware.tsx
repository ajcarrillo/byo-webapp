import React, { useState } from 'react'

import AdminFirmwareNew from './AdminFirmwareNew'
import AdminFirmwareEdit from './AdminFirmwareEdit'
import { SelectType } from '../../../types/global-types'
import './AdminFirmware.css'

export type FirmwareFileUpload = {
  progress: number,
  response: any,
}

export type FirmwareFile = {
  index: string,
  name: string,
  upload: FirmwareFileUpload,
  file: File,
}

export type ExistingFirmwareFile = {
  name: string,
  address: string,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IAdminFirmwareProps {}

const AdminFirmware: React.FC<IAdminFirmwareProps> = (props: IAdminFirmwareProps) => {
  const [workspace, setWorkspace] = useState('newFirmware')

  const CHANGE_LOG_LIMIT = 512
  const FILE_MAX_SIZE_MB = 1

  const cubeModuleList: readonly SelectType[] = [
    {value: 'combined', label: 'Combined'},
    {value: 'charger', label: 'Charger Cube'},
    {value: 'mother', label: 'Mother Cube'},
  ]

  return (
    <div className='Admin-documents-container'>
      <div className='Admin-menu-container'>
        <div 
          title='New Firmware'
          className={`Admin-menu-link${workspace === 'newFirmware' ? '__active' : ''}`}
          onClick={() => setWorkspace('newFirmware')}
        >
          New Firmware
        </div>
        <i className='fa-solid fa-minus'></i>
        <div 
          title='Edit Firmware'
          className={`Admin-menu-link${workspace === 'editFirmware' ? '__active' : ''}`}
          onClick={() => setWorkspace('editFirmware')}
        >
          Edit Firmware
        </div>
      </div>

      <div className='Admin-workspace-container'>
        {workspace === 'newFirmware' && (
          <AdminFirmwareNew 
            changeLogLimit={CHANGE_LOG_LIMIT}
            maxFileSizeMB={FILE_MAX_SIZE_MB}
            moduleList={cubeModuleList}
          />
        )}

        {workspace === 'editFirmware' && (
          <AdminFirmwareEdit 
            changeLogLimit={CHANGE_LOG_LIMIT}
            maxFileSizeMB={FILE_MAX_SIZE_MB}
            moduleList={cubeModuleList}
          />
        )}
      </div>
    </div>
  )
}

export default AdminFirmware
