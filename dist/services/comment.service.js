"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const response_error_1 = require("../Core/response.error");
const authentication_1 = require("../middlewares/authentication");
const comment_model_1 = require("../models/comment.model");
const notification_model_1 = require("../models/notification.model");
const product_model_1 = __importDefault(require("../models/product.model"));
const shop_model_1 = require("../models/shop.model");
const comment_repository_1 = __importDefault(require("../repositories/comment.repository"));
const shop_repository_1 = __importDefault(require("../repositories/shop.repository"));
const notification_util_1 = require("../utils/notification.util");
const sleep_1 = __importDefault(require("../utils/sleep"));
const uploadCloudinary_1 = __importDefault(require("../utils/uploadCloudinary"));
class CommentService {
    static async addComment(req) {
        const { content, countStar, product_id } = req.body;
        const { state, mode } = req.query;
        const { user } = req;
        //@comment section
        const commentQuery = {
            comment_product_id: new mongoose_1.Types.ObjectId(product_id),
            comment_user_id: new mongoose_1.Types.ObjectId(user?._id)
        };
        let commentUpdate = {};
        const option = { new: true, upsert: true };
        //@comment image
        if (state === 'file') {
            const { file } = req;
            if (!file)
                throw new response_error_1.BadRequestError({ detail: 'Missing File' });
            const folder = `user/${user?._id}/comment`;
            const result = await (0, uploadCloudinary_1.default)(file, folder);
            commentUpdate = {
                $set: {
                    comment_user_id: new mongoose_1.Types.ObjectId(user?._id),
                    comment_content: content ? content : '',
                    comment_product_id: new mongoose_1.Types.ObjectId(product_id),
                    comment_vote: Number(countStar),
                    comment_image: { secure_url: result.secure_url, public_id: result.public_id }
                }
            };
        }
        if (state === 'no-file') {
            commentUpdate = {
                $set: {
                    comment_user_id: new mongoose_1.Types.ObjectId(user?._id),
                    comment_content: content || '',
                    comment_product_id: new mongoose_1.Types.ObjectId(product_id),
                    comment_vote: Number(countStar)
                }
            };
        }
        const commentDocument = await comment_model_1.commentModel.findOneAndUpdate(commentQuery, commentUpdate, option);
        //@product section
        const calcVoteAgain = await comment_repository_1.default.calcTotalAndAvgProduct({
            product_id: new mongoose_1.Types.ObjectId(product_id)
        });
        const productQuery = { _id: new mongoose_1.Types.ObjectId(product_id) };
        let productUpdate;
        if (mode === 'UPLOAD') {
            productUpdate = {
                $set: { product_votes: Number(calcVoteAgain?.avgProductVote || countStar) },
                $inc: { totalComment: 1 }
            };
        }
        else {
            productUpdate = {
                $set: { product_votes: Number(calcVoteAgain?.avgProductVote || countStar) }
            };
        }
        const productOption = { new: true, upsert: true };
        const productDoc = await product_model_1.default
            .findOneAndUpdate(productQuery, productUpdate, productOption)
            .populate({ path: 'shop_id', select: { _id: 1 } });
        //@shop section
        const shop_id = productDoc?.shop_id._id;
        const calcShop = await shop_repository_1.default.getTotalCommentAndVote({
            shop_id: new mongoose_1.Types.ObjectId(shop_id)
        });
        const shopQuery = { _id: new mongoose_1.Types.ObjectId(shop_id) };
        const shopUpdate = {
            shop_vote: calcShop.shop_vote,
            shop_count_total_vote: calcShop.shop_total_comment
        };
        await shop_model_1.shopModel.findOneAndUpdate(shopQuery, shopUpdate);
        //@notification section
        const notificationQuery = { notification_user_id: new mongoose_1.Types.ObjectId(user?._id) };
        const notificationUpdate = { push: { notifications_message: [(0, notification_util_1.renderNotificationSystem)('Bạn vừa đăng một nhận xét')] } };
        const notificationOption = { new: true, upsert: true };
        await notification_model_1.notificationModel.findOneAndUpdate(notificationQuery, notificationUpdate, notificationOption);
        return { comment: commentDocument };
    }
    static async deleteComment(req) {
        const { product_id } = req.query;
        const { user } = req;
        //@comment section
        const commentQuery = {
            comment_user_id: new mongoose_1.Types.ObjectId(user?._id),
            comment_product_id: new mongoose_1.Types.ObjectId(product_id)
        };
        const commentDocument = await comment_model_1.commentModel.findOne(commentQuery);
        if (!commentDocument) {
            return new response_error_1.NotFoundError({ detail: 'Không tìm thấy comment' });
        }
        //@product section
        const productQuery = { _id: new mongoose_1.Types.ObjectId(commentDocument?.comment_product_id) };
        const foundProduct = await product_model_1.default.findOne(productQuery).populate({ path: 'shop_id', select: { _id: 1 } });
        if (!foundProduct) {
            return new response_error_1.NotFoundError({ detail: 'Không tìm thấy sản phẩm' });
        }
        //star =(( lấy tổng comment * số lượng votes) - số votes bị xóa) / (tổng số lượng comment  - 1)
        const calcAvg = foundProduct?.totalComment * foundProduct?.product_votes - commentDocument?.comment_vote;
        const totalCommentNew = foundProduct.totalComment - 1 > 0 ? foundProduct.totalComment - 1 : 0;
        let star = 0;
        if (totalCommentNew === 0) {
            star = 4.5;
        }
        else {
            star = calcAvg / totalCommentNew || 0;
        }
        ;
        (foundProduct.totalComment -= 1), (foundProduct.product_votes = star);
        await foundProduct.save();
        //@shop section
        const shop_id = foundProduct.shop_id._id;
        const calcShop = await shop_repository_1.default.getTotalCommentAndVote({
            shop_id: new mongoose_1.Types.ObjectId(shop_id)
        });
        const shopQuery = { _id: new mongoose_1.Types.ObjectId(shop_id) };
        const shopUpdate = { $set: { shop_vote: calcShop.shop_vote, shop_count_total_vote: calcShop.shop_total_comment } };
        await shop_model_1.shopModel.findOneAndUpdate(shopQuery, shopUpdate);
        const deleteComment = await comment_model_1.commentModel.deleteOne(commentQuery);
        if (!deleteComment) {
            return new response_error_1.BadRequestError({ detail: 'Xóa không thành công' });
        }
        await (0, sleep_1.default)(5000);
        return { message: `Đã xóa thành công comment id ${commentDocument._id}` };
    }
    static async getCommentCore(req) {
        const { product_id } = req.query;
        const product = await product_model_1.default.findOne({ _id: new mongoose_1.Types.ObjectId(product_id) });
        const calcVoteAgain = await comment_repository_1.default.calcTotalAndAvgProduct({
            product_id: new mongoose_1.Types.ObjectId(product_id)
        });
        const detailComment = await comment_repository_1.default.getCommentDetail({ product_id: new mongoose_1.Types.ObjectId(product_id) });
        return {
            totalCommentProduct: calcVoteAgain?.totalComment,
            comment_avg: calcVoteAgain?.avgProductVote,
            detailComment,
            vote: product?.product_votes
        };
    }
    static async getMeComment(req) {
        const { user } = req;
        const { product_id } = req.query;
        const commentQuery = {
            comment_user_id: new mongoose_1.Types.ObjectId(user?._id),
            comment_product_id: new mongoose_1.Types.ObjectId(product_id)
        };
        const comment = await comment_model_1.commentModel
            .findOne(commentQuery)
            .populate({ path: 'comment_product_id', select: { product_name: 1, product_thumb_image: 1 } })
            .populate({
            path: 'comment_user_id',
            select: { avatar: 1, avatar_default_url: 1, createAt: 1, createdAt: 1, fullName: 1, nickName: 1, email: 1 }
        });
        return { comment };
    }
    static async getAllCommentMe(req) {
        const { user } = req;
        const { page, limit } = req.query;
        const LIMIT = Number(limit);
        const SKIP = LIMIT * (Number(page) - 1);
        const commentQuery = { comment_user_id: new mongoose_1.Types.ObjectId(user?._id) };
        const commentPopulateUser = {
            path: 'comment_user_id',
            select: { avatar: 1, nickName: 1, email: 1, fullName: 1, avatar_default_url: 1, createdAt: 1 }
        };
        const commentPopulateProduct = {
            path: 'comment_product_id',
            select: { product_name: 1, product_thumb_image: 1, _id: 1 }
        };
        const comments = await comment_model_1.commentModel
            .find(commentQuery)
            .skip(SKIP)
            .limit(LIMIT)
            .populate(commentPopulateUser)
            .populate(commentPopulateProduct)
            .sort({ comment_date: -1 });
        const total = await comment_repository_1.default.getAllCommentMe({ comment_user_id: new mongoose_1.Types.ObjectId(user?._id) });
        return { comments, total: total?.total || 0 };
    }
    static async getAllCommentProduct(req) {
        const { product_id, page, limit } = req.query;
        const client_id = req.headers[authentication_1.HEADER.CLIENT_ID];
        console.log({ client_id });
        const LIMIT = Number(limit);
        const skip = LIMIT * (Number(page) - 1);
        const commentPopulate = {
            path: 'comment_user_id',
            select: { avatar: 1, nickName: 1, email: 1, fullName: 1, avatar_default_url: 1, createdAt: 1 }
        };
        const total = await comment_repository_1.default.getTotalCommentPage({
            product_id: new mongoose_1.Types.ObjectId(product_id)
        });
        if (client_id) {
            const total = await comment_repository_1.default.getTotalCommentPage({
                product_id: new mongoose_1.Types.ObjectId(product_id),
                user_id: new mongoose_1.Types.ObjectId(client_id)
            });
            const commentQuery = {
                comment_product_id: new mongoose_1.Types.ObjectId(product_id),
                comment_user_id: { $nin: [new mongoose_1.Types.ObjectId(client_id)] }
            };
            const commentDocument = await comment_model_1.commentModel
                .find(commentQuery)
                .populate(commentPopulate)
                .sort({ comment_date: -1 })
                .skip(skip)
                .limit(LIMIT);
            return { comments: commentDocument, total: total?.total || 0 };
        }
        const commentQuery = {
            comment_product_id: new mongoose_1.Types.ObjectId(product_id)
        };
        const commentDocument = await comment_model_1.commentModel
            .find(commentQuery)
            .populate(commentPopulate)
            .sort({ comment_date: -1 })
            .skip(skip)
            .limit(LIMIT);
        return { comments: commentDocument, total: total?.total || 0 };
    }
    static async geAllCommentHasImage(req) {
        const { product_id, limit, page, minVote = 1, maxVote = 5 } = req.query;
        const LIMIT = Number(limit);
        const SKIP = LIMIT * (Number(page) - 1);
        const MIN_VOTE = Number(minVote);
        const MAX_VOTE = Number(maxVote);
        let result;
        const user_id = req.headers[authentication_1.HEADER.CLIENT_ID];
        if (user_id) {
            const commentQuery = {
                comment_image: { $exists: true, $ne: [] },
                comment_product_id: new mongoose_1.Types.ObjectId(product_id),
                comment_vote: { $gte: MIN_VOTE, $lte: MAX_VOTE },
                comment_user_id: { $nin: [new mongoose_1.Types.ObjectId(user_id)] }
            };
            result = await comment_model_1.commentModel
                .find(commentQuery)
                .populate({
                path: 'comment_user_id',
                select: { name: 1, nickName: 1, fullName: 1, email: 1, avatar: 1, avatar_default_url: 1, createdAt: 1 }
            })
                .skip(SKIP)
                .sort({ comment_vote: -1 })
                .limit(LIMIT);
        }
        if (!user_id) {
            const commentQuery = {
                comment_image: { $exists: true, $ne: [] },
                comment_product_id: new mongoose_1.Types.ObjectId(product_id),
                comment_vote: { $gte: MIN_VOTE, $lte: MAX_VOTE }
            };
            result = await comment_model_1.commentModel
                .find(commentQuery)
                .populate({
                path: 'comment_user_id',
                select: { name: 1, nickName: 1, fullName: 1, email: 1, avatar: 1, avatar_default_url: 1, createdAt: 1 }
            })
                .skip(SKIP)
                .sort({ comment_vote: -1 })
                .limit(LIMIT);
        }
        const total = (await comment_repository_1.default.getTotalCommentHasImage({
            product_id: new mongoose_1.Types.ObjectId(product_id),
            user_id: new mongoose_1.Types.ObjectId(user_id),
            minVote: MIN_VOTE,
            maxVote: MAX_VOTE
        }));
        return { comments: result, total: total?.total || 0 };
    }
    static async geAllCommentFollowLevel(req) {
        const { product_id, minVote = 1, maxVote = 5, page, limit } = req.query;
        const LIMIT = Number(limit);
        const PAGE = Number(page);
        const SKIP = LIMIT * (PAGE - 1);
        const MIN_VOTE = Number(minVote);
        const MAX_VOTE = Number(maxVote);
        let result;
        const user_id = req.headers[authentication_1.HEADER.CLIENT_ID];
        if (user_id) {
            const commentQuery = {
                comment_product_id: new mongoose_1.Types.ObjectId(product_id),
                comment_vote: { $gte: MIN_VOTE, $lte: MAX_VOTE },
                comment_user_id: { $nin: [new mongoose_1.Types.ObjectId(user_id)] }
            };
            result = await comment_model_1.commentModel
                .find(commentQuery)
                .populate({
                path: 'comment_user_id',
                select: { name: 1, nickName: 1, fullName: 1, email: 1, avatar: 1, avatar_default_url: 1, createdAt: 1 }
            })
                .skip(SKIP)
                .limit(LIMIT)
                .sort({ comment_vote: -1 });
        }
        if (!user_id) {
            const commentQuery = {
                comment_product_id: new mongoose_1.Types.ObjectId(product_id),
                comment_vote: { $gte: MIN_VOTE, $lte: MAX_VOTE }
            };
            result = await comment_model_1.commentModel
                .find(commentQuery)
                .sort({ comment_vote: -1 })
                .populate({
                path: 'comment_user_id',
                select: { name: 1, nickName: 1, email: 1, fullName: 1, avatar: 1, avatar_default_url: 1, createdAt: 1 }
            })
                .skip(SKIP)
                // .sort({ comment_vote: -1 })
                .limit(LIMIT);
        }
        const total = (await comment_repository_1.default.getTotalCommentFilterLevel({
            product_id: new mongoose_1.Types.ObjectId(product_id),
            user_id: new mongoose_1.Types.ObjectId(user_id),
            minVote: MIN_VOTE,
            maxVote: MAX_VOTE
        }));
        console.log({ result });
        return { comments: result, total: total?.total || 0 };
    }
    static async getAllCommentImage(req) {
        const { product_id } = req.query;
        const getAllCommentImage = await comment_repository_1.default.getImageCommentAll({
            product_id: new mongoose_1.Types.ObjectId(product_id)
        });
        return { comment_images: getAllCommentImage?.comment_images || [] };
    }
}
exports.default = CommentService;
