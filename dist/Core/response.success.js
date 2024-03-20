"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OK = exports.ResponseSuccess = exports.CREATE = void 0;
const httpStatusCode_1 = require("./httpStatusCode");
class ResponseSuccess {
    code;
    message;
    metadata;
    constructor({ code = 200, message = 'Success', metadata = {} }) {
        ;
        (this.code = code), (this.message = message);
        this.metadata = metadata;
    }
    send(res) {
        return res.json(this);
    }
}
exports.ResponseSuccess = ResponseSuccess;
class CREATE extends ResponseSuccess {
    constructor({ code = httpStatusCode_1.statusCode.CREATED, message = httpStatusCode_1.reasonCode.CREATED, metadata = {} }) {
        super({ code, message, metadata });
    }
    send(res) {
        return super.send(res);
    }
}
exports.CREATE = CREATE;
class OK extends ResponseSuccess {
    constructor({ code = httpStatusCode_1.statusCode.OK, message = httpStatusCode_1.reasonCode.OK, metadata = {} }) {
        super({ code, message, metadata });
    }
    send(res) {
        return super.send(res);
    }
}
exports.OK = OK;
