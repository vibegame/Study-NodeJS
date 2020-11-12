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
exports.register = void 0;
const mail_1 = require("../mail");
const nodemailer_1 = require("nodemailer");
const Terminal_1 = require("../../../utils/Terminal");
const token_1 = require("../token");
const User_model_1 = require("../../../mongoose/models/User.model");
const error_1 = require("../error");
exports.register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Terminal_1.terminal.success("Request to /register");
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
        return res.status(500).send(new error_1.ResponseError("Bad request"));
    }
    if (yield User_model_1.User.findOne({ email })) {
        return res.status(500).send(new error_1.ResponseError("Пользователь с такой почтой уже существует"));
    }
    if (yield User_model_1.User.findOne({ username })) {
        return res.status(500).send(new error_1.ResponseError("Пользователь с таким логином уже существует"));
    }
    const mailToken = token_1.generateMailToken(req.body);
    const mailOptions = {
        from: process.env.TRANSPORT_EMAIL_USERNAME,
        html: mail_1.registrationEmailTemplate({ username, link: mail_1.generateConfirmLink(mailToken) }),
        subject: "Invitation to File Storage ✔",
        to: email
    };
    try {
        const transporter = yield mail_1.getTransporter();
        const info = yield transporter.sendMail(mailOptions);
        Terminal_1.terminal.success(`Sent mail to ${username}: ${nodemailer_1.getTestMessageUrl(info)}`);
        return res.status(200).end();
    }
    catch (err) {
        Terminal_1.terminal.error(err);
        return res.status(500).send(new error_1.ResponseError("Cannot send mail"));
    }
});
//# sourceMappingURL=register.js.map