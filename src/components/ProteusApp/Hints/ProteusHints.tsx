import React, { useEffect, useState } from 'react'
import parse from 'html-react-parser'

import { getProteusLocalisedText } from '../../../localisation/proteus.locale'
import './ProteusHints.css'

interface IProteusHintsProps {
  showHints: boolean,
  workspace: string,
  language: string
}

type HintContent = {title: string, body: string}

const ProteusHints: React.FC<IProteusHintsProps> = (props: IProteusHintsProps) => {
  const [hintVisible, setHintVisible] = useState(true)
  const [hintContent, setHintContent] = useState<HintContent>({title:'',body:''})

  const handleClickDismissHint = () => {
    setHintVisible(false)
  }

  useEffect(() => {
    setHintVisible(true)
    setHintContent({
      title: getProteusLocalisedText(`hints.title.${props.workspace}.${props.language}`),
      body: getProteusLocalisedText(`hints.body.${props.workspace}.${props.language}`),
    })
  }, [props.language, props.workspace])

  return (
    <>
      {props.showHints ? (
        <div className={`Proteus-hint-container ${hintVisible ? 'open' : ''}`}>
          <div className='Proteus-hint-icon'><i className='fa-solid fa-circle-info'></i></div>
          <div className='Proteus-hint-title'>{hintContent.title || ''}</div>
          <div className='Proteus-hint-body'>{parse(hintContent.body || '')}</div>
          <button className='Proteus-hint-button' onClick={() => handleClickDismissHint()}>Dismiss</button>
        </div>      
      ) : (
        null
      )}
    </>
  )
}

export default ProteusHints