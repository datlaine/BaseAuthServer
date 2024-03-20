"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../helpers/asyncHandler");
const location_controller_1 = __importDefault(require("../../controllers/location.controller"));
const locationRouter = (0, express_1.Router)();
// locationRouter.use(authentication)
locationRouter.get('/get-all-province', (0, asyncHandler_1.asyncHandler)(location_controller_1.default.getAllProvince));
locationRouter.get('/get-district', (0, asyncHandler_1.asyncHandler)(location_controller_1.default.getDistrict));
locationRouter.get('/get-ward', (0, asyncHandler_1.asyncHandler)(location_controller_1.default.getWard));
exports.default = locationRouter;
