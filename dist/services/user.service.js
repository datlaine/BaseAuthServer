"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
class UserService {
    static async createUser({ email, password }) {
        const user = await user_model_1.default.create({ email, password });
        if (!user)
            throw Error('Tạo user thất bại');
        return user; // object
    }
    static async findUserByEmail({ email }) {
        console.log(email);
        const foundEmail = await user_model_1.default.findOne({ email }).lean();
        return foundEmail;
    }
    static async findUserById({ _id }) {
        const user = await user_model_1.default.findOne({ _id: new mongoose_1.default.Types.ObjectId(_id) });
        return user ? user : null;
    }
}
exports.default = UserService;
