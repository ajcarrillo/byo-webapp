import React from 'react'

import './RadioButton.css'

interface IRadioButtonProps {
  text: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onChange: Function;
  selected: string;
  value: string;
}

const RadioButton: React.FC<IRadioButtonProps> = (props: IRadioButtonProps) => {
  const { selected, onChange, text, value } = props
  return (
    <div className="RadioButton-container" onClick={() => onChange(value)}>
      <div className={`RadioButton-outer-circle ${value !== selected && 'RadioButton-unselected'}`}>
        <div className={`RadioButton-inner-circle ${value !== selected && 'RadioButton-unselected-circle'}`}/>
      </div>
      {text && <div className="RadioButton-label">{text}</div>}
    </div>
  )
}

export default RadioButton