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
exports.confirmAccount = void 0;
const Terminal_1 = require("../../../utils/Terminal");
const User_model_1 = require("../../../mongoose/models/User.model");
const token_1 = require("../token");
const toLoginPage_1 = require("../../../redirects/toLoginPage");
const Session_model_1 = require("../../../mongoose/models/Session.model");
const session_1 = require("../session");
const FilesStorage_1 = require("../../../FilesStorage/FilesStorage");
exports.confirmAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    if (!token) {
        return res.send("Invalid link");
    }
    const decoded = token_1.parseToken(token);
    if (decoded.username &&
        decoded.email &&
        decoded.password) {
        const sessionToken = token_1.generateSessionToken();
        const sessionExpiration = session_1.generateSessionExpiration();
        try {
            const user = yield new User_model_1.User({
                username: decoded.username,
                email: decoded.email,
                password: decoded.password,
            }).save();
            yield new Session_model_1.Session({
                expiration: sessionExpiration,
                token: sessionToken,
                user: user._id
            }).save();
            new FilesStorage_1.FilesStorage(decoded.username);
            return toLoginPage_1.redirectToLoginPage(res);
        }
        catch (error) {
            Terminal_1.terminal.error(error);
            return res.send("Unknown error");
        }
    }
});
//# sourceMappingURL=confirmAccount.js.map