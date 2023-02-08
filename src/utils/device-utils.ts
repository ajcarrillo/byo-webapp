import { 
  isMobileOnly,
  isTablet,
  isDesktop,
  isSmartTV,
  isWearable,
  isConsole,
  osVersion,
  osName,
  browserName,
  browserVersion,
  mobileVendor,
  mobileModel
} from 'react-device-detect'

export const getMobileMake = () => {
  return mobileVendor
}

export const getMobileModel = () => {
  return mobileModel
}

export const getOS = () => {
  return osName
}

export const getOSVersion = () => {
  return osVersion
}

export const getBrowser = () => {
  return browserName
}

export const getBrowserVersion = () => {
  return browserVersion
}

export const getDeviceType = () => {
  let device = 'unknown'

  if(isMobileOnly)
    device = 'mobile'
  else if(isTablet)
    device = 'tablet'
  else if(isDesktop)
    device = 'desktop'
  else if(isSmartTV)
    device = 'smart-tv'
  else if(isWearable)
    device = 'wearable'
  else if(isConsole)
    device = 'console'

  return device
}

export const getLocale = () => {
  return navigator.languages && navigator.languages.length
    ? navigator.languages[0]
    : navigator.language
}
