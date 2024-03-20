"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.ForbiddenError = exports.AuthFailedError = exports.BadRequestError = exports.ResponseError = void 0;
const httpStatusCode_1 = require("./httpStatusCode");
class ResponseError extends Error {
    code;
    message;
    detail;
    constructor({ code = httpStatusCode_1.statusCode.INTERNAL_SERVER_ERROR, message = httpStatusCode_1.reasonCode.INTERNAL_SERVER_ERROR, detail = null }) {
        super(message);
        this.code = code;
        this.message = message;
        this.detail = detail;
    }
}
exports.ResponseError = ResponseError;
class BadRequestError extends ResponseError {
    constructor({ code = httpStatusCode_1.statusCode.BAD_REQUEST, message = httpStatusCode_1.reasonCode.BAD_REQUEST, detail = null }) {
        super({ code, message, detail });
    }
}
exports.BadRequestError = BadRequestError;
class AuthFailedError extends ResponseError {
    constructor({ code = httpStatusCode_1.statusCode.UNAUTHORIZED, message = httpStatusCode_1.reasonCode.UNAUTHORIZED, detail = null }) {
        super({ code, message, detail });
    }
}
exports.AuthFailedError = AuthFailedError;
class ForbiddenError extends ResponseError {
    constructor({ code = httpStatusCode_1.statusCode.FORBIDDEN, message = httpStatusCode_1.reasonCode.FORBIDDEN, detail = null }) {
        super({ code, message, detail });
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends ResponseError {
    constructor({ code = httpStatusCode_1.statusCode.NOT_FOUND, message = httpStatusCode_1.reasonCode.NOT_FOUND, detail = null }) {
        super({ code, message, detail });
    }
}
exports.NotFoundError = NotFoundError;
