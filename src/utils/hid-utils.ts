import { 
  ProteusHidConfigDataPage, 
  ProteusHidConfigDataPageModule, 
  ProteusHidConfigHeader 
} from '../types/proteus-types'

/**
 * Sends a HID output report
 * @param device The HID device interface
 * @param reportId The report ID
 * @param reportType Report type number
 * @param reportSubtype Report subtype number
 * @param reportPayload Report data
 */
const sendHidOutputReport = (
  device: HIDDevice | undefined, 
  reportId: number, 
  reportType: number, 
  reportSubtype: number,
  reportPayload: number[]
) => {
  if (!device) return
  try {
    const decimalArray: number[] = [
      reportId,
      reportType,
      reportSubtype,
    ].concat(reportPayload)
    const hexArr = padHidOutputReport(decimalArray)

    const data = parseHexArray(hexArr.join(' '))
    if(data){
      const reportId = data.getUint8(0)
      const reportData = new Uint8Array(data.buffer).slice(1)
      console.log('SENDING HID OUTPUT REPORT:', hexArr.join(' '))
      device.sendReport(reportId, reportData)
    }else{
      throw new Error('REPORT_DATA_ERROR')
    }
  } catch(e) {
    console.log(e)
  }
}

/**
 * Converts decimal array to hex string array, and pads array to 64 byte length
 * @param decimalArray Array of decimal numbers
 * @returns 
 */
const padHidOutputReport = (decimalArray: number[]) => {
  const bytesToPad = 64 - decimalArray.length
  for(let d = 0; d < bytesToPad; d++){
    decimalArray.push(0)
  }
  const hexArr: string[] = []
  for(let h = 0; h < decimalArray.length; h++){
    hexArr.push(decimalArray[h].toString(16).padStart(2, '0'))
  }
  return hexArr
}

/**
 * Resolves the config header input report
 * @param data The input report data view
 * @returns The config header input report
 */
const resolveHidInputReportConfigHeader = (data: DataView) => {
  const configHeader: ProteusHidConfigHeader = {
    firmwareVersionMajor: data.getUint8(2).toString(),
    firmwareVersionMinor: data.getUint8(3).toString(),
    firmwareVersionPatch: data.getUint8(4).toString(),
    ledRValue: data.getUint8(5).toString(),
    ledGValue: data.getUint8(6).toString(),
    ledBValue: data.getUint8(7).toString(),
    ledBrightness: data.getUint8(8).toString(),
    configPageLength: data.getUint8(9),
  }
  return configHeader
}

/**
 * Resolves a config data page input report
 * @param data The input report data view
 * @returns The config data page input report
 */
const resolveHidInputReportConfigDataPage = (data: DataView) => {
  // console.log('DTA PAGE -----------------------------')
  // for(let x = 0; x < data.byteLength; x++){
  //   console.log(`Index ${x}`, data.getUint8(x))
  // }
  const MODULE_PARAM_COUNT = 11
  const modules: ProteusHidConfigDataPageModule[] = []
  
  let moduleParamInd = 1
  let moduleParams: number[] = []
  for(let d = 3; d < data.byteLength; d++){
    moduleParams.push(data.getUint8(d))
    moduleParamInd++

    if(moduleParamInd > MODULE_PARAM_COUNT){
      moduleParamInd = 1

      modules.push({
        moduleId: moduleParams[0],
        moduleType: moduleParams[1],
        moduleRotation: moduleParams[2],
        connectsToModuleId: moduleParams[3],
        connectsToModuleFaceId: moduleParams[4],
        buttonMapping01: moduleParams[5],
        buttonMapping02: moduleParams[6],
        buttonMapping03: moduleParams[7],
        buttonMapping04: moduleParams[8],
        buttonMapping05: moduleParams[9],
        buttonMapping06: moduleParams[10],
      })
      moduleParams = []
    }
  }

  const configDataPage: ProteusHidConfigDataPage = {
    pageId: data.getUint8(2),
    //modules: testData(data.getUint8(2)),
    modules,
  }

  return configDataPage
}

