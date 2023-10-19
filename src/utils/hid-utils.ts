import { IModule } from '../types/controller-types'
import { 
  ProteusHidConfigDataPage, 
  ProteusHidConfigDataPageModule, 
  ProteusHidConfigHeader, 
  ProteusMappingConfig
} from '../types/proteus-types'
import { getModuleButton, xboxTriggerPressed } from './controller-utils'

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

/**
 * Resolves the button input report
 * @param data The input report data view
 * @returns The input report
 */
const resolveHidInputReportXboxInput = (controllerModules: IModule[] | undefined, data: DataView): ProteusMappingConfig => {
  //console.log(controllerModules)
  // 0 = Report Type
  // 1 Report Subtype
  // 2 = module ID
  const moduleId = data.getUint8(2)
  const analogNegX = detectAnalogMovement(data.getUint16(3), 65535, 1000)
  const analogPosX = detectAnalogMovement(data.getUint16(4), 65535, 1000)
  const analogNegY = detectAnalogMovement(data.getUint16(5), 65535, 1000)
  const analogPosY = detectAnalogMovement(data.getUint16(6), 65535, 1000)
  const stickNegX = detectAnalogMovement(data.getUint16(7), 65535, 1000)
  const stickPosX = detectAnalogMovement(data.getUint16(8), 65535, 1000)
  const stickNegY = detectAnalogMovement(data.getUint16(9), 65535, 1000)
  const stickPosY = detectAnalogMovement(data.getUint16(10), 65535, 1000)
  const trigger = data.getUint16(11)
  const button = data.getUint8(12)

  const module = controllerModules?.find(m => m.id === moduleId)

  let mode = ''
  let control = ''
  if(button !== 255){
    mode = 'button'
    control = getModuleButton(button).toString()
  }else if(xboxTriggerPressed(trigger)){
    mode = 'trigger' 
    control = module?.module.type.toString() === 'triggerLeft' ? 'leftTrigger' : 'rightTrigger'
  }else if(
    simpleAnalogDetect(data.getUint16(3), data.getUint16(4)) || 
    simpleAnalogDetect(data.getUint16(5), data.getUint16(6))
  )
  {
    mode = 'analog'
    control = module?.module.type.toString() === 'analogLeft' ? 'leftAnalog' : 'rightAnalog'
  }
  else if(
    simpleAnalogDetect(data.getUint16(7), data.getUint16(8)) || 
    simpleAnalogDetect(data.getUint16(9), data.getUint16(10))
  )
  {
    mode = 'analog'
    control = 'stick'
  }

  // console.log({
  //   moduleId,
  //   analogNegX: data.getUint16(3),
  //   analogPosX: data.getUint16(4),
  //   analogNegY: data.getUint16(5),
  //   analogPosY: data.getUint16(6),
  //   stickNegX,
  //   stickPosX,
  //   stickNegY,
  //   stickPosY,
  //   trigger,
  //   button
  // })

  return {mode: mode as ProteusMappingConfig['mode'], module: module || null, control}
}

const simpleAnalogDetect = (negative: number, positive: number) => {
  if (negative !== positive)
    return true
  else
    return false
}

/**
 * Detects a stick/trigger movement, given a resting value of <resting> +- a <deadzone>
 * @param input Input from the stick/trigger
 * @param deadzone A deadzone in case a stick/trigger is not trimmed correctly
 * @returns True/False
 */
const detectAnalogMovement = (input: number, resting: number, deadzone: number) => {
  return (input < (resting - deadzone)) || (input > (resting + deadzone))
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

  // const motherMaster = {
  //   moduleId: 0, 
  //   moduleType: 0, //motherMaster
  //   moduleRotation: 0, // 0 degress
  //   connectsToModuleId: 14,
  //   connectsToModuleFaceId: 1,
  //   buttonMapping01: 255, // null value
  //   buttonMapping02: 255, // null value
  //   buttonMapping03: 255, // null value
  //   buttonMapping04: 255, // null value
  //   buttonMapping05: 255, // null value
  //   buttonMapping06: 255, // null value
  // }



  const lAnalog = {
    moduleId: 1,
    moduleType: 6,
    moduleRotation: 8,
    connectsToModuleId: 0,
    connectsToModuleFaceId: 4,
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
    connectsToModuleFaceId: 5,
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
    connectsToModuleFaceId: 2,
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
    connectsToModuleFaceId: 4,
    buttonMapping01: 7, // left button
    buttonMapping02: 5, // left trigger
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
    connectsToModuleFaceId: 5,
    buttonMapping01: 8, // right button
    buttonMapping02: 6, // right trigger
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
    connectsToModuleFaceId: 5,
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
    connectsToModuleFaceId: 3,
    buttonMapping01: 9, // Up
    buttonMapping02: 10, // Right
    buttonMapping03: 11, // Down
    buttonMapping04: 12, // Left
    buttonMapping05: 255, // null value
    buttonMapping06: 255, // null value
  }
  const xBox = {
    moduleId: 8,
    moduleType: 13,
    moduleRotation: 0,
    connectsToModuleId: 0,
    connectsToModuleFaceId: 3,
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
    connectsToModuleFaceId: 2,
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
    connectsToModuleFaceId: 1,
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
    connectsToModuleFaceId: 1,
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
    connectsToModuleFaceId: 1,
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
    connectsToModuleFaceId: 4,
    buttonMapping01: 17, // One Button
    buttonMapping02: 255, // null value
    buttonMapping03: 255, // null value
    buttonMapping04: 255, // null value
    buttonMapping05: 255, // null value
    buttonMapping06: 255, // null value
  }

  const motherSlave = {
    moduleId: 14,
    moduleType: 1, //motherSlave
    moduleRotation: 0,
    connectsToModuleId: 255,
    connectsToModuleFaceId: 255,
    buttonMapping01: 255, // null value
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
    return [joystick, spacer, charger, oneButton, motherSlave]
  else
    return []
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
  resolveHidInputReportXboxInput,
  sendHidOutputReport,
}
