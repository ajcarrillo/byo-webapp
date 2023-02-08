import React, { useRef } from 'react'
import { Transition } from 'react-transition-group'

import { defaultTransitionStyle, transitionStyles, transitionDuration } from '../../transition-styles'
import { ProteusAppContainer } from '../../../ProteusApp'

interface IProteusAppPageProps {
  headerConfig: any;
}

export const ProteusAppPage: React.FC<IProteusAppPageProps> = (props: IProteusAppPageProps) => {
  const nodeRef = useRef<HTMLDivElement>(null)

  const { device } = props.headerConfig

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
          <ProteusAppContainer device={device} />
        </div>
      )}
    </Transition>
  )
}