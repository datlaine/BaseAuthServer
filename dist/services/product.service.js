"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const response_error_1 = require("../Core/response.error");
const cloundinary_config_1 = __importDefault(require("../configs/cloundinary.config"));
const authentication_1 = require("../middlewares/authentication");
const notification_model_1 = require("../models/notification.model");
const product_model_1 = __importDefault(require("../models/product.model"));
const shop_model_1 = require("../models/shop.model");
const comment_repository_1 = __importDefault(require("../repositories/comment.repository"));
const product_repository_1 = __importDefault(require("../repositories/product.repository"));
const shop_repository_1 = __importDefault(require("../repositories/shop.repository"));
const notification_util_1 = require("../utils/notification.util");
const uploadCloudinary_1 = __importDefault(require("../utils/uploadCloudinary"));
const user_utils_1 = require("../utils/user.utils");
class ProductService {
    static async searchQuery(req) {
        const { text } = req.query;
        console.log({ text });
        const products = await product_model_1.default
            .find({ $text: { $search: text } })
            .select('product_name _id product_thumb_image product_votes')
            .skip(0)
            .limit(4);
        const shops = await shop_model_1.shopModel
            .find({ $text: { $search: text } })
            .select('shop_name _id shop_avatar')
            .skip(0)
            .limit(2);
        return { products, shops };
    }
    static async seachNameProduct(req) {
        const { page, limit, text } = req.query;
        const PAGE = Number(page);
        const LIMIT = Number(limit);
        const SKIP = LIMIT * (PAGE - 1);
        console.log({ text });
        const products = await product_model_1.default
            .find({ $text: { $search: text } })
            .select('product_name _id product_thumb_image product_votes')
            .skip(SKIP)
            .limit(LIMIT);
        return { shop: { shop_products: products } };
    }
    static async createBaseProductId(req) {
        const { user } = req;
        const foundShop = await shop_model_1.shopModel.findOne({ owner: user?._id });
        const createProduct = await product_model_1.default.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId() }, { $set: { owner: foundShop?._id } }, { new: true, upsert: true });
        return { product_id: createProduct?._id };
    }
    static async uploadProductDescriptionImageOne(req) {
        const file = req.file;
        const { user } = req;
        const { product_id } = req.body;
        console.log({ product_id });
        if (file) {
            const folder = `users/${user?.id}/product`;
            const result = await (0, uploadCloudinary_1.default)(file, folder);
            const productDemo = await product_model_1.default.findOneAndUpdate({
                _id: new mongoose_1.default.Types.ObjectId(product_id)
            }, {
                $addToSet: {
                    product_desc_image: { secure_url: result.secure_url, public_id: result.public_id }
                }
            }, { new: true, upsert: true });
            return {
                product: {
                    product_id: productDemo._id,
                    public_id: result.public_id,
                    secure_url: result.secure_url
                }
            };
        }
        return { message: 'Missing file' };
    }
    static async deleteProductDescriptionImageOne(req) {
        const { public_id, product_id } = req.body;
        if (!product_id || !public_id)
            return { message: 'Không tìm thấy id hoặc public_id' };
        const result = await cloundinary_config_1.default.uploader.destroy(public_id);
        const deleteProduct = await product_model_1.default.findOneAndUpdate({ _id: product_id }, { $pull: { product_desc_image: { public_id } } }, { new: true, upsert: true });
        if (!result)
            return result;
        return { message: 'Xoa thanh cong' };
    }
    static async uploadProductThumb(req) {
        const file = req.file;
        const { user } = req;
        const { product_id } = req.body;
        console.log({ user });
        if (file) {
            const folder = `users/${user?.id}/product`;
            const result = await (0, uploadCloudinary_1.default)(file, folder);
            const productDemo = await product_model_1.default.findOneAndUpdate({
                _id: new mongoose_1.default.Types.ObjectId(product_id)
            }, {
                $set: {
                    product_thumb_image: { secure_url: result.secure_url, public_id: result.public_id }
                }
            }, { new: true, upsert: true });
            return {
                product: {
                    product_id: productDemo._id,
                    product_thumb_image: productDemo.product_thumb_image
                }
            };
        }
        return { message: 'Missing file' };
    }
    static async getProductShop(req) {
        const user = req.user;
        const foundShop = await shop_model_1.shopModel.findOne({ owner: new mongoose_1.Types.ObjectId(user?._id) });
        const product_all = await product_model_1.default.find({
            shop_id: foundShop?._id
        });
        const result = product_all.map((product) => {
            return product.product_desc_image.map((img) => {
                const config = cloundinary_config_1.default.url(img.public_id, { width: 100, height: 100 });
                img.secure_url = config;
                return img;
            });
        });
        return { product_all };
    }
    static async deleteProductThumb(req) {
        const public_id = req.body.public_id;
        const id = req.body.id;
        if (!id || !public_id)
            return { message: 'Không tìm thấy id hoặc public_id' };
        const result = await cloundinary_config_1.default.uploader.destroy(public_id);
        const deleteProduct = await product_model_1.default.findOneAndUpdate({ _id: id }, { $unset: { product_thumb_image: 1 } }, { new: true, upsert: true });
        if (!result)
            return result;
        return { message: 'Xoa thanh cong' };
    }
    static async deleteProductImageFull(req) {
        const id = req.body.id;
        if (!id)
            throw new response_error_1.BadRequestError({ detail: 'Khong co id' });
        const productSelect = await product_model_1.default.findOne({ _id: new mongoose_1.Types.ObjectId(id) }).select({ product_desc_image: 1 });
        productSelect?.product_desc_image.forEach(async (product) => {
            await cloundinary_config_1.default.uploader.destroy(product.public_id);
        });
        const productDemo = await product_model_1.default
            .findOneAndUpdate({ _id: new mongoose_1.Types.ObjectId(id) }, { $unset: { product_desc_image: 1 } })
            .lean();
        return { message: productDemo };
    }
    static async getAllProduct(req) {
        const { page, limit } = req.query;
        const PAGE = Number(page);
        const LIMIT = Number(limit);
        const SKIP = LIMIT * (PAGE - 1);
        const products = await product_model_1.default
            .find({ isProductFull: true })
            .skip(SKIP)
            .limit(LIMIT)
            .sort({ product_price: 1 })
            .select({ _id: 1, product_name: 1, product_price: 1, product_thumb_image: 1, product_votes: 1 })
            .lean();
        const count = products.length;
        // await sleep(7000)
        return { products: products, count };
    }
    static async getAllProductCare(req) {
        const products = await product_model_1.default
            .find({ isProductFull: true })
            .limit(18)
            .sort({ product_price: -1 })
            .select({ _id: 1, product_name: 1, product_price: 1, product_thumb_image: 1, product_votes: 1 });
        return { products };
    }
    static async getProductSimilar(req) {
        const { product_type, type, product_id } = req.query;
        const productQuery = { product_type: product_type, _id: { $nin: [new mongoose_1.Types.ObjectId(product_id)] } };
        const products = await product_model_1.default
            .find(productQuery)
            .select({ _id: 1, product_name: 1, product_price: 1, product_thumb_image: 1, product_votes: 1 })
            .limit(35);
        console.log({ products: JSON.stringify(products) });
        return { products };
    }
    static async getProductBestBought(req) {
        const { page, limit } = req.query;
        const PAGE = Number(page);
        const LIMIT = Number(limit);
        const products = await product_model_1.default
            .find({})
            .limit(LIMIT)
            .sort({ product_is_bought: -1 })
            .select({ _id: 1, product_name: 1, product_price: 1, product_thumb_image: 1, product_votes: 1 });
        return { products };
    }
    static async getProductBookAllType(req) {
        const productQuery = { product_type: 'Book' };
        const productQueryManga = { product_type: 'Book', 'attribute.type': 'Manga' };
        const productQueryNovel = { product_type: 'Book', 'attribute.type': 'Novel' };
        const productQueryDetective = { product_type: 'Book', 'attribute.type': 'Detective' };
        const text = await product_repository_1.default.getProductDetai({ product_type: 'Book' });
        const products = await product_model_1.default
            .find(productQuery)
            .select('_id product_thumb_image product_name product_votes product_price');
        const productManga = await product_model_1.default
            .find(productQueryManga)
            .select('_id product_thumb_image product_name product_votes product_price attribute.type');
        const productNovel = await product_model_1.default
            .find(productQueryNovel)
            .select('_id product_thumb_image product_name product_votes product_price attribute.type');
        const productDetective = await product_model_1.default
            .find(productQueryDetective)
            .select('_id product_thumb_image product_name product_votes product_price attribute.type');
        return { products, manga: productManga, novel: productNovel, detective: productDetective, test: text };
    }
    static async getProductFoodAllType(req) {
        const productQuery = { product_type: 'Food' };
        const productQueryFastFood = { product_type: 'Food', 'attribute.type': 'Fast food' };
        const productQueryCannedGood = { product_type: 'Food', 'attribute.type': 'Canned Goods' };
        const productQueryDrinks = { product_type: 'Food', 'attribute.type': 'Drinks' };
        const products = await product_model_1.default
            .find(productQuery)
            .select('_id product_thumb_image product_name product_votes product_price');
        const productFastFood = await product_model_1.default
            .find(productQueryFastFood)
            .select('_id product_thumb_image product_name product_votes product_price attribute.product_food_type');
        const productCannedGood = await product_model_1.default
            .find(productQueryCannedGood)
            .select('_id product_thumb_image product_name product_votes product_price attribute.type');
        const productDrinks = await product_model_1.default
            .find(productQueryDrinks)
            .select('_id product_thumb_image product_name product_votes product_price attribute.type');
        return { products, fastFood: productFastFood, cannedGood: productCannedGood, drinks: productDrinks };
    }
    static async getProductWithId(req) {
        const id = req.params.id;
        const product = await product_model_1.default
            .findOne({ _id: new mongoose_1.default.Types.ObjectId(id), product_state: true })
            .populate({ path: 'shop_id', populate: { path: 'owner', model: 'User', select: { _id: 1 } } });
        const client_id = req.headers[authentication_1.HEADER.CLIENT_ID];
        if (client_id) {
            const foundShop = await shop_model_1.shopModel.findOne({ _id: new mongoose_1.Types.ObjectId(product?.shop_id._id) });
            if (foundShop?.owner.toString() !== client_id) {
                await (0, user_utils_1.userProductSeeUnique)({ user_id: new mongoose_1.Types.ObjectId(client_id), product_id: new mongoose_1.Types.ObjectId(id) });
            }
        }
        const detailComment = await comment_repository_1.default.getCommentDetail({ product_id: new mongoose_1.Types.ObjectId(id) });
        if (!product)
            return { product: null };
        return {
            product,
            totalComment: product.totalComment,
            avg: product.product_votes,
            detailComment
            // demo
        };
    }
    static async getProductWithIdUpdate(req) {
        const id = req.params.id;
        console.log({ id });
        const product = await product_model_1.default.findById({ _id: new mongoose_1.default.Types.ObjectId(id) }).populate('shop_id', 'shop_name');
        const { user } = req;
        const foundShop = await shop_model_1.shopModel.findOne({ owner: user?._id });
        if (!foundShop) {
            throw new response_error_1.ForbiddenError({ detail: 'Sản phẩm thuộc về cửa hàng khác' });
        }
        return { product };
    }
    static async protectProduct(req) {
        const id = req.params.product_id;
        const { user } = req;
        const foundShop = await shop_model_1.shopModel.findOne({ owner: user?._id });
        const foundProduct = await product_model_1.default.findOne({ _id: id, shop_id: foundShop?._id });
        if (!foundShop) {
            // throw new ForbiddenError({ detail: 'Sản phẩm thuộc về cửa hàng khác' })
            return { product: null };
        }
        return { product: foundProduct };
    }
    static async deleteProductWithId(req) {
        const { product_id } = req.params;
        const { user } = req;
        const deleteProduct = await product_model_1.default.findOneAndUpdate({ _id: product_id }, { $set: { product_state: false } }, { new: true, upsert: true });
        if (!deleteProduct)
            throw new response_error_1.BadRequestError({ detail: 'Xóa sản phẩm thất bại' });
        const foundShop = await shop_model_1.shopModel.findOne({ owner: new mongoose_1.Types.ObjectId(user?._id) });
        console.log({ foundShop, user: user?._id, product_id });
        if (foundShop) {
            const deleteProductShop = foundShop?.shop_products.filter((p) => p.toString() !== product_id.toString());
            foundShop.shop_products = deleteProductShop;
            await foundShop.save();
            const calcShop = await shop_repository_1.default.getTotalCommentAndVote({
                shop_id: new mongoose_1.Types.ObjectId(foundShop._id)
            });
            foundShop.shop_vote = calcShop?.shop_vote || 4.5;
            foundShop.shop_count_total_vote = calcShop?.shop_total_comment || 0;
            await foundShop.save();
            console.log({ foundShop, user: user?._id, calcShop });
        }
        // const productShopQuery = { shop_id: new Types.ObjectId(foundShop?._id) }
        // const productShopUpdate = { $set: { products: { state: 'Delete' } } }
        // const productShopOptions = { new: true, upsert: true }
        // await productShopModel.findOneAndUpdate(productShopQuery, productShopUpdate, productShopOptions)
        const query = { notification_user_id: new mongoose_1.Types.ObjectId(user?._id) };
        const update = {
            $push: {
                notifications_message: (0, notification_util_1.renderNotificationSystem)('Bạn đã xóa thành công 1 sản phẩm')
            },
            $inc: { notification_count: 1 }
        };
        const optionNotification = { new: true, upsert: true };
        await notification_model_1.notificationModel.findOneAndUpdate(query, update, optionNotification);
        return { message: 'Xóa thành công' };
    }
    static async getAllProductWithType(req) {
        console.log('OK');
        const { product_type, minVote = 1, maxVote = 5, minPrice = 1, maxPrice = 1000000000, page } = req.query;
        const limit = 2;
        const skipDocument = limit * (Number(page) - 1);
        const products = await product_model_1.default
            .find({
            product_type
        })
            .skip(skipDocument)
            .limit(limit)
            .populate('shop_id');
        let featuredCategory = [];
        const shops = await product_model_1.default.find({ product_type }).populate('shop_id');
        const set = new Set();
        const shop_id = [];
        shops.filter((product) => {
            let index = shop_id.findIndex((shop) => shop._id === product.shop_id._id);
            if (index <= -1) {
                shop_id.push(product.shop_id);
                return;
            }
            return null;
        });
        // const type = await ProductRepository.countProductWithType({ product_type: product_type as ProductType })
        const count = (await product_model_1.default.find({ product_type: product_type })).length;
        const a = await product_model_1.default.find({ 'attribute.product_food_type': 'Fast food' });
        return { products, count, shops: shop_id };
    }
    static async getProductFilter(req) {
        const { page = 1, maxPrice, minPrice, product_type, vote } = req.query;
        const LIMIT = 2;
        const getDocument = LIMIT * (Number(page) - 1);
        console.log({ LIMIT, getDocument });
        const products = await product_model_1.default
            .find({
            product_type,
            product_price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
            product_votes: { $gte: Number(vote) }
        })
            .skip(getDocument)
            .limit(LIMIT);
        return { products };
    }
    static async getProductTopSearch(req) {
        const { limit } = req.query;
        const LIMIT = Number(limit);
        const products = await product_model_1.default.find({}).sort({ product_is_bought: -1 }).skip(0).limit(LIMIT);
        return { products };
    }
}
exports.default = ProductService;
//  Created by Lai Huynh Phat Dat on 25/02/2024.
//
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//
//                _ooOoo_                       NAM MÔ A DI ĐÀ PHẬT !
//               o8888888o
//               88" . "88
//               (| -_- |)
//                O\ = /O
//            ____/`---'\____         Con lạy chín phương trời, con lạy mười phương đất
//            .' \\| |// `.             Chư Phật mười phương, mười phương chư Phật
//           / \\||| : |||// \        Con ơn nhờ Trời đất chổ che, Thánh Thần cứu độ
//         / _||||| -:- |||||- \    Xin nhất tâm kính lễ Hoàng thiên Hậu thổ, Tiên Phật Thánh Thần
//           | | \\\ - /// | |              Giúp đỡ con code sạch ít bug
//         | \_| ''\---/'' | |           Đồng nghiệp vui vẻ, sếp quý tăng lương
//         \ .-\__ `-` ___/-. /          Sức khoẻ dồi dào, tiền vào như nước
//       ___`. .' /--.--\ `. . __
//    ."" '< `.___\_<|>_/___.' >'"". NAM MÔ VIÊN THÔNG GIÁO CHỦ ĐẠI TỪ ĐẠI BI TẦM THANH CỨU KHỔ CỨU NẠN
//   | | : `- \`.;`\ _ /`;.`/ - ` : | |  QUẢNG ĐẠI LINH CẢM QUÁN THẾ ÂM BỒ TÁT
//     \ \ `-. \_ __\ /__ _/ .-` / /
//======`-.____`-.___\_____/___.-`____.-'======
//                `=---='
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//
