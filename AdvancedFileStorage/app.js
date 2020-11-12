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
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const ApiRouter_1 = require("./requests/api/ApiRouter");
const cors = require("cors");
const bodyParser = require("body-parser");
const Terminal_1 = require("./utils/Terminal");
const Database_1 = require("./mongoose/Database");
const path = require("path");
const runApplication = ({ port }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Terminal_1.terminal.success("Connecting to MongoDB");
        yield Database_1.connectToDatabase();
        Terminal_1.terminal.success("Connected to MongoDB");
    }
    catch (error) {
        Terminal_1.terminal.error("Failed connected to MongoDB", error);
        process.exit(0);
    }
    const app = express();
    app.use('/static', express.static(path.join(__dirname, '/public/static')));
    app.get('*', function (req, res) {
        res.sendFile('index.html', { root: path.join(__dirname, '/public') });
    });
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use("/api", ApiRouter_1.ApiRouter);
    const appListener = app.listen(port, () => {
        Terminal_1.terminal.success(`App is working on http://localhost:${appListener.address().port}`);
    });
});
runApplication({
    port: process.env.PORT || 443
});
//# sourceMappingURL=app.js.map