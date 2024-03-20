"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class ProviderJWT {
    static createPairToken({ payload, key }) {
        try {
            const access_token = jsonwebtoken_1.default.sign(payload, key.public_key, { expiresIn: '1d' });
            const refresh_token = jsonwebtoken_1.default.sign(payload, key.private_key, { expiresIn: '7d' });
            // console.log({ refresh_token, access_token })
            return { access_token, refresh_token };
        }
        catch (e) {
            console.log('e:', e);
            return e;
        }
    }
}
exports.default = ProviderJWT;
