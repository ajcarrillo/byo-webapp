export enum ProteusButton {
  oB01,     // Proteus One Button module
  tB01,     // Proteus Two Button module - button 1
  tB02,     // Proteus Two Button module - button 2
}

export enum XBoxButton {
  leftAnalogYStandard,    // Non-standard - suggested flag to reset inverted Y axis for analog
  leftAnalogYInverted,    // Non-standard - suggested flag to invert the Y axis for analog
  rightAnalogYStandard,   // Non-standard - suggested flag to reset inverted Y axis for analog
  rightAnalogYInverted,   // Non-standard - suggested flag to invert the Y axis for analog
  leftAnalog,             // Can only be swapped left to right - can invert Y axis
  leftAnalogPress,        // Allow button remap
  rightAnalog,            // Can only be swapped right to left - can invert Y axis
  rightAnalogPress,       // Allow button remap
  dPadUp,                 // Allow button remap
  dPadDown,               // Allow button remap
  dPadLeft,               // Allow button remap
  dPadRight,              // Allow button remap
  a,                      // Allow button remap
  b,                      // Allow button remap
  x,                      // Allow button remap
  y,                      // Allow button remap
  leftButton,             // Allow button remap
  rightButton,            // Allow button remap
  leftTrigger,            // Can only be swapped left to right
  rightTrigger,           // Can only be swapped right to left
  back,                   // Cannot be remapped
  start,                  // Cannot be remapped
}

export enum ModuleCategory {
  body,
  buttons,
  plugs,
  handles,
  custom,
}

export enum ModuleType {
  motherMaster  = 0x00,
  motherSlave   = 0x01,
  spacer        = 0x02,
  edge          = 0x03,
  charger       = 0x04,
  analogRight   = 0x05,
  analogLeft    = 0x06,
  dPad          = 0x07,
  fourButton    = 0x08,
  twoButton     = 0x09,
  oneButton     = 0x10,
  triggerRight  = 0x11,
  triggerLeft   = 0x12,
  xBox          = 0x13,
  joystick      = 0x14,
}

export enum ModuleFace {
  front,
  back,
  left,
  right,
  top,
  bottom,
}

export enum ModuleFaceType {
  male,
  female,
  none,
  control,
}

export type ModuleButton = {
  defaultMapping: XBoxButton,
  mappedTo: XBoxButton,
}

export type ModuleFaces = {
  top: ModuleFaceType,
  bottom: ModuleFaceType,
  left: ModuleFaceType,
  right: ModuleFaceType,
  front: ModuleFaceType,
  back: ModuleFaceType,
}

export type Module = {
  address: string,
  name: string,
  desc: string,
  category: ModuleCategory,
  type: ModuleType,
  faces: ModuleFaces,
  buttons: ModuleButton[],
}

export interface IModule {
  id: number,
  module: Module,
  rotation: number,
  connectsToId: number | null,
  connectsToFace: ModuleFace | null,
}

export type Controller = {
  userAddress: string,
  userProfileName: string,
  controllerAddress: string,
  image: string,
  name: string,
  rating: number,
}

export type ControllerConfiguration = {
  controller: Controller,
  modules: IModule[],
}
