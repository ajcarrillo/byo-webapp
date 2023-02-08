export const updateStoredAccessToken = (token: string, valid: boolean) => {
  if(valid){
    window.localStorage.setItem('auth.accessToken', token)
    window.localStorage.setItem('auth.accessTokenValid', valid.toString())
  } else {
    window.localStorage.removeItem('auth.accessToken')
    window.localStorage.removeItem('auth.accessTokenValid')
  }
}
  
export const getStoredAccessToken = () => {
  if(window.localStorage.getItem('auth.accessToken') === null){
    return {
      accesToken: '',
      accessTokenValid: false
    }
  } else {
    if(window.localStorage.getItem('auth.accessTokenValid') === 'true'){
      return {
        accesToken: window.localStorage.getItem('auth.accessToken'),
        accessTokenValid: true
      }
    } else {
      return {
        accesToken: window.localStorage.getItem('auth.accessToken'),
        accessTokenValid: false
      }
    }
  }
}

export const isAccessTokenValid = (accessTokenValid: boolean, storedToken: any) => {
  if(accessTokenValid)
    return true
  else if(storedToken.accessTokenValid)
    return true
  else
    return false
}

export const updateStoredUserAddress = (address: string) => {
  if(address)
    window.localStorage.setItem('auth.userAddress', address)
  else
    window.localStorage.removeItem('auth.userAddress')
}
  
export const getStoredUserAddress = () => {
  if(window.localStorage.getItem('auth.userAddress') === null){
    return ''
  } else {
    return  window.localStorage.getItem('auth.userAddress')
  }
}

export const updateStoredUserEntitlements = (ents?: any[]) => {
  if(ents)
    window.localStorage.setItem('auth.userEntitlements', btoa(JSON.stringify(ents)))
  else
    window.localStorage.removeItem('auth.userEntitlements')
}
  
export const getStoredUserEntitlements = () => {
  if(window.localStorage.getItem('auth.userEntitlements') === null){
    return []
  } else {
    const ents = window.localStorage.getItem('auth.userEntitlements') || ''
    return JSON.parse(atob(ents))
  }
}

export const updateStoredUserProfileType = (pType: string) => {
  if(pType)
    window.localStorage.setItem('auth.userProfileType', pType)
  else
    window.localStorage.removeItem('auth.userProfileType')
}
  
export const getStoredUserProfileType = () => {
  if(window.localStorage.getItem('auth.userProfileType') === null){
    return ''
  } else {
    return  window.localStorage.getItem('auth.userProfileType')
  }
}

export const updateStoredOnboardingSummary = (summary: any) => {
  if(summary)
    window.localStorage.setItem('auth.onboardingSummary', btoa(JSON.stringify(summary)))
  else
    window.localStorage.removeItem('auth.onboardingSummary')
}
  
export const getStoredOnboardingSummary = () => {
  if(window.localStorage.getItem('auth.onboardingSummary') === null){
    return {}
  } else {
    const summary = window.localStorage.getItem('auth.onboardingSummary') || ''
    return JSON.parse(atob(summary))
  }
}

export const updateStoredUserLocalisation = (locs: any) => {
  if(locs)
    window.localStorage.setItem('auth.localisation', JSON.stringify(locs))
  else
    window.localStorage.removeItem('auth.localisation')
}
  
export const getStoredUserLocalisation = () => {
  if(window.localStorage.getItem('auth.localisation') === null){
    return {}
  } else {
    const locs = window.localStorage.getItem('auth.localisation') || ''
    return JSON.parse(locs)
  }
}

export const updateStoredUserName = (name: any) => {
  if(name)
    window.localStorage.setItem('auth.userName', btoa(JSON.stringify(name)))
  else
    window.localStorage.removeItem('auth.userName')
}
  
export const getStoredUserName = () => {
  if(window.localStorage.getItem('auth.userName') === null){
    return {}
  } else {
    const name = window.localStorage.getItem('auth.userName') || ''
    return JSON.parse(atob(name))
  }
}
