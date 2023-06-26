import React, { useState, useEffect } from 'react'

interface IFileSelectorProps {
  identifier: string | number;
  accept: string;
  update: (identifier: string | number, file: File) => void
}

export const FileSelector = React.forwardRef<HTMLInputElement, IFileSelectorProps>((props, ref) => {
  const {identifier, accept, update} = props

  const [file, setFile] = useState<any>(undefined)

  useEffect(() => {
    if(!file) return

    update(identifier, file)
    setFile(undefined)
  }, [file, identifier, update])

  const onFileSelect = (e: any) => {
    setFile(e.target.files.item(0))
    e.target.value = ''
  }

  return (
    <div>
      <input 
        ref={ref} 
        type='file' 
        accept={accept} 
        defaultValue={file} 
        onChange={(e) => onFileSelect(e)} 
        style={{display: 'none'}} 
      />
    </div>
  )
})

FileSelector.displayName = 'FileSelector'