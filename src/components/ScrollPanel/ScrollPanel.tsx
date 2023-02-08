/* eslint-disable react/display-name */
import React, { useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'

import './ScrollPanel.css'

interface IScrollPanelProps {
  content: any;
  width: string;
  height: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  callback?: Function
}

export const ScrollPanel = React.forwardRef<Scrollbars, IScrollPanelProps>((props, ref) => {
  const [top, setTop] = useState(0)

  const renderView: React.FunctionComponent<any> | undefined = ({ style, ...props }) => {
    const viewStyle = {
      paddingRight: '18px',
    }

    return (
      <div
        style={{ ...style, ...viewStyle }}
        {...props}
      />
    )
  }

  const renderTrackVertical: React.FunctionComponent<any> | undefined = ({ style, props }) => {
    const viewStyle = {
      position: 'absolute',
      width: '12px',
      right: '2px',
      bottom: '2px',
      top: '2px',
      borderRadius: '3px',
      backgroundColor: 'rgb(33,33,33)',
    }

    return (
      <div
        style={{ ...style, ...viewStyle }}
        {...props}
      />
    )
  }

  const renderTrackHorizontal: React.FunctionComponent<any> | undefined = ({ style, props }) => {
    const viewStyle = {
      height: '0px',
    }

    return (
      <div
        style={{ ...style, ...viewStyle }}
        {...props}
      />
    )
  }

  const renderThumb: React.FunctionComponent<any> | undefined = ({ style, ...props }) => {
    const viewStyle = {
      width: '6px',
      marginLeft: '3px',
      backgroundColor: 'rgb(128,92,36)',
      borderRadius: '3px'
    }

    return (
      <div
        style={{ ...style, ...viewStyle }}
        {...props}
      />
    )
  }

  const handleUpdate = (values: any) => {
    const { top } = values
    setTop(top)
  }

  const handleScrollStop = () => {
    if(props.callback){
      if(top === 0) {
        props.callback('SCROLL_STOP_TOP')
      } else if(top === 1) {
        props.callback('SCROLL_STOP_BOTTOM')
      }      
    }
  }

  return (
    <Scrollbars 
      ref={ref} 
      style={{ width: props.width, height: props.height }} 
      // autoHide 
      // autoHideTimeout={1000} 
      // autoHideDuration={200} 
      renderView={renderView} 
      renderTrackHorizontal={renderTrackHorizontal} 
      renderTrackVertical={renderTrackVertical} 
      renderThumbHorizontal={renderThumb} 
      renderThumbVertical={renderThumb} 
      onUpdate={handleUpdate} 
      onScrollStop={handleScrollStop}
    >
      {props.content}
    </Scrollbars>
  )
})
