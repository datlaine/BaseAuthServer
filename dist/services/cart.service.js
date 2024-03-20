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
const cart_modal_1 = require("../models/cart.modal");
const product_model_1 = __importDefault(require("../models/product.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
class CartService {
    static async createCart({ user_id, product }) {
        const query = { cart_user_id: new mongoose_1.Types.ObjectId(user_id) };
        const update = {
            $addToSet: {
                cart_products: product
            },
            $inc: { cart_count_product: 1 }
        };
        const option = { new: true, upsert: true };
        const userCart = await cart_modal_1.cartModel.findOneAndUpdate(query, update, option);
        return { cart: userCart };
    }
    static async addCart(req) {
        const { user } = req;
        const { product } = req.body;
        const checkProduct = await product_model_1.default.findOne({ _id: new mongoose_1.Types.ObjectId(product.product_id) });
        if (checkProduct.product_available < product.quantity) {
            throw new response_error_1.BadRequestError({ detail: 'Số lượng sản phẩm được chọn nhiều hơn số lượng trong kho' });
        }
        console.log(checkProduct?.product_available, product.quantity);
        const userCart = await cart_modal_1.cartModel.findOne({ cart_user_id: new mongoose_1.Types.ObjectId(user?._id) });
        // const
        if (!userCart) {
            return await CartService.createCart({ user_id: user?._id, product });
        }
        if (userCart.cart_products.length === 0) {
            userCart.cart_products = [product];
            userCart.cart_count_product += 1;
            return { cart: await userCart.save() };
        }
        const foundProduct = await cart_modal_1.cartModel.findOne({
            cart_user_id: new mongoose_1.Types.ObjectId(user?._id),
            'cart_products.product_id': product.product_id
        });
        if (!foundProduct) {
            const query = { cart_user_id: new mongoose_1.Types.ObjectId(user?._id) };
            const update = { $addToSet: { cart_products: product }, $inc: { cart_count_product: 1 } };
            const option = { new: true, upsert: true };
            const cart = await cart_modal_1.cartModel.findOneAndUpdate(query, update, option);
            console.log({ cart, product });
            return { cart };
        }
        const query = { cart_user_id: new mongoose_1.Types.ObjectId(user?._id), 'cart_products.product_id': product.product_id };
        const update = { $inc: { 'cart_products.$.quantity': product.quantity } };
        const option = { new: true, upsert: true };
        const cart = await cart_modal_1.cartModel.findOneAndUpdate(query, update, option);
        return { cart };
    }
    static async getCountProductCart(req) {
        const { user } = req;
        const countCart = await cart_modal_1.cartModel.findOne({ cart_user_id: new mongoose_1.default.Types.ObjectId(user?._id) });
        return { count: countCart?.cart_count_product };
    }
    static async getMyCart(req) {
        const { user } = req;
        const foundCart = await cart_modal_1.cartModel
            .findOne({ cart_user_id: user?._id })
            .populate({
            path: 'cart_products.product_id',
            select: {
                product_thumb_image: 1,
                product_price: 1,
                product_name: 1,
                product_id: 1,
                product_state: 1
            }
        })
            .populate({
            path: 'cart_products.shop_id',
            select: {
                shop_name: 1,
                shop_avatar: 1,
                shop_avatar_default: 1
            }
        });
        return { cart: foundCart ? foundCart : { cart_products: [] } };
    }
    static async changeQuantityProductCart(req) {
        const { user } = req;
        const { mode, quantity, product_id } = req.body;
        console.log({ body: req.body });
        const query = { cart_user_id: new mongoose_1.Types.ObjectId(user?._id), 'cart_products.product_id': product_id };
        const option = { new: true, upsert: true };
        if (mode === 'DECREASE') {
            const update = { $inc: { 'cart_products.$.quantity': quantity } };
            const result = await cart_modal_1.cartModel.findOneAndUpdate(query, update, option);
            const foundProduct = result?.cart_products.find((product) => product.product_id.toString() === product_id);
            return { quantity: foundProduct?.quantity };
        }
        if (mode === 'INCREASE') {
            const update = { $inc: { 'cart_products.$.quantity': quantity } };
            const result = await cart_modal_1.cartModel.findOneAndUpdate(query, update, option);
            const foundProduct = result?.cart_products.find((product) => product.product_id.toString() === product_id);
            return { quantity: foundProduct?.quantity };
        }
        if (mode === 'INPUT') {
            const update = { $set: { 'cart_products.$.quantity': quantity } };
            const result = await cart_modal_1.cartModel.findOneAndUpdate(query, update, option);
            const foundProduct = result?.cart_products.find((product) => product.product_id.toString() === product_id);
            return { quantity: foundProduct?.quantity };
        }
    }
    static async selectAllCart(req) {
        const { user } = req;
        const { select } = req.body;
        const product_list_id = await product_model_1.default.distinct('_id', { product_state: true });
        const updateAllCart = await cart_modal_1.cartModel.updateMany({ cart_user_id: new mongoose_1.Types.ObjectId(user?._id), cart_product_id: { $in: product_list_id } }, { $set: { cart_is_select: select } }, { new: true });
        const cartSelectAll = await cart_modal_1.cartModel.findOneAndUpdate({ cart_user_id: new mongoose_1.Types.ObjectId(user?._id) }, { $set: { cart_select_all: select, 'cart_products.$[].isSelect': select } }, { new: true, upsert: true });
        return { cart: cartSelectAll };
    }
    static async selectOneCart(req) {
        const { product_id, value } = req.body;
        const { user } = req;
        const query = { cart_user_id: new mongoose_1.Types.ObjectId(user?._id), 'cart_products.product_id': product_id };
        const update = { $set: { 'cart_products.$.isSelect': value } };
        const option = { new: true, upsert: true };
        const updateCart = await cart_modal_1.cartModel.findOneAndUpdate(query, update, option);
        const result = updateCart?.cart_products.find((product) => product.product_id.toString() === product_id.toString());
        console.log({ updateCart: JSON.stringify(updateCart) });
        return { cartUpdateItem: result };
    }
    static async getCartWithId(req) {
        const { cart_id } = req.params;
        const { user } = req;
        const query = { user };
        const foundCart = await user_model_1.default.findOne({});
    }
    static async calculatorPrice(req) {
        const { user } = req;
        const carts = await cart_modal_1.cartModel.findOne({ cart_user_id: new mongoose_1.Types.ObjectId(user?._id) }).populate({
            path: 'cart_products.product_id',
            select: 'product_price product_thumb_image product_available'
        });
        const filterCarts = carts?.cart_products.filter((product) => product.isSelect === true);
        return { carts: { cart_products: filterCarts } };
    }
    static async deleteCart(req) {
        const { product_id } = req.params;
        const { user } = req;
        const query = { cart_user_id: new mongoose_1.Types.ObjectId(user?._id), 'cart_products._id': product_id };
        const update = { $pull: { cart_products: { _id: product_id } }, $inc: { cart_count_product: -1 } };
        const option = { new: true, upsert: true };
        const deleteCart = await cart_modal_1.cartModel.findOneAndUpdate(query, update, option);
        if (!deleteCart)
            return { message: 'Xóa thất bại' };
        return { message: 'Xóa thành công' };
    }
    static async updateAddressCart(req) {
        const { payload } = req.body;
        console.log({ body: req.body });
        const { product_id, address_full } = payload;
        const { user } = req;
        const query = { cart_user_id: new mongoose_1.Types.ObjectId(user?._id), 'cart_products.product_id': product_id };
        const update = { 'cart_products.$.cart_address': address_full };
        const option = { new: true, upsert: true };
        const cartItem = await cart_modal_1.cartModel.findOneAndUpdate(query, update, option);
        return { cart: cartItem };
    }
}
exports.default = CartService;
