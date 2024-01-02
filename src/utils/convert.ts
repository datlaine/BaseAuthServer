export const convertPlantObject = <T extends object>(object: T) => {
      return JSON.parse(JSON.stringify(object))
}
