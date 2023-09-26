import React, { useEffect, useState } from 'react'

import './ClipboardButton.css'

interface IClipboardButtonProps {
    copyText: string | undefined;
  }

export const ClipboardButton: React.FC<IClipboardButtonProps> = (props: IClipboardButtonProps) =>{
  const { copyText } = props

  const [copied, setCopied] = useState(false)

  /**
   * Copies text to the clipboard
   * @param text Text to copy
   */
  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
  }

  return (
    <div className='ClipboardButton-container'>
      <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
        <button 
          className='Button-icon'
          onClick={() => copyToClipboard(copyText || '')} 
          title='Copy to clipboard'
        >
          <i className="fa-solid fa-clipboard"></i>
        </button>        

        <div 
          className={`ClipboardButton-confirm-container ${copied ? 'AlertShow' : 'AlertHide'}`} 
          style={{marginLeft: '.4rem'}}
          onTransitionEnd={() => setCopied(false)}
        >
          <i className="fa-solid fa-square-check" style={{fontSize: '1.9rem'}}></i>
        </div>
      </div>
    </div>
  )
}

export default ClipboardButton