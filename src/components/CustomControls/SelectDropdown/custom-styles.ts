/* Custom styles for the react-select component */

export const reactSelectCustomStyles = {
  container: (provided: any, state: any) => ({
    ...provided,
    outline: 'none'
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: 'rgb(25,26,34)',
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
    backgroundColor: 'rgb(95,106,219)',
    cursor: 'pointer',
    borderRadius: '0 6px 6px 0',
    padding: '0 4px'
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
    backgroundColor: 'rgb(38,40,56)',
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
    color: state.isDisabled ? 'rgb(80, 80, 80)' : 'rgb(134, 139, 180)',
    padding: '.5rem',
    '&:hover': {
      backgroundColor: state.isDisabled ? 'none' : 'rgb(54, 56, 77)',
    },
  }),
  placeholder: (provided: any, state: any) => ({
    ...provided,
    color: 'rgb(63, 65, 82)',
    padding: '0.6rem 0.5rem',
  }),
  singleValue: (provided: any, state: any) => {
    const opacity = state.isDisabled ? 0.5 : 1
    // const transition = 'opacity 300ms';
    const color = 'rgb(134, 139, 180)'
    const padding = '0.6rem 0.5rem'

    // return { ...provided, opacity, transition, color };
    return { ...provided, color, opacity, padding }
  }
}