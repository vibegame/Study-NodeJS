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
exports.getUserData = void 0;
const Session_model_1 = require("../../../mongoose/models/Session.model");
const User_model_1 = require("../../../mongoose/models/User.model");
const session_1 = require("../session");
const error_1 = require("../error");
exports.getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.token;
    if (!token) {
        return res.status(500).send(new error_1.ResponseError("Not valid token"));
    }
    const foundSession = yield Session_model_1.Session.findOne({
        token
    });
    if (!foundSession) {
        return res.status(500).send(new error_1.ResponseError("Session is not found"));
    }
    if (!session_1.isSessionActive(foundSession)) {
        return res.status(500).send(new error_1.ResponseError("Not active token", "EXPIRATION_OUT"));
    }
    const user = yield User_model_1.User.findOne({
        _id: foundSession.user
    });
    return res.send({
        username: user.username,
        email: user.email
    });
});
//# sourceMappingURL=getUserData.js.map