/* Custom styles for the react-select component */

export const reactSelectCustomStyles = {
  container: (provided: any, state: any) => ({
    ...provided,
    outline: 'none'
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--byowave-inputfield-bg-colour'),
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
    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--byowave-cta-colour'),
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
    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--byowave-panel-bg-colour'),
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
    color: state.isDisabled ? 'rgb(80, 80, 80)' : getComputedStyle(document.documentElement).getPropertyValue('--byowave-panel-text-colour'),
    padding: '.5rem',
    '&:hover': {
      backgroundColor: state.isDisabled ? 'none' : getComputedStyle(document.documentElement).getPropertyValue('--byowave-panel-hover-bg-colour'),
    },
  }),
  placeholder: (provided: any, state: any) => ({
    ...provided,
    color: getComputedStyle(document.documentElement).getPropertyValue('--byowave-inputfield-placeholder-text-colour'),
    padding: '0.6rem 0.5rem',
  }),
  singleValue: (provided: any, state: any) => {
    const opacity = state.isDisabled ? 0.5 : 1
    // const transition = 'opacity 300ms';
    const color = getComputedStyle(document.documentElement).getPropertyValue('--byowave-inputfield-text-colour')
    const padding = '0.6rem 0.5rem'

    // return { ...provided, opacity, transition, color };
    return { ...provided, color, opacity, padding }
  }
}