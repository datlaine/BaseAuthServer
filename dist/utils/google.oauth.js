"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoogleUser = exports.getOautGoogleToken = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
// const getOauthGooleToken = async (code: string) => {
//       const body = {
//             code,
//             client_id: process.env.GOOGLE_CLIENT_ID,
//             client_secret: process.env.GOOGLE_CLIENT_SECRET,
//             redirect_uri: process.env.GOOGLE_AUTHORIZED_REDIRECT_URI,
//             grant_type: 'authorization_code'
//       }
//       const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
//             headers: {
//                   'Content-Type': 'application/x-www-form-urlencoded'
//             }
//       })
//       return data
// }
const getOautGoogleToken = async (code) => {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_AUTHORIZED_REDIRECT_URI } = process.env;
    const body = {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_AUTHORIZED_REDIRECT_URI,
        grant_type: 'authorization_code'
    };
    const { data } = await axios_1.default.post('https://oauth2.googleapis.com/token', body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return data;
};
exports.getOautGoogleToken = getOautGoogleToken;
const getGoogleUser = async ({ id_token, access_token }) => {
    const { data } = await axios_1.default.get('https://www.googleapis.com/oauth2/v1/userinfo', {
        params: { access_token, alt: 'json' },
        headers: { Authorization: `Bearer ${id_token}` }
    });
    console.log('data', data);
    return data;
};
exports.getGoogleUser = getGoogleUser;
