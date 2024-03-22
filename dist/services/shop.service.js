"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const response_error_1 = require("../Core/response.error");
const cloundinary_config_1 = __importDefault(require("../configs/cloundinary.config"));
const notification_model_1 = require("../models/notification.model");
const order_model_1 = require("../models/order.model");
const product_model_1 = __importDefault(require("../models/product.model"));
const shop_model_1 = require("../models/shop.model");
const user_model_1 = __importDefault(require("../models/user.model"));
const shop_repository_1 = __importDefault(require("../repositories/shop.repository"));
const notification_util_1 = require("../utils/notification.util");
const uploadCloudinary_1 = __importDefault(require("../utils/uploadCloudinary"));
class ShopService {
    static async registerShop(req) {
        const { shop_name, data, shop_description } = req.body;
        const { user } = req;
        const { file } = req;
        const { state, mode } = req.query;
        let update = {};
        if (state === 'Full') {
            if (!file)
                throw new response_error_1.BadRequestError({ detail: 'Missing File' });
            const folder = `user/${user?._id}/shop`;
            const result = await (0, uploadCloudinary_1.default)(file, folder);
            update = {
                $set: { shop_name, shop_avatar: { secure_url: result.secure_url, public_id: result.public_id }, shop_description }
            };
        }
        if (state === 'no-file') {
            update = {
                $set: { shop_name, shop_description }
            };
        }
        const registerShop = await shop_model_1.shopModel.findOneAndUpdate({ owner: new mongoose_1.Types.ObjectId(user?._id) }, update, {
            new: true,
            upsert: true
        });
        console.log({ shop: JSON.stringify(registerShop), _id: registerShop?._id });
        const productShop = await shop_model_1.productShopModel.findOneAndUpdate({ shop_id: registerShop._id }, { $set: { shop_id: registerShop._id } }, { new: true, upsert: true });
        const updateUser = await user_model_1.default.findOneAndUpdate({ _id: user?._id }, { $set: { isOpenShop: true } }, { new: true, upsert: true });
        const queryNotification = { notification_user_id: new mongoose_1.Types.ObjectId(user?._id) };
        const updateNotifcation = {
            $push: {
                notifications_message: (0, notification_util_1.renderNotificationSystem)(mode === 'UPDATE' ? 'Cập nhập thông tin cửa hàng thành công' : 'Đăng kí mở cửa hàng thành công')
            },
            $inc: { notification_count: 1 }
        };
        const optionNotification = { new: true, upsert: true };
        const result = await notification_model_1.notificationModel.findOneAndUpdate(queryNotification, updateNotifcation, optionNotification);
        console.log({ notifiaction: result });
        return { shop: registerShop, user: updateUser };
    }
    static async UploadAvatarShop(req) {
        const file = req.file;
        console.log({ file });
        if (!file)
            throw new response_error_1.BadRequestError({ detail: 'Không có file' });
        const { user } = req;
        const folder = `user/${user?._id}/shop`;
        const result = await (0, uploadCloudinary_1.default)(file, folder);
        const shopUpdate = await shop_model_1.shopModel.findOneAndUpdate({ owner: user?._id }, {
            $set: { shop_avatar: { secure_url: result.secure_url, public_id: result.public_id } }
        }, { new: true, upsert: true });
        return { shop_id: shopUpdate._id, shop_avatar: shopUpdate.shop_avatar };
    }
    static async deleteAvatarShop(req) {
        const { shop_id, public_id } = req.body;
        const resultRemove = await cloundinary_config_1.default.uploader.destroy(public_id);
        const removeDocument = await shop_model_1.shopModel.findOneAndUpdate({ _id: new mongoose_1.Types.ObjectId(shop_id) }, { $unset: { shop_avatar: 1 } });
        console.log({ removeDocument, resultRemove });
        return { message: 'Xóa thành công' };
    }
    static async getMyShop(req) {
        const { user } = req;
        const foundShop = await shop_model_1.shopModel.findOne({ owner: user?._id });
        if (!foundShop)
            throw new response_error_1.BadRequestError({ detail: 'Không tìm thấy Shop' });
        return { shop: foundShop };
    }
    static async getProductMyShop(req) {
        const { user } = req;
        const { page, limit, shop_id, sort, inc } = req.query;
        const shopQuery = { owner: new mongoose_1.Types.ObjectId(user?._id) };
        const PAGE = Number(page);
        const LIMIT = Number(limit);
        const SKIP = LIMIT * (PAGE - 1);
        const foundOrder = await order_model_1.orderModel
            .find({
            'order_products.products.shop_id': new mongoose_1.Types.ObjectId(shop_id)
        })
            .populate({ path: 'order_products.products.product_id', select: { product_name: 1, product_price: 1 } });
        console.log({ foundOrder });
        const shop = await shop_model_1.shopModel.findOne(shopQuery).populate({
            path: 'shop_products',
            options: {
                // sort: filter,
                skip: SKIP,
                limit: LIMIT,
                select: {
                    _id: 1,
                    product_name: 1,
                    product_price: 1,
                    product_thumb_image: 1,
                    product_votes: 1,
                    product_is_bought: 1,
                    product_desc_image: 1
                }
            }
        });
        // const shop = await shopModel.findOne({ owner: new Types.ObjectId(user?._id) })
        // const foundProductMyShop = await productModel.find({ shop_id: shop?._id, product_state: true })
        // console.log({ foundProductMyShop })
        return { shop: shop, order: foundOrder };
    }
    static async foundShopHasProductType(req) {
        const { product_type } = req.query;
        const filterProductType = await product_model_1.default.find({ product_type }).populate('shop_id');
        const shop_unique = [];
        filterProductType.filter((p) => {
            const foundShop = shop_unique.findIndex((shop) => shop._id === p.shop_id._id);
            if (foundShop === -1) {
                shop_unique.push(p.shop_id);
            }
            return;
        });
        return { shops: shop_unique };
    }
    static async getShopInfoOfProduct(req) {
        const { shop_id } = req.query;
        const foundShop = await shop_model_1.shopModel.findOne({ _id: new mongoose_1.Types.ObjectId(shop_id) });
        return { shop: foundShop };
    }
    static async getShopId(req) {
        const { shop_id } = req.query;
        const shop = await shop_model_1.shopModel.findOne({ _id: new mongoose_1.Types.ObjectId(shop_id) });
        return { shop };
    }
    static async getProductFilter(req) {
        const { page, limit, shop_id, sort, inc } = req.query;
        const PAGE = Number(page);
        const INC = Number(inc);
        const LIMIT = Number(limit);
        const SKIP = LIMIT * (PAGE - 1);
        const filter = { [sort]: INC, _id: 1 };
        const shopQuery = { _id: new mongoose_1.Types.ObjectId(shop_id) };
        const shop = await shop_model_1.shopModel.findOne(shopQuery).populate({
            path: 'shop_products',
            options: {
                sort: filter,
                skip: SKIP,
                limit: LIMIT,
                select: {
                    _id: 1,
                    product_name: 1,
                    product_price: 1,
                    product_thumb_image: 1,
                    product_votes: 1,
                    product_is_bought: 1,
                    product_desc_image: 1
                }
            }
        });
        console.log({ SKIP, LIMIT, page, limit, sort });
        return { shop: shop || { shop_products: [] } };
    }
    static async getOrderMyShop(req) {
        const { user } = req;
        const { page, limit, shop_id } = req.query;
        const orderQuery = {
            'order_products.products.shop_id': new mongoose_1.Types.ObjectId(shop_id)
        };
        const PAGE = Number(page);
        const LIMIT = Number(limit);
        const SKIP = LIMIT * (PAGE - 1);
        const populatePath = 'order_products.products.product_id';
        // const populateSelect = { product_name: 1, product_price: 1, product_thumb_image: 1, product_votes: 1, _id: 1 }
        const populateOption = {
            select: {
                _id: 1,
                product_name: 1,
                product_price: 1,
                product_thumb_image: 1,
                product_votes: 1,
                product_is_bought: 1
            }
        };
        const foundOrder = await shop_repository_1.default.getMyOrderShop({
            shop_id: new mongoose_1.Types.ObjectId(shop_id),
            limit: LIMIT,
            skip: SKIP
        });
        // const result = await orderModel
        //       .find({ 'order_products.products.shop_id': new Types.ObjectId(shop_id as string) })
        //       .populate({
        //             path: 'order_products.products.product_id',
        //             model: 'Product',
        //             select: '_id product_thumb_image product_name product_votes product_price'
        //       })
        //       .exec()
        // const foundOrder = await orderModel
        //       .find(orderQuery)
        //       .populate({
        //             path: populatePath,
        //             options: populateOption
        //       })
        //       .skip(SKIP)
        //       .limit(LIMIT)
        // const PAGE_RESULT = PAGE - 1
        // const start = LIMIT * PAGE_RESULT
        // const end = start + LIMIT
        // const pagination = foundOrder?.order_products.slice(start, end)
        // console.log({ start, end })
        return { orderShop: foundOrder || { order_products: [] } };
    }
    static async getShopAdmin(req) {
        const admin = await user_model_1.default.findOne({ roles: 'admin' });
        const shopAdmin = await shop_model_1.shopModel
            .findOne({ owner: new mongoose_1.Types.ObjectId(admin?._id) })
            .select('shop_name shop_avatar shop_avatar_default shop_vote _id shop_count_total_vote')
            .lean();
        return { shopAdmin };
    }
}
exports.default = ShopService;
