"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Convert {
    // convert ve js
    static convertPlantObject(object) {
        return JSON.parse(JSON.stringify(object));
    }
}
exports.default = Convert;
