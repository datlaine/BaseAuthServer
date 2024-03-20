"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SelectData_1 = __importDefault(require("../utils/SelectData"));
const user_model_1 = __importDefault(require("../models/user.model"));
const cloundinary_config_1 = __importDefault(require("../configs/cloundinary.config"));
const dotenv_1 = require("dotenv");
const uploadCloudinary_1 = __importDefault(require("../utils/uploadCloudinary"));
const account_repositort_1 = __importDefault(require("../repositories/account.repositort"));
const mongoose_1 = require("mongoose");
const notification_util_1 = require("../utils/notification.util");
const notification_model_1 = require("../models/notification.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const response_error_1 = require("../Core/response.error");
const sleep_1 = __importDefault(require("../utils/sleep"));
const convert_1 = __importDefault(require("../utils/convert"));
(0, dotenv_1.config)();
class AccountService {
    static async getMe(req) {
        return {
            user: SelectData_1.default.omit(convert_1.default.convertPlantObject(req.user), ['password', 'createdAt', 'updatedAt'])
        };
    }
    static async updateInfo(req) {
        const { user } = req;
        const update = await user_model_1.default.findOneAndUpdate({ _id: user?._id }, { $set: { bob: req.body.birth, gender: req.body.gender, fullName: req.body.fullName, nickName: req.body.nickName } }, { new: true, upsert: true });
        console.log({ update });
        const queryNotification = { notification_user_id: new mongoose_1.Types.ObjectId(user?._id) };
        const updateNotification = {
            $push: {
                notifications_message: (0, notification_util_1.renderNotificationUser)('Bạn vừa cập nhập thông tin cá nhân')
            },
            $inc: { notification_count: 1 }
        };
        const optionNotification = { new: true, upsert: true };
        await notification_model_1.notificationModel.findOneAndUpdate(queryNotification, updateNotification, optionNotification);
        return {
            user: update
        };
    }
    static async updateAvatar(req) {
        const user = req.user;
        if (!user?.avatar.secure_url) {
            const result = await (0, uploadCloudinary_1.default)(req?.file, user?._id);
            console.log({ result });
            const update = await user_model_1.default.findOneAndUpdate({
                _id: user?._id
            }, {
                $set: { avatar: { secure_url: result.secure_url, public_id: result.public_id, date_update: Date.now() } }
            }, { new: true, upsert: true });
            const queryNotification = { notification_user_id: new mongoose_1.Types.ObjectId(user?._id) };
            const updateNotification = {
                $push: {
                    notifications_message: (0, notification_util_1.renderNotificationUser)('Bạn vừa cập nhập avatar cá nhân')
                },
                $inc: { notification_count: 1 }
            };
            const optionNotification = { new: true, upsert: true };
            await notification_model_1.notificationModel.findOneAndUpdate(queryNotification, updateNotification, optionNotification);
            return { user: update };
        }
        else {
            const folder = `users/${user.id}/avatar`;
            const result = await (0, uploadCloudinary_1.default)(req?.file, folder);
            console.log({ result });
            const update = await user_model_1.default.findOneAndUpdate({
                _id: user?._id
            }, {
                $addToSet: {
                    avatar_used: {
                        public_id: user?.avatar.public_id,
                        secure_url: user?.avatar.secure_url,
                        date_update: user.avatar.date_update
                    }
                },
                $set: { avatar: { secure_url: result.secure_url, public_id: result.public_id, date_update: Date.now() } }
            }, { new: true, upsert: true });
            const queryNotification = { notification_user_id: new mongoose_1.Types.ObjectId(user?._id) };
            const updateNotification = {
                $push: {
                    notifications_message: (0, notification_util_1.renderNotificationUser)('Bạn vừa cập nhập avatar cá nhân')
                },
                $inc: { notification_count: 1 }
            };
            const optionNotification = { new: true, upsert: true };
            await notification_model_1.notificationModel.findOneAndUpdate(queryNotification, updateNotification, optionNotification);
            return { user: update };
        }
    }
    static async getAllAvatar(req) {
        const user = req.user;
        const foundAllAvatar = await user_model_1.default.find({ _id: user?._id }, { avatar_used: 1 });
        console.log({ foundAllAvatar });
        return { avatar_used: foundAllAvatar[0].avatar_used };
    }
    static async deleteAvatarUsed(req) {
        const user = req.user;
        const public_id = req.body.public_id;
        const result = await cloundinary_config_1.default.uploader.destroy(public_id);
        const objAvatarUsed = await account_repositort_1.default.findSecureUrlWithPublicId(public_id);
        const update = await user_model_1.default.findOneAndUpdate({
            _id: user?._id
        }, {
            $pull: { avatar_used: { public_id, secure_url: objAvatarUsed?.avatar.secure_url } }
        }, { new: true, upsert: true });
        const queryNotification = { notification_user_id: new mongoose_1.Types.ObjectId(user?._id) };
        const updateNotification = {
            $push: {
                notifications_message: (0, notification_util_1.renderNotificationUser)('Bạn vừa xóa một hình ảnh cũ')
            },
            $inc: { notification_count: 1 }
        };
        const optionNotification = { new: true, upsert: true };
        await notification_model_1.notificationModel.findOneAndUpdate(queryNotification, updateNotification, optionNotification);
        return { user: update };
    }
    static async deleteAvatar(req) {
        const user = req.user;
        const update = await user_model_1.default.findOneAndUpdate({
            _id: user?._id
        }, {
            $addToSet: {
                avatar_used: {
                    public_id: user?.avatar.public_id,
                    secure_url: user?.avatar.secure_url,
                    date_update: user?.avatar.date_update
                }
            },
            $unset: { avatar: 1 }
        }, { new: true, upsert: true });
        const queryNotification = { notification_user_id: new mongoose_1.Types.ObjectId(user?._id) };
        const updateNotification = {
            $push: {
                notifications_message: (0, notification_util_1.renderNotificationUser)('Bạn vừa xóa hình ảnh đại diện')
            },
            $inc: { notification_count: 1 }
        };
        const optionNotification = { new: true, upsert: true };
        await notification_model_1.notificationModel.findOneAndUpdate(queryNotification, updateNotification, optionNotification);
        return { user: update };
    }
    static async addAddress(req) {
        const { user } = req;
        const { addressPayload } = req.body;
        console.log({ body: req.body });
        const query = { _id: new mongoose_1.Types.ObjectId(user?._id) };
        const update = { $addToSet: { user_address: addressPayload } };
        const option = { new: true, upsert: true };
        const updateUser = await user_model_1.default.findOneAndUpdate(query, update, option);
        const queryNotification = { notification_user_id: new mongoose_1.Types.ObjectId(user?._id) };
        const updateNotification = {
            $push: {
                notifications_message: (0, notification_util_1.renderNotificationUser)('Bạn vừa thêm 1 địa chỉ')
            },
            $inc: { notification_count: 1 }
        };
        const optionNotification = { new: true, upsert: true };
        await notification_model_1.notificationModel.findOneAndUpdate(queryNotification, updateNotification, optionNotification);
        return { user: updateUser };
    }
    static async setAddressDefault(req) {
        const { user } = req;
        const { addressPayload } = req.body;
        await user_model_1.default.updateMany({ _id: new mongoose_1.Types.ObjectId(user?._id) }, { 'user_address.$[].address_default': false });
        const query = { _id: new mongoose_1.Types.ObjectId(user?._id), 'user_address._id': addressPayload._id };
        const update = { 'user_address.$.address_default': true };
        const option = { new: true, upsert: true };
        const userUpdate = await user_model_1.default.findOneAndUpdate(query, update, option);
        return { user: userUpdate };
    }
    static async deleteAddress(req) {
        const { user } = req;
        const { address_id } = req.params;
        const query = { _id: new mongoose_1.Types.ObjectId(user?._id), 'user_address._id': address_id };
        const update = { $pull: { user_address: { _id: address_id } } };
        const option = { new: true, upsert: true };
        const updateUser = await user_model_1.default.findOneAndUpdate(query, update, option);
        return { user: updateUser };
    }
    static async securityPassword(req) {
        const { user } = req;
        const { password } = req.body;
        const userQuery = { _id: new mongoose_1.Types.ObjectId(user?._id) };
        const foundUser = await user_model_1.default.findOne(userQuery);
        if (!foundUser)
            throw new response_error_1.NotFoundError({ detail: 'Không tìm thấy user' });
        const comparePass = await bcrypt_1.default.compareSync(password, foundUser?.password);
        await (0, sleep_1.default)(5000);
        return { message: comparePass ? true : false };
    }
    static async updateEmail(req) {
        const { user } = req;
        const { password, newEmail } = req.body;
        const userQuery = { _id: new mongoose_1.Types.ObjectId(user?._id) };
        const foundUser = await user_model_1.default.findOne(userQuery);
        if (!foundUser)
            throw new response_error_1.NotFoundError({ detail: 'Không tìm thấy user' });
        const comparePass = await bcrypt_1.default.compareSync(password, foundUser?.password);
        if (!comparePass) {
            throw new response_error_1.BadRequestError({ detail: 'Quá trình cập nhập xảy ra lỗi' });
        }
        foundUser.email = newEmail || foundUser.email;
        const queryNotification = { notification_user_id: new mongoose_1.Types.ObjectId(user?._id) };
        const updateNotification = {
            $push: {
                notifications_message: (0, notification_util_1.renderNotificationUser)('Bạn vừa thay đổi email')
            },
            $inc: { notification_count: 1 }
        };
        const optionNotification = { new: true, upsert: true };
        await notification_model_1.notificationModel.findOneAndUpdate(queryNotification, updateNotification, optionNotification);
        await foundUser.save();
        await (0, sleep_1.default)(5000);
        return { user: foundUser };
    }
    static async updatePassword(req) {
        const { user } = req;
        const { newPassword, password } = req.body;
        const userQuery = { _id: new mongoose_1.Types.ObjectId(user?._id) };
        const foundUser = await user_model_1.default.findOne(userQuery);
        if (!foundUser)
            throw new response_error_1.NotFoundError({ detail: 'Không tìm thấy user' });
        const comparePass = await bcrypt_1.default.compareSync(password, foundUser?.password);
        if (!comparePass) {
            throw new response_error_1.BadRequestError({ detail: 'Sai mật khẩu' });
        }
        const hashPassword = await bcrypt_1.default.hash(newPassword, 10);
        foundUser.password = hashPassword;
        await foundUser.save();
        const queryNotification = { notification_user_id: new mongoose_1.Types.ObjectId(user?._id) };
        const updateNotification = {
            $push: {
                notifications_message: (0, notification_util_1.renderNotificationUser)('Bạn vừa thay đổi mật khẩu')
            },
            $inc: { notification_count: 1 }
        };
        const optionNotification = { new: true, upsert: true };
        await notification_model_1.notificationModel.findOneAndUpdate(queryNotification, updateNotification, optionNotification);
        await (0, sleep_1.default)(5000);
        return { message: true, user: SelectData_1.default.omit(convert_1.default.convertPlantObject(foundUser), ['password']) };
    }
}
exports.default = AccountService;
