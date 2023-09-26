import { ModuleFace, ModuleType, PControllerButton } from '../types/controller-types'
import { ProteusHidConfigDataPage, ProteusHidConfigDataPageModule } from '../types/proteus-types'

type ModuleButtonMapping = {
  defaultMapping: string,
  mappedTo: string,
}

const getModuleType = (index: number): ModuleType => 
  ModuleType[index] as unknown as ModuleType

const getModuleFace = (index: number): ModuleFace => 
  ModuleFace[index] as unknown as ModuleFace

const getModuleButton = (index: number): PControllerButton => 
  PControllerButton[index] as unknown as PControllerButton

const prepareControllerData = (configDataPages: ProteusHidConfigDataPage[]) => {
  const modules: any[] = []
  for(let page = 0; page < configDataPages.length; page++){
    const pageModules = configDataPages[page].modules
    for(let module = 0; module < pageModules.length; module++){
      if(pageModules[module].moduleType !== 255){
        modules.push({
          id: pageModules[module].moduleId,
          type: pageModules[module].moduleType,
          buttons: resolveControllerModuleMapping(pageModules[module]),
          rotation: pageModules[module].moduleRotation,
          connectsToId: pageModules[module].connectsToModuleId === 255 ? null : pageModules[module].connectsToModuleId,
          connectsToFace: pageModules[module].connectsToModuleFaceId === 255 ? null : getModuleFace(pageModules[module].connectsToModuleFaceId),
        })
      }
    }
  }
  return modules
}

const resolveControllerModuleMapping = (module: ProteusHidConfigDataPageModule): ModuleButtonMapping[] => {
  const moduleType = getModuleType(module.moduleType).toString()
  let buttons: ModuleButtonMapping[] = []
  switch(moduleType){
  case'motherMaster':
  case'motherSlave':
    break
  case'analogLeft':
    buttons = moduleLeftAnalog(module)
    break
  case'analogRight':
    buttons = moduleRightAnalog(module)
    break
  case'triggerLeft':
    //buttons = moduleLeftTrigger(module)
    break
  case'triggerRight':
    //buttons = moduleRightTrigger(module)
    break
  case'joystick':
    buttons = moduleJoystick(module)
    break
  case'dPad':
    buttons = moduleDPad(module)
    break
  case'fourButton':
    buttons = moduleFourButton(module)
    break
  case'twoButton':
    buttons = moduleTwoButton(module)
    break
  case'oneButton':
    buttons = moduleOneButton(module)
    break
  default:
    break
  }

  return buttons
}

const moduleLeftAnalog = (
  module: ProteusHidConfigDataPageModule,
) => {
  return [
    {defaultMapping: 'leftAnalogPress', mappedTo: getModuleButton(module.buttonMapping01).toString()},
    {defaultMapping: 'leftAnalog', mappedTo: getModuleButton(module.buttonMapping02).toString()},
    {defaultMapping: 'analogNorth', mappedTo: module.buttonMapping03.toString()},
    {defaultMapping: 'xStandard', mappedTo: module.buttonMapping04 === 0 ? 'xStandard' : 'xInverted'},
    {defaultMapping: 'yStandard', mappedTo: module.buttonMapping05 === 0 ? 'yStandard' : 'yInverted'},
  ]
}

const moduleRightAnalog = (
  module: ProteusHidConfigDataPageModule,
) => {
  return [
    {defaultMapping: 'rightAnalogPress', mappedTo: getModuleButton(module.buttonMapping01).toString()},
    {defaultMapping: 'rightAnalog', mappedTo: getModuleButton(module.buttonMapping02).toString()},
    {defaultMapping: 'analogNorth', mappedTo: module.buttonMapping03.toString()},
    {defaultMapping: 'xStandard', mappedTo: module.buttonMapping04 === 0 ? 'xStandard' : 'xInverted'},
    {defaultMapping: 'yStandard', mappedTo: module.buttonMapping05 === 0 ? 'yStandard' : 'yInverted'},
  ]
}

const moduleJoystick = (
  module: ProteusHidConfigDataPageModule,
) => {
  return [
    {defaultMapping: 'stick', mappedTo: getModuleButton(module.buttonMapping01).toString()},
  ]
}

const moduleDPad = (
  module: ProteusHidConfigDataPageModule,
) => {
  return [
    {defaultMapping: 'dPadUp', mappedTo: getModuleButton(module.buttonMapping01).toString()},
    {defaultMapping: 'dPadRight', mappedTo: getModuleButton(module.buttonMapping02).toString()},
    {defaultMapping: 'dPadDown', mappedTo: getModuleButton(module.buttonMapping03).toString()},
    {defaultMapping: 'dPadLeft', mappedTo: getModuleButton(module.buttonMapping04).toString()},
  ]
}

const moduleFourButton = (
  module: ProteusHidConfigDataPageModule,
) => {
  return [
    {defaultMapping: 'y', mappedTo: getModuleButton(module.buttonMapping01).toString()},
    {defaultMapping: 'a', mappedTo: getModuleButton(module.buttonMapping02).toString()},
    {defaultMapping: 'b', mappedTo: getModuleButton(module.buttonMapping03).toString()},
    {defaultMapping: 'x', mappedTo: getModuleButton(module.buttonMapping04).toString()},
  ]
}

const moduleTwoButton = (
  module: ProteusHidConfigDataPageModule,
) => {
  return [
    {defaultMapping: 'tB01', mappedTo: getModuleButton(module.buttonMapping01).toString()},
    {defaultMapping: 'tB02', mappedTo: getModuleButton(module.buttonMapping02).toString()},
  ]
}

const moduleOneButton = (
  module: ProteusHidConfigDataPageModule,
) => {
  return [
    {defaultMapping: 'oB01', mappedTo: getModuleButton(module.buttonMapping01).toString()},
  ]
}

const moduleLeftTrigger = (
  module: ProteusHidConfigDataPageModule,
) => {
  return [
    {defaultMapping: 'leftButton', mappedTo: getModuleButton(module.buttonMapping01).toString()},
    {defaultMapping: 'leftTrigger', mappedTo: getModuleButton(module.buttonMapping02).toString()},
  ]
}

const moduleRightTrigger = (
  module: ProteusHidConfigDataPageModule,
) => {
  return [
    {defaultMapping: 'rightButton', mappedTo: getModuleButton(module.buttonMapping01).toString()},
    {defaultMapping: 'rightTrigger', mappedTo: getModuleButton(module.buttonMapping02).toString()},
  ]
}

export {
  prepareControllerData,
}