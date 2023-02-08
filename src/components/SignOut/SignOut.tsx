import React, { useEffect } from 'react'

import { 
  updateStoredAccessToken, 
  updateStoredOnboardingSummary, 
  updateStoredUserAddress, 
  updateStoredUserEntitlements, 
  updateStoredUserProfileType,
  updateStoredUserLocalisation
} from '../../utils/user-utils'

interface ISignOutProps {
  redirectTo: string;
}

export const SignOut: React.FC<ISignOutProps> = (props: ISignOutProps) => {
  useEffect(() => {
    updateStoredAccessToken('', false)
    updateStoredUserAddress('')
    updateStoredUserEntitlements()
    updateStoredUserProfileType('')
    updateStoredOnboardingSummary('')
    updateStoredUserLocalisation('')
    window.location.href = props.redirectTo
  }, [props.redirectTo])

  return (
    <>
    </>
  )
}
