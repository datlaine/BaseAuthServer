"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const keyStore_model_1 = __importDefault(require("../models/keyStore.model"));
class KeyStoreService {
    static async findKeyByUserId({ user_id }) {
        const foundKey = await keyStore_model_1.default.findOne({ user_id: new mongoose_1.Types.ObjectId(user_id) });
        return foundKey ? foundKey : null;
    }
    static async createKeyStoreUser({ user_id, private_key, public_key, refresh_token, access_token, refresh_token_used = [] }) {
        const keyStore = keyStore_model_1.default.create({
            user_id,
            private_key,
            public_key,
            refresh_token,
            access_token,
            refresh_token_used
        });
        if (!keyStore)
            throw Error('Create key faild');
        return (await keyStore).toObject();
    }
    static async updateKey() { }
    static async deleteKeyStore({ user_id }) {
        const del = await keyStore_model_1.default.deleteOne({ user_id });
        console.log('del', del);
        return del;
    }
    static async findKeyByRf({ refresh_token }) {
        const foundKey = await keyStore_model_1.default.findOne({ refresh_token });
        return foundKey ? foundKey : null;
    }
}
exports.default = KeyStoreService;
