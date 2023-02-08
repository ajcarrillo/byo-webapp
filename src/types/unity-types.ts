export type ReactUnityEventParameter = string | number | undefined

export type UnityMessage = {
  gameObjectName: string,
  methodName: string,
  parameter?: ReactUnityEventParameter
}