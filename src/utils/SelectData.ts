class SelectData {
      static pick<T extends object, K extends keyof T>(object: T, fields: K[]): Record<K, T[K]> {
            const newObj = {} as Record<K, T[K]>
            for (let index = 0; index < fields.length; index++) {
                  if (fields[index] === object[fields[index]]) {
                        newObj[fields[index]] = object[fields[index]]
                  }
            }
            return newObj
      }

      static omit<T extends object, K extends keyof T>(object: T, fields: K[]): Record<K, T[K]> {
            const newObj = { ...object }

            for (let index = 0; index < fields.length; index++) {
                  if (fields[index] in object) {
                        delete newObj[fields[index]]
                  }
            }

            return newObj
      }
}

export default SelectData
