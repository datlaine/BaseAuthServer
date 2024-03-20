"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SelectData {
    static pick(object, fields) {
        const newObj = {};
        for (let index = 0; index < fields.length; index++) {
            if (fields[index] === object[fields[index]]) {
                newObj[fields[index]] = object[fields[index]];
            }
        }
        return newObj;
    }
    static omit(object, fields) {
        const newObj = { ...object };
        for (let index = 0; index < fields.length; index++) {
            if (fields[index] in object) {
                delete newObj[fields[index]];
            }
        }
        return newObj;
    }
}
exports.default = SelectData;
