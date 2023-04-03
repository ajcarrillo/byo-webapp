import React from 'react'

import './RadioButton.css'

interface IRadioButtonProps {
  size: string;
  text: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onChange: Function;
  selected: string;
  value: string;
}

const RadioButton: React.FC<IRadioButtonProps> = (props: IRadioButtonProps) => {
  const { selected, onChange, size, text, value } = props
  return (
    <div className={`RadioButton-container__${size}`} onClick={() => onChange(value)}>
      <div className={`RadioButton-outer-circle__${size} ${value !== selected && 'RadioButton-unselected__'+size}`}>
        <div className={`RadioButton-inner-circle__${size} ${value !== selected && 'RadioButton-unselected-circle__'+size}`}/>
      </div>
      {text && <div className={`RadioButton-label__${size}`}>{text}</div>}
    </div>
  )
}

export default RadioButton