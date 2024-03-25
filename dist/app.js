"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//middlwares
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// .env
const dotenv_1 = require("dotenv");
// mongosose
const routers_1 = __importDefault(require("./routers"));
const mongo_connect_1 = __importDefault(require("./Database/mongo.connect"));
const httpStatusCode_1 = require("./Core/httpStatusCode");
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const notification_util_1 = require("./utils/notification.util");
(0, dotenv_1.config)();
//////START//////
//khởi tạo express
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server);
global._io = io; // cach 2
//midlewares
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, cors_1.default)({
    credentials: true,
    origin: [process.env.CLIENT_URL],
    exposedHeaders: ['set-cookie']
    // origin: 'http://localhost:3000'
    // origin: '*'
}));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
console.log((0, notification_util_1.renderNotificationSystem)('Xin chào'));
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
server.listen(process.env.PORT, () => {
    console.log('Server is runing');
});
exports.default = app;
