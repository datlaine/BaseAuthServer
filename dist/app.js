"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//middlwares
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
// .env
const dotenv_1 = require("dotenv");
// mongosose
const body_parser_1 = __importDefault(require("body-parser"));
const httpStatusCode_1 = require("./Core/httpStatusCode");
const mongo_connect_1 = __importDefault(require("./Database/mongo.connect"));
const routers_1 = __importDefault(require("./routers"));
(0, dotenv_1.config)();
//////START//////
//khởi tạo express
const app = (0, express_1.default)();
//midlewares
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, cors_1.default)({
    credentials: true,
    origin: [
        process.env.MODE === 'DEV' ? 'http://localhost:3001' : process.env.CLIENT_URL,
        'http://localhost:3001',
        process.env.CLIENT_URL
    ],
    exposedHeaders: ['set-cookie']
    // origin: 'http://localhost:3000'
    // origin: '*'
}));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
//Connect -> Database -> Mongo
mongo_connect_1.default.Connect();
app.use('', routers_1.default);
app.use(((error, req, res, next) => {
    console.log('errroHandle', JSON.parse(JSON.stringify(error.stack || 'Not')));
    const code = error.code ? error.code : httpStatusCode_1.statusCode.INTERNAL_SERVER_ERROR;
    const message = error.message ? error.message : httpStatusCode_1.reasonCode.INTERNAL_SERVER_ERROR;
    const detail = error.detail ? error.detail : null;
    return res.status(code).send({ code, message, detail });
}));
const PORT = process.env.MODE === 'DEV' ? 4001 : process.env.PORT;
app.listen(PORT, () => {
    console.log('Server is runing');
});
exports.default = app;
