"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = exports.connectToDatabase = void 0;
const mongoose_1 = require("mongoose");
exports.connectToDatabase = () => mongoose_1.connect('mongodb://localhost/filestorage', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
exports.Database = mongoose_1.connection;
//# sourceMappingURL=Database.js.map