"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_success_1 = require("../Core/response.success");
const comment_service_1 = __importDefault(require("../services/comment.service"));
class CommentController {
    static async addComment(req, res, next) {
        return new response_success_1.OK({ metadata: await comment_service_1.default.addComment(req) }).send(res);
    }
    static async deleteComment(req, res, next) {
        return new response_success_1.OK({ metadata: await comment_service_1.default.deleteComment(req) }).send(res);
    }
    static async meComment(req, res, next) {
        return new response_success_1.OK({ metadata: await comment_service_1.default.getMeComment(req) }).send(res);
    }
    static async getCommentCore(req, res, next) {
        return new response_success_1.OK({ metadata: await comment_service_1.default.getCommentCore(req) }).send(res);
    }
    static async getAllCommentProduct(req, res, next) {
        return new response_success_1.OK({ metadata: await comment_service_1.default.getAllCommentProduct(req) }).send(res);
    }
    static async getAllCommentImage(req, res, next) {
        return new response_success_1.OK({ metadata: await comment_service_1.default.getAllCommentImage(req) }).send(res);
    }
    static async geAllCommentHasImage(req, res, next) {
        return new response_success_1.OK({ metadata: await comment_service_1.default.geAllCommentHasImage(req) }).send(res);
    }
    static async geAllCommentFollowLevel(req, res, next) {
        return new response_success_1.OK({ metadata: await comment_service_1.default.geAllCommentFollowLevel(req) }).send(res);
    }
    static async getAllCommentMe(req, res, next) {
        return new response_success_1.OK({ metadata: await comment_service_1.default.getAllCommentMe(req) }).send(res);
    }
}
exports.default = CommentController;
