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
exports.FilesStorage = void 0;
const path = require("path");
const fs = require("fs");
const Terminal_1 = require("../utils/Terminal");
class FilesStorage {
    constructor(dirname) {
        this.filesDirPath = path.resolve(__dirname, "files");
        this.dataFilePath = null;
        this.dataFileName = "__data.json";
        this.data = null;
        this.filesDirPath = path.resolve(this.filesDirPath, dirname);
        this.dataFilePath = path.resolve(this.filesDirPath, this.dataFileName);
        if (!fs.existsSync(this.filesDirPath)) {
            fs.mkdirSync(this.filesDirPath);
        }
        if (!fs.existsSync(this.dataFilePath)) {
            const defaultData = {
                files: []
            };
            fs.writeFileSync(this.dataFilePath, JSON.stringify(defaultData));
        }
        this.data = this.getData();
        this.data.files = this.data.files.filter(fileName => {
            return fs.existsSync(fileName.path);
        });
    }
    getData() {
        if (fs.existsSync(this.dataFilePath)) {
            return JSON.parse(fs.readFileSync(this.dataFilePath));
        }
        Terminal_1.terminal.error("Data file is not exist");
        return null;
    }
    saveFile(file, fileInformation) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path.resolve(this.filesDirPath, fileInformation.filename);
            const fileData = Object.assign(Object.assign({}, fileInformation), { path: filePath });
            if (fs.existsSync(filePath)) {
                yield fs.promises.unlink(filePath);
                this.data.files = this.data.files.filter(({ path }) => path !== fileData.path);
            }
            const writeStream = fs.createWriteStream(filePath);
            file.pipe(writeStream);
            writeStream.on("finish", () => __awaiter(this, void 0, void 0, function* () {
                this.data.files.push(fileData);
                fs.writeFileSync(this.dataFilePath, JSON.stringify(this.data));
            }));
        });
    }
}
exports.FilesStorage = FilesStorage;
//# sourceMappingURL=FilesStorage.js.map