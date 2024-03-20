"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const dotenv_1 = require("dotenv");
const authController_1 = __importDefault(require("../controllers/authController"));
const account_1 = __importDefault(require("./account"));
const product_1 = __importDefault(require("./product"));
const location_1 = __importDefault(require("./location"));
const shop_1 = __importDefault(require("./shop"));
const cart_1 = __importDefault(require("./cart"));
const order_1 = __importDefault(require("./order"));
const notification_1 = __importDefault(require("./notification"));
const comment_1 = __importDefault(require("./comment"));
(0, dotenv_1.config)();
const router = (0, express_1.Router)();
// router.get('/getData', (req, res, next) => {
//       res.json({ data: ['1', '2', '3', '4'] })
// })
// router.get('/v1/api/test', (req: Request<unknown, unknown, unknown, { page: string; name: string }>, res: Response, next: NextFunction) => {
//       const query = req.query.page
//       const name = req.query.name
//       return res.json({ query, name })
// })
//auth
router.use('/v1/api/auth', auth_1.default);
router.use('/v1/api/account', account_1.default);
router.use('/v1/api/product', product_1.default);
router.use('/v1/api/location', location_1.default);
router.use('/v1/api/shop', shop_1.default);
router.use('/v1/api/cart', cart_1.default);
router.use('/v1/api/order', order_1.default);
router.use('/v1/api/notification', notification_1.default);
router.use('/v1/api/comment', comment_1.default);
router.get('/api/oauth/google', authController_1.default.loginWithGoogle);
exports.default = router;
