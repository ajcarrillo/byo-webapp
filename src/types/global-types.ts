export type Modify<T, R> = Omit<T, keyof R> & R

export type SelectType = {
  readonly label: string,
  readonly value: string,
}
