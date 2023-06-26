import React, { useState, useEffect } from 'react'

import './ProgressBar.css'

interface IProgressBarProps {
  identifier: string;
  progress: number;
}

export const ProgressBar: React.FC<IProgressBarProps> = (props: IProgressBarProps) => {
  const {identifier, progress} = props

  const [progressPercent, setProgressPercent] = useState<number>(0)

  useEffect(() => {
    if(!progress) return

    setProgressPercent(progress)
  }, [progress])

  const updateProgress = (percent: number) => {
    let cellCount = 0
    const cellsOn: JSX.Element[] = [
      <span className='FileUploadProgressBar-cell-on' key={`uploadProgress-10-${identifier}`}></span>,
      <span className='FileUploadProgressBar-cell-on' key={`uploadProgress-20-${identifier}`}></span>,
      <span className='FileUploadProgressBar-cell-on' key={`uploadProgress-30-${identifier}`}></span>,
      <span className='FileUploadProgressBar-cell-on' key={`uploadProgress-40-${identifier}`}></span>,
      <span className='FileUploadProgressBar-cell-on' key={`uploadProgress-50-${identifier}`}></span>,
      <span className='FileUploadProgressBar-cell-on' key={`uploadProgress-60-${identifier}`}></span>,
      <span className='FileUploadProgressBar-cell-on' key={`uploadProgress-70-${identifier}`}></span>,
      <span className='FileUploadProgressBar-cell-on' key={`uploadProgress-80-${identifier}`}></span>,
      <span className='FileUploadProgressBar-cell-on' key={`uploadProgress-90-${identifier}`}></span>,
      <span className='FileUploadProgressBar-cell-on' key={`uploadProgress-100-${identifier}`}></span>
    ]

    const cellsOff: JSX.Element[] = [
      <span className='FileUploadProgressBar-cell-off' key={`uploadProgress-off-10-${identifier}`}></span>,
      <span className='FileUploadProgressBar-cell-off' key={`uploadProgress-off-20-${identifier}`}></span>,
      <span className='FileUploadProgressBar-cell-off' key={`uploadProgress-off-30-${identifier}`}></span>,
      <span className='FileUploadProgressBar-cell-off' key={`uploadProgress-off-40-${identifier}`}></span>,
      <span className='FileUploadProgressBar-cell-off' key={`uploadProgress-off-50-${identifier}`}></span>,
      <span className='FileUploadProgressBar-cell-off' key={`uploadProgress-off-60-${identifier}`}></span>,
      <span className='FileUploadProgressBar-cell-off' key={`uploadProgress-off-70-${identifier}`}></span>,
      <span className='FileUploadProgressBar-cell-off' key={`uploadProgress-off-80-${identifier}`}></span>,
      <span className='FileUploadProgressBar-cell-off' key={`uploadProgress-off-90-${identifier}`}></span>,
      <span className='FileUploadProgressBar-cell-off' key={`uploadProgress-off-100-${identifier}`}></span>
    ]

    if(percent >= 10 && percent < 20)
      cellCount = 1
    else if(percent >= 20 && percent < 30)
      cellCount = 2
    else if(percent >= 30 && percent < 40)
      cellCount = 3
    else if(percent >= 40 && percent < 50)
      cellCount = 4
    else if(percent >= 50 && percent < 60)
      cellCount = 5
    else if(percent >= 60 && percent < 70)
      cellCount = 6
    else if(percent >= 70 && percent < 80)
      cellCount = 7
    else if(percent >= 80 && percent < 90)
      cellCount = 8
    else if(percent >= 90 && percent < 100)
      cellCount = 9
    else if(percent >= 100)
      cellCount = 10

    const offCount = 10 - cellCount

    return [...cellsOn.splice(0, cellCount), ...cellsOff.splice(0, offCount)]
  }

  return (
    <div>
      <div className='FileUploadProgressBar-container'>
        <div className='FileUploadProgressBar-progress'>{updateProgress(progressPercent)}</div>
        <div className='FileUploadProgressBar-text'>{`${progressPercent}%`}</div> 
      </div>
    </div>
  )
}

