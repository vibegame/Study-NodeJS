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
exports.updateSessionToken = exports.generateSessionToken = exports.generateMailToken = exports.parseToken = void 0;
const jwt = require("jsonwebtoken");
const uuid_1 = require("uuid");
const session_1 = require("./session");
const { SECRET_HASH_KEY } = process.env;
exports.parseToken = (token) => {
    return jwt.verify(token, SECRET_HASH_KEY);
};
exports.generateMailToken = (data) => jwt.sign(data, SECRET_HASH_KEY);
exports.generateSessionToken = () => uuid_1.v4();
exports.updateSessionToken = (session) => __awaiter(void 0, void 0, void 0, function* () {
    const updateData = {
        expiration: session_1.generateSessionExpiration(),
        token: exports.generateSessionToken()
    };
    yield session.updateOne(updateData);
    return updateData;
});
//# sourceMappingURL=token.js.map