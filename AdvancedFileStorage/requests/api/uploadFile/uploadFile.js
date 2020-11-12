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
exports.uploadFile = void 0;
const error_1 = require("../error");
const Session_model_1 = require("../../../mongoose/models/Session.model");
const session_1 = require("../session");
const User_model_1 = require("../../../mongoose/models/User.model");
const FilesStorage_1 = require("../../../FilesStorage/FilesStorage");
exports.uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requestBusboy = req.busboy;
    let token = null;
    let comment = null;
    req.pipe(requestBusboy);
    requestBusboy.on('field', (fieldName, value) => {
        if (fieldName === "token") {
            token = value;
        }
        if (fieldName === "comment") {
            comment = value;
        }
    });
    requestBusboy.on('file', (fieldName, file, filename) => __awaiter(void 0, void 0, void 0, function* () {
        if (fieldName === "file") {
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
            const { username } = yield User_model_1.User.findOne({
                _id: foundSession.user
            });
            const filesStorage = new FilesStorage_1.FilesStorage(username);
            file.on("end", () => {
                res.sendStatus(200);
            });
            yield filesStorage.saveFile(file, {
                filename,
                timestamp: Date.now(),
                comment
            });
        }
    }));
});
//# sourceMappingURL=uploadFile.js.map