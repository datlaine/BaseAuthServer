"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_success_1 = require("../Core/response.success");
const location_service_1 = __importDefault(require("../services/location.service"));
class LocationController {
    static async getAllProvince(req, res, next) {
        return new response_success_1.OK({ metadata: await location_service_1.default.getAllProvince(req) }).send(res);
    }
    static async getDistrict(req, res, next) {
        return new response_success_1.OK({ metadata: await location_service_1.default.getDistrict(req) }).send(res);
    }
    static async getWard(req, res, next) {
        return new response_success_1.OK({ metadata: await location_service_1.default.getWard(req) }).send(res);
    }
}
exports.default = LocationController;
