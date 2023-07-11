import React, { useRef } from 'react'
import { Transition } from 'react-transition-group'

import { defaultTransitionStyle, transitionStyles, transitionDuration } from '../../transition-styles'
import { DownloadsContainer } from '../../../Downloads'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IDownloadsPageProps {
  tokenIsValid: boolean,
}

export const DownloadsPage: React.FC<IDownloadsPageProps> = (props: IDownloadsPageProps) => {
  const nodeRef = useRef<HTMLDivElement>(null)
  
  return (
    <Transition in appear timeout={transitionDuration} nodeRef={nodeRef}>
      {(transState) => (
        <div
          style={{
            ...defaultTransitionStyle,
            ...transitionStyles[transState],
          }}
          ref={nodeRef}
        >
          <DownloadsContainer />
        </div>
      )}
    </Transition>
  )
}