import { 
  IModule,
  Module,
  ModuleButton,
  ModuleCategory,
  ModuleFace,
  ModuleFaceType, 
  ModuleType, 
  XBoxButton
} from '../types/controller-types'

/**
 * Returns a ModuleType from a hex value
 * @param hex A hex number
 * @returns A ModuleType
 */
const getModuleTypeFromHex = (hex: number): ModuleType => 
  ModuleType[hex] as unknown as ModuleType

/**
 * Returns a ModuleFace from a string value
 * @param face A face name
 * @returns A ModuleFace
 */
const getModuleFaceFromString = (face: string): ModuleFace => 
  face as unknown as ModuleFace

/**
 * Returns a ModuleFaceType from a string value
 * @param faceType A face type name
 * @returns A ModuleFaceType
 */
const getModuleFaceTypeFromString = (faceType: string): ModuleFaceType => 
  faceType as unknown as ModuleFaceType

/**
 * Returns a ModuleCategory from a string value
 * @param cat A face category
 * @returns A ModuleCategory
 */
const getModuleCategoryFromString = (cat: string): ModuleCategory => 
  cat as unknown as ModuleCategory

/**
 * Returns a XBoxButton param from a string value
 * @param buttonParam A button parameter
 * @returns A XBoxButton
 */
const getXBoxButtonParamFromString = (buttonParam: string): XBoxButton => 
  buttonParam as unknown as XBoxButton

/**
 * Transforms an array of modules from the database
 * @param list A list of modules from the database
 * @returns An array of Modules
 */
const transformModuleListFromDB = (list: {[key:string]: any}[]): Module[] => {
  const modules: Module[] = list.map((module) => {
    return {
      address: module.address,
      name: module.name,
      desc: module.desc,
      category: getModuleCategoryFromString(module.category),
      type: getModuleTypeFromHex(parseInt(module.type, 16)),
      faces: {
        top: getModuleFaceTypeFromString(module.faces.top),
        bottom: getModuleFaceTypeFromString(module.faces.bottom),
        left: getModuleFaceTypeFromString(module.faces.left),
        right: getModuleFaceTypeFromString(module.faces.right),
        front: getModuleFaceTypeFromString(module.faces.front),
        back: getModuleFaceTypeFromString(module.faces.back),
      },
      buttons: [],
    }
  })
  return modules
}

/**
 * Transforms an array of module configs from the controller hardware
 * @param list An array of module configurations from the hardware
 * @param availableModules An array of available modules from the database
 * @returns An array of IModule interfaces
 */
const transformModuleListFromHardware = (
  list: {[key:string]: any}[],
  availableModules: Module[]
): IModule[] => {
  const modules: IModule[] = []
  list.forEach(item => {
    const module: Module | undefined = 
      availableModules.find(m => m.type === getModuleTypeFromHex(parseInt(item.type, 16)))

    if (module){
      const buttons: ModuleButton[] = item.buttons.map((b: {[key:string]: string}) => ({
        default: getXBoxButtonParamFromString(b.default),
        mapping: getXBoxButtonParamFromString(b.mapping),
      }))
      module.buttons = buttons
      modules.push({
        id: item.id,
        module,
        rotation: item.rotation,
        connectsToId: item.connectsToId,
        connectsToFace: getModuleFaceFromString(item.connectsToFace)
      })
    }
  })
  return modules
}

export {
  getModuleFaceTypeFromString,
  getModuleTypeFromHex,
  transformModuleListFromDB,
  transformModuleListFromHardware
}