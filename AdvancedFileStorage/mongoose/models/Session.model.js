"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const mongoose_1 = require("mongoose");
const SessionSchema = new mongoose_1.Schema({
    expiration: {
        type: Date,
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        unique: true
    }
});
exports.Session = mongoose_1.model('sessions', SessionSchema);
//# sourceMappingURL=Session.model.js.map