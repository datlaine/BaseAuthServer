"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("./user.service"));
const SelectData_1 = __importDefault(require("../utils/SelectData"));
const convert_1 = __importDefault(require("../utils/convert"));
const crypto_1 = require("crypto");
const provider_jwt_1 = __importDefault(require("../utils/provider.jwt"));
const keyStore_model_1 = __importDefault(require("../models/keyStore.model"));
const keyStore_service_1 = __importDefault(require("./keyStore.service"));
const response_error_1 = require("../Core/response.error");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../models/user.model"));
const google_oauth_1 = require("../utils/google.oauth");
const mongoose_1 = require("mongoose");
const notification_model_1 = require("../models/notification.model");
const notification_util_1 = require("../utils/notification.util");
class AuthService {
    //REGISTER
    static async register(req, res) {
        // req.body --> email, password
        const { email, password } = req.body;
        //check email trong database
        const foundEmail = await user_service_1.default.findUserByEmail({ email });
        console.log('email', foundEmail);
        if (foundEmail)
            throw new response_error_1.BadRequestError({ detail: 'Email đã được đăng kí' });
        //hash pass
        const hashPassword = await bcrypt_1.default.hash(password, 10);
        if (!hashPassword)
            throw new response_error_1.ResponseError({ detail: 'Hash failed' });
        // tạo account user
        const createUser = await user_service_1.default.createUser({ email, password: hashPassword });
        const { email: emailUser, _id, roles } = createUser;
        // {public_key, private_key}
        const public_key = (0, crypto_1.randomBytes)(64).toString('hex');
        const private_key = (0, crypto_1.randomBytes)(64).toString('hex');
        const { access_token, refresh_token } = (await provider_jwt_1.default.createPairToken({
            payload: { email: emailUser, _id, roles },
            key: { public_key, private_key }
        }));
        await keyStore_service_1.default.createKeyStoreUser({
            user_id: _id,
            public_key,
            private_key,
            refresh_token,
            access_token
        });
        const admin = await user_model_1.default.findOne({ roles: { $in: ['Admin'] } });
        const updateNotification = {};
        const noti = await notification_model_1.notificationModel.findOneAndUpdate({
            notification_user_id: new mongoose_1.Types.ObjectId(createUser._id)
        }, {
            $inc: { notification_count: 1 },
            $push: { notifications_message: (0, notification_util_1.renderNotificationSystem)('Xin chào, cảm ơn bạn đã đăng kí tài khoản <3') }
        }, { new: true, upsert: true });
        res.header('Set-Cookie', `refresh_token=${refresh_token};  maxAge: 1000 * 60 * 60 * 24 * 7,Path=/; HttpOnly; Secure; SameSite=None;`);
        // res.cookie('refresh_token', refresh_token, { maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: 'none', secure: true })
        //return cho class Response ở controller
        return {
            user: SelectData_1.default.omit(convert_1.default.convertPlantObject(createUser), ['password', 'createdAt', 'updatedAt', '__v']),
            access_token
        };
    }
    //LOGIN
    static async login(req, res) {
        const { email, password } = req.body;
        // found email
        const foundUser = await user_service_1.default.findUserByEmail({ email });
        if (!foundUser)
            throw new response_error_1.AuthFailedError({ detail: 'Đăng nhập thất bại, vui lòng nhập thông tin hợp lệ' });
        // match email with user._id
        // compare pass
        const comparePass = await bcrypt_1.default.compareSync(password, foundUser.password);
        if (!comparePass)
            throw new response_error_1.AuthFailedError({ detail: 'Đăng nhập thất bại, vui lòng nhập thông tin hợp lệ' });
        const public_key = (0, crypto_1.randomBytes)(64).toString('hex');
        const private_key = (0, crypto_1.randomBytes)(64).toString('hex');
        const keyStore = await keyStore_model_1.default.findOneAndUpdate({ user_id: foundUser._id }, { $set: { public_key, private_key } }, { new: true, upsert: true });
        const { access_token, refresh_token: new_rf } = provider_jwt_1.default.createPairToken({
            payload: { _id: foundUser._id, email: foundUser.email, roles: foundUser.roles },
            key: { private_key: keyStore?.private_key, public_key: keyStore?.public_key }
        });
        //check token cu
        if (req?.cookies['refresh_token']) {
            const refresh_token = req.cookies['refresh_token'];
            // neu hop le thi thu hoi
            if (refresh_token === keyStore.refresh_token) {
                await keyStore_model_1.default?.findOneAndUpdate({ user_id: foundUser._id }, { $set: { refresh_token: new_rf }, $addToSet: { refresh_token_used: refresh_token } });
                // }
            }
        }
        res.header('Set-Cookie', `refresh_token=${new_rf};  maxAge: 1000 * 60 * 60 * 24 * 7,Path=/; HttpOnly; Secure; SameSite=None;`);
        // res.cookie('refresh_token', new_rf, { maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: 'none', secure: true })
        await keyStore_model_1.default?.findOneAndUpdate({ user_id: foundUser._id }, { $set: { refresh_token: new_rf } });
        const queryNotification = { notification_user_id: new mongoose_1.Types.ObjectId(foundUser?._id) };
        const updateNotification = {
            $push: {
                notifications_message: (0, notification_util_1.renderNotificationSystem)('Chào mừng bạn đã đăng nhập trở lại')
            },
            $inc: { notification_count: 1 }
        };
        const optionNotification = { new: true, upsert: true };
        await notification_model_1.notificationModel.findOneAndUpdate(queryNotification, updateNotification, optionNotification);
        return {
            user: SelectData_1.default.omit(convert_1.default.convertPlantObject(foundUser), ['password', 'createdAt', 'updatedAt', '__v']),
            access_token
        };
    }
    // logout
    static async logout(req, res) {
        const { keyStore, user } = req;
        await keyStore_service_1.default.deleteKeyStore({ user_id: user.id });
        res.clearCookie('refresh_token');
        const queryNotification = { notification_user_id: new mongoose_1.Types.ObjectId(user?._id) };
        const updateNotification = {
            $push: {
                notifications_message: (0, notification_util_1.renderNotificationSystem)('Tiến hành logout')
            },
            $inc: { notification_count: 1 }
        };
        const optionNotification = { new: true, upsert: true };
        await notification_model_1.notificationModel.findOneAndUpdate(queryNotification, updateNotification, optionNotification);
        return { message: 'Logout success!!' };
    }
    static async refresh_token(req, res) {
        const { refresh_token, keyStore, user } = req;
        // console.log('gọi api')
        // console.log({ old: keyStore?.refresh_token, token: refresh_token, used: keyStore?.refresh_token_used, keyStore })
        if (keyStore?.refresh_token_used.includes(keyStore.refresh_token)) {
            await keyStore_model_1.default.deleteOne({ user_id: user?._id });
            throw new response_error_1.ForbiddenError({ detail: 'Token đã được sử dụng444' });
        }
        if (keyStore?.refresh_token !== refresh_token)
            throw new response_error_1.ForbiddenError({ detail: 'Token không đúng' });
        const public_key = (0, crypto_1.randomBytes)(64).toString('hex');
        const private_key = (0, crypto_1.randomBytes)(64).toString('hex');
        const token = (await provider_jwt_1.default.createPairToken({
            payload: { email: user?.email, _id: user?._id, roles: user?.roles },
            key: { public_key: public_key, private_key: private_key }
        }));
        const update = await keyStore_model_1.default
            .findOneAndUpdate({ user_id: new mongoose_1.Types.ObjectId(user?._id) }, {
            $set: { refresh_token: token.refresh_token, public_key, private_key },
            $addToSet: { refresh_token_used: refresh_token }
        }, { upsert: true, new: true })
            .lean();
        // console.log({ update })
        res.header('Set-Cookie', `refresh_token=${refresh_token};  maxAge: 1000 * 60 * 60 * 24 * 7,Path=/; HttpOnly; Secure; SameSite=None;`);
        // res.cookie('refresh_token', token.refresh_token, { maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: 'none', secure: true })
        return { token: token.access_token, rf: token.refresh_token, user };
    }
    static async loginWithGoogle(req) {
        // console.log('query', req.query.code)
        // return req.query.code
        const { code } = req.query;
        const token = await (0, google_oauth_1.getOautGoogleToken)(code);
        // eslint-disable-next-line prettier/prettier
        const { id_token, access_token } = token;
        const googleUser = await (0, google_oauth_1.getGoogleUser)({ id_token, access_token });
        // console.log(googleUser)
        const user = googleUser.data;
        if ('verified_email' in googleUser) {
            if (!googleUser.verified_email) {
                new response_error_1.ForbiddenError({ detail: 'block' });
            }
        }
        return { image: user.picture, name: user.name };
    }
}
exports.default = AuthService;
