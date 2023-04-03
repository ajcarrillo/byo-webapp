import React from 'react'
import {components} from 'react-select'

export const ReactSelectInput = (props: any) => {
  const { autoComplete = props.autoComplete } = props.selectProps
  return <components.Input {...props} data-lpignore="true" autoComplete={autoComplete} />
}