const testData = (pageNum: number) => {
  const motherMaster = {
    moduleId: 0, 
    moduleType: 0, //motherMaster
    moduleRotation: 0, // 0 degress
    connectsToModuleId: 255, // null value
    connectsToModuleFaceId: 255, // null value
    buttonMapping01: 255, // null value
    buttonMapping02: 255, // null value
    buttonMapping03: 255, // null value
    buttonMapping04: 255, // null value
    buttonMapping05: 255, // null value
    buttonMapping06: 255, // null value
  }
  const lAnalog = {
    moduleId: 1,
    moduleType: 6,
    moduleRotation: 8,
    connectsToModuleId: 0,
    connectsToModuleFaceId: 2,
    buttonMapping01: 0, // left analog stick
    buttonMapping02: 1, // left analog stick button
    buttonMapping03: 0, // north direction
    buttonMapping04: 0, // X inverted
    buttonMapping05: 0, // Y inverted
    buttonMapping06: 255, // null value
  }
  const rAnalog = {
    moduleId: 2,
    moduleType: 5,
    moduleRotation: 8,
    connectsToModuleId: 0,
    connectsToModuleFaceId: 3,
    buttonMapping01: 2, // right analog stick
    buttonMapping02: 3, // right analog stick button
    buttonMapping03: 0, // north direction
    buttonMapping04: 0, // X inverted
    buttonMapping05: 0, // Y inverted
    buttonMapping06: 255, // null value
  }
  const fourButton = {
    moduleId: 3,
    moduleType: 8,
    moduleRotation: 8,
    connectsToModuleId: 0,
    connectsToModuleFaceId: 0,
    buttonMapping01: 13, // Y
    buttonMapping02: 14, // B
    buttonMapping03: 15, // A
    buttonMapping04: 16, // X
    buttonMapping05: 255, // null value
    buttonMapping06: 255, // null value
  }
  const triggerLeft = {
    moduleId: 4,
    moduleType: 12,
    moduleRotation: 12,
    connectsToModuleId: 1,
    connectsToModuleFaceId: 2,
    buttonMapping01: 5, // left trigger
    buttonMapping02: 255, // null value
    buttonMapping03: 255, // null value
    buttonMapping04: 255, // null value
    buttonMapping05: 255, // null value
    buttonMapping06: 255, // null value
  }
  const triggerRight = {
    moduleId: 5,
    moduleType: 11,
    moduleRotation: 4,
    connectsToModuleId: 2,
    connectsToModuleFaceId: 3,
    buttonMapping01: 6, // right trigger
    buttonMapping02: 255, // null value
    buttonMapping03: 255, // null value
    buttonMapping04: 255, // null value
    buttonMapping05: 255, // null value
    buttonMapping06: 255, // null value
  }
  const edge = {
    moduleId: 6,
    moduleType: 3,
    moduleRotation: 0,
    connectsToModuleId: 1,
    connectsToModuleFaceId: 3,
    buttonMapping01: 255, // null value
    buttonMapping02: 255, // null value
    buttonMapping03: 255, // null value
    buttonMapping04: 255, // null value
    buttonMapping05: 255, // null value
    buttonMapping06: 255, // null value
  }
  const dPad = {
    moduleId: 7,
    moduleType: 7,
    moduleRotation: 4,
    connectsToModuleId: 6,
    connectsToModuleFaceId: 1,
    buttonMapping01: 9, // Up
    buttonMapping02: 10, // Right
    buttonMapping03: 11, // Down
    buttonMapping04: 12, // Left
    buttonMapping05: 255, // null value
    buttonMapping06: 255, // null value
  }
  const xBox = {
    moduleId: 8,
    moduleType: 8,
    moduleRotation: 0,
    connectsToModuleId: 0,
    connectsToModuleFaceId: 1,
    buttonMapping01: 255, // null value
    buttonMapping02: 255, // null value
    buttonMapping03: 255, // null value
    buttonMapping04: 255, // null value
    buttonMapping05: 255, // null value
    buttonMapping06: 255, // null value
  }
  const twoButton = {
    moduleId: 9,
    moduleType: 9,
    moduleRotation: 0,
    connectsToModuleId: 6,
    connectsToModuleFaceId: 1,
    buttonMapping01: 18, // Two Button 1
    buttonMapping02: 19, // Two Button 2
    buttonMapping03: 255, // null value
    buttonMapping04: 255, // null value
    buttonMapping05: 255, // null value
    buttonMapping06: 255, // null value
  }
  const joystick = {
    moduleId: 10,
    moduleType: 14,
    moduleRotation: 0,
    connectsToModuleId: 2,
    connectsToModuleFaceId: 5,
    buttonMapping01: 4, // Joystick
    buttonMapping02: 255, // null value
    buttonMapping03: 255, // null value
    buttonMapping04: 255, // null value
    buttonMapping05: 255, // null value
    buttonMapping06: 255, // null value
  }
  const spacer = {
    moduleId: 11,
    moduleType: 2,
    moduleRotation: 0,
    connectsToModuleId: 0,
    connectsToModuleFaceId: 5,
    buttonMapping01: 255, // null value
    buttonMapping02: 255, // null value
    buttonMapping03: 255, // null value
    buttonMapping04: 255, // null value
    buttonMapping05: 255, // null value
    buttonMapping06: 255, // null value
  }
  const charger = {
    moduleId: 12,
    moduleType: 4,
    moduleRotation: 0,
    connectsToModuleId: 11,
    connectsToModuleFaceId: 5,
    buttonMapping01: 255, // null value
    buttonMapping02: 255, // null value
    buttonMapping03: 255, // null value
    buttonMapping04: 255, // null value
    buttonMapping05: 255, // null value
    buttonMapping06: 255, // null value
  }
  const oneButton = {
    moduleId: 13,
    moduleType: 10,
    moduleRotation: 0,
    connectsToModuleId: 2,
    connectsToModuleFaceId: 2,
    buttonMapping01: 17, // One Button
    buttonMapping02: 255, // null value
    buttonMapping03: 255, // null value
    buttonMapping04: 255, // null value
    buttonMapping05: 255, // null value
    buttonMapping06: 255, // null value
  }

  if(pageNum === 0)
    return [motherMaster, lAnalog, rAnalog, fourButton, triggerLeft]
  else if(pageNum === 1)
    return [triggerRight, edge, dPad, xBox, twoButton]
  else if(pageNum === 2)
    return [joystick, spacer, charger, oneButton]
  else
    return []
}

