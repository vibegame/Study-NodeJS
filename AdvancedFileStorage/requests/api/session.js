"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSessionActive = exports.generateSessionExpiration = void 0;
exports.generateSessionExpiration = (ms = 1000 * 60 * 10) => {
    const date = new Date();
    date.setTime(ms + date.getTime());
    return date;
};
exports.isSessionActive = (session) => {
    return session.expiration > new Date();
};
//# sourceMappingURL=session.js.map