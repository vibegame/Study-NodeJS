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
exports.login = void 0;
const User_model_1 = require("../../../mongoose/models/User.model");
const Session_model_1 = require("../../../mongoose/models/Session.model");
const session_1 = require("../session");
const token_1 = require("../token");
const error_1 = require("../error");
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    let token = null;
    if (!username && !password) {
        return res.status(500).send(new error_1.ResponseError("Bad request"));
    }
    const foundUser = yield User_model_1.User.findOne({
        username,
        password
    });
    if (!foundUser) {
        return res.status(500).send(new error_1.ResponseError("Username or password is not valid"));
    }
    const foundSession = yield Session_model_1.Session.findOne({
        user: foundUser._id
    });
    if (!foundSession) {
        return res.status(500).send(new error_1.ResponseError("Session is not found"));
    }
    token = foundSession.token;
    if (!session_1.isSessionActive(foundSession)) {
        const sessionData = yield token_1.updateSessionToken(foundSession);
        token = sessionData.token;
    }
    return res.send(token);
});
//# sourceMappingURL=login.js.map