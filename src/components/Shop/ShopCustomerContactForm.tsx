import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import Select, { SingleValue } from 'react-select'

import { UserContactExtended } from '../../types/user-types'
import { isEmpty, isPunctuatedText } from '../../utils/validation-utils'
import { reactSelectCustomStyles } from '../CustomControls/SelectDropdown/custom-styles'
import { ReactSelectInput } from '../CustomControls/SelectDropdown/ReactSelectInput'
import './Shop.css'
import { SelectType } from '../../types/global-types'

const initialErrors = {
  firstName: '',
  lastName: '',
  addressLine1: '',
  addressLine2: '',
  townCity: '',
  regionCounty: '',
  zipPostcode: '',
  countryCodeSelect: '',
  americaStateCodeSelect: '',
  telephone: '',
}

interface IShopCustomerContactFormProps {
  americanStates: readonly SelectType[],
  countries: readonly SelectType[],
  formName: string,
  formData: UserContactExtended | null,
  excludes?: string[],
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ShopCustomerContactForm = forwardRef<any, IShopCustomerContactFormProps>((props, ref) => {
  const { americanStates, countries, formName, formData, excludes } = props

  const [state, setState] = useState<UserContactExtended>({
    address: '',
    name: '',
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    townCity: '',
    regionCounty: '',
    zipPostcode: '',
    countryCode: '',
    countryCodeSelect: null,
    americaStateCodeSelect: null,
    telephone: '',
  })

  const [errors, setErrors] = useState(initialErrors)

  /**
   * Handles requests from the parent component
   */
  useImperativeHandle(ref, () => ({
    validateAndSubmit(): UserContactExtended | null {
      return validateForm()
    }
  }))

  /**
   * Validates the form fields
   * @returns The state or null if there are errors
   */
  const validateForm = (): UserContactExtended | null => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = {}

    if (!excludes?.includes('firstName')){
      if (isEmpty(state.firstName || '') || !isPunctuatedText(state.firstName || ''))
        e.firstName = 'Please enter your first name.'      
    }

    if (!excludes?.includes('lastName')){
      if (isEmpty(state.lastName || '') || !isPunctuatedText(state.lastName || ''))
        e.lastName = 'Please enter your last name.'
    }

    if (isEmpty(state.addressLine1 || '') || !isPunctuatedText(state.addressLine1 || ''))
      e.addressLine1 = 'Please enter the first line of your address.'

    if (isEmpty(state.townCity || '') || !isPunctuatedText(state.townCity || ''))
      e.townCity = 'Please enter your town / city.'

    if(state.countryCodeSelect && state.countryCodeSelect.value !== 'USA'){
      if (isEmpty(state.regionCounty || '') || !isPunctuatedText(state.regionCounty || ''))
        e.regionCounty = 'Please enter your region / county.'
    }

    if(state.countryCodeSelect && state.countryCodeSelect.value === 'USA'){
      if (!state.americaStateCodeSelect)
        e.americaStateCodeSelect = 'Please select your state.'
    }

    if (isEmpty(state.zipPostcode || '') || !isPunctuatedText(state.zipPostcode || ''))
      e.zipPostcode = 'Please enter your zip / postcode.'

    if (!excludes?.includes('telephone')){
      if (isEmpty(state.telephone || ''))
        e.telephone = 'Please enter your telephone number.'
    }

    if (!state.countryCodeSelect)
      e.countryCodeSelect = 'Please select your country.'

    if (Object.keys(e).length === 0) {
      setErrors(initialErrors)
      return {
        ...state, 
        countryCode: state.countryCodeSelect?.value,
        ...(state.countryCodeSelect?.value === 'USA' && {regionCounty: state.americaStateCodeSelect?.label})
      }
    } else {
      setErrors(e)
      return null
    }
  }
  
  /**
   * Handles input field changes
   * @param param
   * @param value 
   */
  const handleInputChange = (param: string, value: string) => {
    setState((prev) => ({
      ...prev,
      [param]: value,
    }))
  }

  /**
   * Handles select field changes
   * @param param
   * @param value 
   */
  const handleSelectChange = (param: string, value: SingleValue<SelectType>) => {
    setState((prev) => ({
      ...prev,
      [param]: value,
    }))
  }

  /**
   * Pre-populates the form if data is available
   */
  useEffect(() => {
    if(formData){
      setState((prev) => ({
        ...prev,
        ...formData, 
        countryCodeSelect: countries.find(c => c.value === formData.countryCode) || null,
        ...(formData.countryCode === 'USA' && {americaStateCodeSelect: americanStates.find(s => s.label === formData.regionCounty) || null})
      }))
    }
  }, [americanStates, countries, formData])

  return (
    <>
      <h3 style={{marginBottom: '1rem'}}>{formName}</h3>

      {!excludes?.includes('firstName') && (<div style={{marginBottom: '1rem'}}>
        <input
          className="Textfield-dark" 
          type='text' 
          onChange={(e) => handleInputChange('firstName', e.target.value)} 
          value={state.firstName}
          placeholder="First name" 
          style={{ width: '100%' }}
          data-lpignore="true"
          autoComplete='off'
        />
        {errors.firstName && (
          <div className="Formfield-error-inline">{errors.firstName}</div>
        )}
      </div>)}

      {!excludes?.includes('lastName') && (<div style={{marginBottom: '1rem'}}>
        <input
          className="Textfield-dark" 
          type='text' 
          onChange={(e) => handleInputChange('lastName', e.target.value)} 
          value={state.lastName}
          placeholder="Last name" 
          style={{ width: '100%' }}
          data-lpignore="true"
          autoComplete='off'
        />
        {errors.lastName && (
          <div className="Formfield-error-inline">{errors.lastName}</div>
        )}
      </div>)}

      <div style={{marginBottom: '1rem'}}>
        <Select  
          styles={reactSelectCustomStyles} 
          options={countries} 
          value={state.countryCodeSelect} 
          onChange={(opt) => handleSelectChange('countryCodeSelect', opt)} 
          placeholder='Country' 
          components={{ Input: ReactSelectInput }} 
          maxMenuHeight={200}
        />
        {errors.countryCodeSelect && (
          <div className="Formfield-error-inline">{errors.countryCodeSelect}</div>
        )}
      </div>

      <div style={{marginBottom: '1rem'}}>
        {state.countryCodeSelect?.value === 'USA' && (
          <>
            <Select  
              styles={reactSelectCustomStyles} 
              options={americanStates} 
              value={state.americaStateCodeSelect} 
              onChange={(opt) => handleSelectChange('americaStateCodeSelect', opt)} 
              placeholder='State' 
              components={{ Input: ReactSelectInput }} 
              maxMenuHeight={200}
            />
            {errors.americaStateCodeSelect && (
              <div className="Formfield-error-inline">{errors.americaStateCodeSelect}</div>
            )}
          </>
        )}
      </div>

      <div style={{marginBottom: '1rem'}}>
        <input
          className="Textfield-dark" 
          type='text' 
          onChange={(e) => handleInputChange('addressLine1', e.target.value)} 
          value={state.addressLine1}
          placeholder="Address line 1" 
          style={{ width: '100%' }}
          data-lpignore="true"
          autoComplete='off'
        />
        {errors.addressLine1 && (
          <div className="Formfield-error-inline">{errors.addressLine1}</div>
        )}
      </div>

      <div style={{marginBottom: '1rem'}}>
        <input
          className="Textfield-dark" 
          type='text' 
          onChange={(e) => handleInputChange('addressLine2', e.target.value)} 
          value={state.addressLine2}
          placeholder="Address line 2" 
          style={{ width: '100%' }}
          data-lpignore="true"
          autoComplete='off'
        />
        {errors.addressLine2 && (
          <div className="Formfield-error-inline">{errors.addressLine2}</div>
        )}
      </div>

      <div style={{marginBottom: '1rem'}}>
        <input
          className="Textfield-dark" 
          type='text' 
          onChange={(e) => handleInputChange('townCity', e.target.value)} 
          value={state.townCity}
          placeholder="Town / City" 
          style={{ width: '100%' }}
          data-lpignore="true"
          autoComplete='off'
        />
        {errors.townCity && (
          <div className="Formfield-error-inline">{errors.townCity}</div>
        )}
      </div>
      
      <div style={{marginBottom: '1rem'}}>
        {state.countryCodeSelect?.value !== 'USA' && (
          <>
            <input
              className="Textfield-dark" 
              type='text' 
              onChange={(e) => handleInputChange('regionCounty', e.target.value)} 
              value={state.regionCounty}
              placeholder="Region / County" 
              style={{ width: '100%' }}
              data-lpignore="true"
              autoComplete='off'
            />
            {errors.regionCounty && (
              <div className="Formfield-error-inline">{errors.regionCounty}</div>
            )}
          </>
        )}
      </div>

      <div style={{marginBottom: '1rem'}}>
        <input
          className="Textfield-dark" 
          type='text' 
          onChange={(e) => handleInputChange('zipPostcode', e.target.value)} 
          value={state.zipPostcode}
          placeholder="Zip / Postcode" 
          style={{ width: '100%' }}
          data-lpignore="true"
          autoComplete='off'
        />
        {errors.zipPostcode && (
          <div className="Formfield-error-inline">{errors.zipPostcode}</div>
        )}
      </div>

      {!excludes?.includes('telephone') && (<div style={{marginBottom: '1rem'}}>
        <input
          className="Textfield-dark" 
          type='tel'
          onChange={(e) => handleInputChange('telephone', e.target.value)} 
          value={state.telephone}
          placeholder="Telephone number" 
          style={{ width: '100%' }}
          data-lpignore="true"
          autoComplete='off'
        />
        {errors.telephone && (
          <div className="Formfield-error-inline">{errors.telephone}</div>
        )}
      </div>)}
    </>
  )
})

ShopCustomerContactForm.displayName = 'ShopCustomerContactForm'

export default ShopCustomerContactForm