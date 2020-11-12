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
exports.checkSession = void 0;
const error_1 = require("../error");
const Session_model_1 = require("../../../mongoose/models/Session.model");
const session_1 = require("../session");
exports.checkSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.token;
    if (!token) {
        return res.status(500).send(new error_1.ResponseError("Token is required"));
    }
    const session = yield Session_model_1.Session.findOne({ token });
    if (!session) {
        return res.status(500).send(new error_1.ResponseError("Token is not valid"));
    }
    if (!session_1.isSessionActive(session)) {
        return res.status(500).send(new error_1.ResponseError("Not active token", "EXPIRATION_OUT"));
    }
    return res.status(200).end();
});
//# sourceMappingURL=checkSession.js.map