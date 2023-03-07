import React from 'react'

import './Checkbox.css'

// interface ICheckboxProps {
//   text: any;
//   onChange: Function;
//   selected: string;
//   value: string;
// };

// const Checkbox: React.FC<ICheckboxProps> = (props: ICheckboxProps) => {
//   const { selected, onChange, text, value } = props;
//   return (
//     <div className="Checkbox-container" onClick={() => onChange(selected ? '' : value)}>
//       <div className={`Checkbox-outer-square ${value !== selected && "Checkbox-unselected"}`}>
//         <div className={`Checkbox-inner-square ${value !== selected && "Checkbox-unselected-square"}`}/>
//       </div>
//       <div className="Checkbox-label">{text}</div>
//     </div>
//   );
// };

interface ICheckboxProps {
  text: any;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onChange: Function;
  selectedValue: string;
  unselectedValue: string;
  value: string;
}

const Checkbox: React.FC<ICheckboxProps> = (props: ICheckboxProps) => {
  const { selectedValue, unselectedValue, onChange, text, value } = props
  return (
    <div className="Checkbox-container" onClick={() => onChange(unselectedValue === value ? selectedValue : unselectedValue)}>
      <div className={`Checkbox-outer-square ${value !== selectedValue && 'Checkbox-unselected'}`}>
        <div className={`Checkbox-inner-square ${value !== selectedValue && 'Checkbox-unselected-square'}`}/>
      </div>
      <div className="Checkbox-label">{text}</div>
    </div>
  )
}

export default Checkbox