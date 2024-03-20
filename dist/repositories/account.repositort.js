"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
class AccountRepository {
    static async findSecureUrlWithPublicId(public_id) {
        const foundSecureUrl = user_model_1.default.findOne({ avatar: { public_id } }).lean();
        return foundSecureUrl;
    }
}
exports.default = AccountRepository;
