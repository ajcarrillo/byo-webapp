/**
 * Writes to a serial port
 * @param writer A Serial Port writer object
 * @param command A Promise
 */
const serialWrite = async (writer: WritableStreamDefaultWriter<Uint8Array>, command: number[]) => {
  const data = new Uint8Array(command)
  return await writer.write(data)
}

/**
 * Reads from a serial port
 * @param reader A Serial Port reader object
 */
const serialRead = async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value, done } = await reader.read()
      if (done) {
        reader.releaseLock()
        break
      }
      if (value) {
        return {value, error: undefined}
      }
    }
  } catch (e) {
    return {value: undefined, error: e}
  }
}

/**
 * Converts an array of integers to a hex string
 * @param arr An array of integers
 * @returns A Hex string
 */
const intArray2Hex = (arr: Uint8Array | undefined): string[] => {
  const result: string[] = []
  if(arr){
    arr.forEach(v => {
      result.push(v.toString(16).padStart(2, '0').toUpperCase())
    })   
  }
  return result
}

/**
 * Validates that a response mayches a known response
 * @param response 
 * @param expected 
 * @returns True/False
 */
const validateResponseArray = (response: string[], expected: string[]): boolean => {
  if (response.length !== expected.length) return false
  response.sort()
  expected.sort()
  return response.every((elem, index) => elem === expected[index])
}

export {
  intArray2Hex,
  validateResponseArray,
  serialRead,
  serialWrite,
}
