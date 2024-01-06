class Convert {
      // convert ve js
      static convertPlantObject<T extends object>(object: T) {
            return JSON.parse(JSON.stringify(object))
      }
}

export default Convert
