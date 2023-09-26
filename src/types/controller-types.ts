export enum PControllerModule {
  motherMaster,
  motherSlave,
  spacer,
  edge,
  charger,
  analogRight,
  analogLeft,
  dPad,
  fourButton,
  twoButton,
  oneButton,
  triggerRight,
  triggerLeft,
  xBox,
  joystick,
}

export enum PControllerButton {
  leftAnalog,
  leftAnalogPress,
  rightAnalog,
  rightAnalogPress,
  stick,
  leftTrigger,
  rightTrigger,
  leftButton,
  rightButton,
  dPadUp,
  dPadRight,
  dPadDown,
  dPadLeft,
  y,
  b,
  a,
  x,
  oB01,
  tB01,
  tB02
}

//----------------------
export enum ProteusButton {
  oB01,     // Proteus One Button module
  tB01,     // Proteus Two Button module - button 1
  tB02,     // Proteus Two Button module - button 2
  stick     // Proteus Additional Joystick
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
  select,                 // Cannot be remapped
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
  motherMaster,
  motherSlave,
  spacer,
  edge,
  charger,
  analogRight,
  analogLeft,
  dPad,
  fourButton,
  twoButton,
  oneButton,
  triggerRight,
  triggerLeft,
  xBox,
  joystick,
}

export enum ModuleFace {
  top,
  bottom,
  front,
  back,
  left,
  right,
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
  tags?: string,
}

export type ControllerConfiguration = {
  controller: Controller,
  modules: IModule[],
}

export type ControllerLights = {
  red: string,
  green: string,
  blue: string,
  brightness: string,
}