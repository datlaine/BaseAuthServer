"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const response_error_1 = require("../Core/response.error");
class ProviderBcrypt {
    static async comparePass({ password, hashPassword }) {
        console.log('params::', password, hashPassword);
        try {
            const compare = await bcrypt_1.default.compare(password, hashPassword.trim());
            console.log(compare);
            return compare;
        }
        catch (e) {
            return new response_error_1.AuthFailedError({ detail: 'Password wrong' });
        }
    }
}
exports.default = ProviderBcrypt;
