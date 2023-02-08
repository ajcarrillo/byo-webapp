/* Custom styles for the react-select component */

export const reactSelectCustomStyles = {
  container: (provided: any, state: any) => ({
    ...provided,
    outline: 'none'
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: 'rgb(33,33,33)',
    border: 'none', 
    outline: 0,
    minHeight: '10px',
    boxShadow: 'none',
  }),
  input: (provided: any, state: any) => ({
    ...provided,
    outline: 0,
  }),
  valueContainer: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: 'none',
    padding: '0 3px',
  }),
  indicatorsContainer: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: 'rgb(128,92,36)',
    cursor: 'pointer',
    borderRadius: '4px',
    padding: 0,
  }),
  indicatorSeparator: (provided: any, state: any) => ({
    ...provided,
    background: 'none',
    width: '0px',
  }),
  dropdownIndicator: (provided: any, state: any) => ({
    ...provided,
    padding: '0px',
  }),
  clearIndicator: (provided: any, state: any) => ({
    ...provided,
    padding: '2px',
    backgroundColor: 'rgb(118,87,44)',
  }),
  // the option container
  menu: (provided: any, state: any) => ({
    ...provided,
    width: '100%',
    backgroundColor: 'rgb(33,33,33)',
    padding: 5,
  }),
  multiValue: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: 'rgb(118,87,44)',
  }),
  multiValueLabel: (provided: any, state: any) => ({
    ...provided,
    color: 'rgb(184, 184, 184)',
  }),
  multiValueRemove: (provided: any, state: any) => ({
    ...provided,
    cursor: 'pointer',
    color: 'rgb(184, 184, 184)',
    '&:hover': {
      backgroundColor: 'rgb(128,92,36)',
      color: 'rgb(140, 140, 140)',
    },
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    cursor: state.isDisabled ? 'default' : 'pointer',
    backgroundColor: 'none',
    borderBottom: '1px dotted rgb(50,50,50)',
    color: state.isDisabled ? 'rgb(80, 80, 80)' : 'rgb(184, 184, 184)',
    padding: '.5rem',
    '&:hover': {
      backgroundColor: state.isDisabled ? 'none' : 'rgb(50, 50, 50)',
    },
  }),
  placeholder: (provided: any, state: any) => ({
    ...provided,
    color: 'rgb(82, 82, 82)',
    padding: '0.5rem',
  }),
  singleValue: (provided: any, state: any) => {
    const opacity = state.isDisabled ? 0.5 : 1
    // const transition = 'opacity 300ms';
    const color = 'rgb(184, 184, 184)'
    const padding = '0.5rem'

    // return { ...provided, opacity, transition, color };
    return { ...provided, color, opacity, padding }
  }
}