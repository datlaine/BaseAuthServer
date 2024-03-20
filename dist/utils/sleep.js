"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sleep = (ms) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res(1);
        }, ms);
    });
};
exports.default = sleep;
