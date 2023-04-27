import { ProteusSettings } from '../types/proteus-types'

/**
 * Transforms an array of modules from the database
 * @param input A object of settings from the database
 * @returns An object of type ProteusSettings
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformApplicationSettingsFromDB = (input: {[key:string]: any}): ProteusSettings => {
  const output: ProteusSettings = {
    firmwareVersion: input.firmwareVersion,
    displayHints: input.showHints === 1 ? true : false,
    antialiasing: input.antiAliasing === 1 ? true : false,
    sixteenBit: input.sixteenBit === 1 ? true : false,
    gpuHighPerformance: input.gpuHighPerformance === 1 ? true : false,
    multipass: input.multipass === 1 ? true : false,
    depthTesting: input.depthTesting === 1 ? true : false,
  }
  return output
}

/**
 * Inserts the correct version number into the url string
 * @param url 
 * @param version 
 * @returns 
 */
const transformProteusWebGLFileVersion = (url: string, version: string) => {
  return process.env.REACT_APP_CDN_PROTEUS_RESOURCES + url.replace('####', version)
}

export {
  transformApplicationSettingsFromDB,
  transformProteusWebGLFileVersion
}