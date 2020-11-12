"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrationEmailTemplate = exports.getTransporter = exports.generateConfirmLink = void 0;
const nodemailer_1 = require("nodemailer");
exports.generateConfirmLink = (token) => `http://localhost:${process.env.PORT}/api/confirm-account/${token}`;
exports.getTransporter = () => __awaiter(void 0, void 0, void 0, function* () {
    return nodemailer_1.createTransport({
        host: process.env.TRANSPORT_EMAIL_SMTP,
        auth: {
            user: process.env.TRANSPORT_EMAIL_USERNAME,
            pass: process.env.TRANSPORT_EMAIL_PASSWORD
        },
        port: 587,
        secure: false,
    });
});
exports.registrationEmailTemplate = ({ username, link }) => (`
        <h3>Hello, ${username}</h3>
        <a href="${link}">Confirm email</a>
    `);
//# sourceMappingURL=mail.js.map