import React, { useEffect, useState } from 'react'

import './ProteusHints.css'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProteusHintsProps {
  showHints: boolean,
  workspace: string,
}

const ProteusHints: React.FC<IProteusHintsProps> = (props: IProteusHintsProps) => {
  const [hintVisible, setHintVisible] = useState(true)

  const handleClickDismissHint = () => {
    setHintVisible(false)
  }

  useEffect(() => {
    setHintVisible(true)
  }, [props.workspace])

  return (
    <>
      {props.showHints ? (
        <div className={`Proteus-hint-container ${hintVisible ? 'open' : ''}`}>
          <div><i className='fa-solid fa-circle-info'></i></div>
          <div>Title</div>
          <div>Body </div>
          <button onClick={() => handleClickDismissHint()}>Dismiss</button>
        </div>      
      ) : (
        null
      )}
    </>
  )
}

export default ProteusHints