/**
 * Returns the button/control name from the input report
 * @param data The input report data view
 * @returns String or undefined
 */
const resolveInputReport = (data: DataView) => {
  const stickLeftX = detectAnalogMovement(data.getUint8(1))
  const stickLeftY = detectAnalogMovement(data.getUint8(3))
  const stickRightX = detectAnalogMovement(data.getUint8(5))
  const stickRightY = detectAnalogMovement(data.getUint8(7))
  const triggersA = data.getUint8(8)
  const triggersB = data.getUint8(9)  
  const digitalButtons = data.getUint8(10)
  const analogButtons = data.getUint8(11)

  if (digitalButtons !== 0) return resolveHIDButton(digitalButtons)
  if (analogButtons !== 0) return resolveHIDAnalogButton(analogButtons)
  if (triggersA === 128 && triggersB > 128) return 'leftTrigger'
  if (triggersA === 128 && triggersB < 128) return 'rightTrigger'
  if (stickLeftX || stickLeftY) return 'leftAnalog'
  if (stickRightX || stickRightY) return 'rightAnalog'

  return undefined
}

/**
 * Returns the name of the button from the HID input report
 * @param buttonNumber The button number
 * @returns The string value of the button name
 */
const resolveHIDButton = (buttonNumber: number) => {
  switch(buttonNumber){
  case 1:
    return 'a'
  case 2:
    return 'b'
  case 4:
    return 'x'
  case 8:
    return 'y'
  case 16:
    return 'leftButton'
  case 32:
    return 'rightButton'
  case 64:
    return 'select'
  case 128:
    return 'start'
  default:
    return undefined
  }
}

/**
 * Returns the name of the button from the HID input report
 * @param buttonNumber The button number
 * @returns The string value of the button name
 */
const resolveHIDAnalogButton = (buttonNumber: number) => {
  switch(buttonNumber){
  case 1:
    return 'leftAnalogPress'
  case 2:
    return 'rightAnalogPress'
  case 4:
    return 'dPadUp'
  case 12:
    return 'dPadRight'
  case 20:
    return 'dPadDown'
  case 28:
    return 'dPadLeft'
  default:
    return undefined
  }
}

/**
 * Detects a stick/trigger movement, given a resting value of 128 +- a deadzone
 * @param input Input from the stick/trigger
 * @param deadzone A deadzone in case a stick/trigger is not trimmed correctly
 * @returns True/False
 */
const detectAnalogMovement = (input: number, deadzone = 20) => {
  return (input < (128 - deadzone)) || (input > (128 + deadzone))
}

const parseHexArray = (hexString: string) => {
  // Remove non-hex characters
  hexString = hexString.replace(/[^0-9a-fA-F]/g, '')
  if (hexString.length % 2) return null

  // Parse each character pair as a hex byte value
  const u8 = new Uint8Array(hexString.length / 2)
  for (let i = 0; i < hexString.length; i += 2)
    u8[i / 2] = parseInt(hexString.substr(i, 2), 16)

  return new DataView(u8.buffer)
}

export {
  parseHexArray,
  resolveHidInputReportConfigHeader,
  resolveHidInputReportConfigDataPage,
  resolveInputReport,
  sendHidOutputReport,
}
