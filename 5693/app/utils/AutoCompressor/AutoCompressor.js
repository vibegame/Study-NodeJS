const fs = require('fs');

const gzip = require('../gzip');

const path = require("path");
const Stream = require("./Stream");

const {CustomConsoles} = require("../CustomConsole/CustomConsoles");

const gzipStream = new Stream();

class AutoCompressor {
    static compress = (rootUrl) => {

        rootUrl = path.resolve(rootUrl);

        const onDirectoryRead = (error, files) => {
            if(files.length === 0) {
                CustomConsoles.secondary(`${rootUrl} -> Папка пустая!`);
            } else {
                files.forEach(file => {
                    const fileUrl = path.join(rootUrl, file);

                    const getGzipFormattedFileUrl = fileUrl => {
                        const parsedFileUrl = path.parse(fileUrl);
                        parsedFileUrl.name += parsedFileUrl.ext;
                        parsedFileUrl.ext = ".gz";
                        parsedFileUrl.base = parsedFileUrl.name + parsedFileUrl.ext;
                        return path.format(parsedFileUrl);
                    };

                    if(path.parse(fileUrl).ext !== ".gz") {
                        CustomConsoles.info(`⚡ ${fileUrl} -> Анализируем...`);
                        fs.stat(fileUrl, (error, fileStats) => {
                            if (fileStats.isFile() && path.extname(file) !== ".gz") {
                                const gzipFormattedFileUrl = getGzipFormattedFileUrl(fileUrl);

                                fs.stat(gzipFormattedFileUrl, (error, zippedFileStats) => {
                                    if(error) {
                                        CustomConsoles.info(`❤ ${fileUrl} -> У файла нет сжатой версии. Создаём...`);
                                        gzipStream.exec(async () => {
                                            await gzip(
                                                fs.createReadStream(fileUrl),
                                                fs.createWriteStream(gzipFormattedFileUrl)
                                            ).then(() => {
                                                CustomConsoles.success(`Создана сжатая версия для файла ${file}(${fileUrl})`);
                                            });
                                        });
                                    } else {
                                        if (fileStats.mtimeMs > zippedFileStats.mtimeMs) {
                                            CustomConsoles.success(`❤ ${fileUrl} -> У файла устарела сжатая версия. Обновляем...`);
                                            gzipStream.exec(async () => {
                                                await gzip(
                                                    fs.createReadStream(fileUrl),
                                                    fs.createWriteStream(gzipFormattedFileUrl)
                                                ).then(() => {
                                                    CustomConsoles.success(`Обновлена сжатая версия для файла ${file}(${fileUrl})`);
                                                });
                                            });
                                        }
                                        else {
                                            CustomConsoles.warn(`${fileUrl} -> Для файла уже есть свежая сжатая версия...`);
                                        }
                                    }
                                });
                            }
                            else if (fileStats.isDirectory()) {
                                this.compress(fileUrl);
                            }
                        });
                    }
                });
            }
        };

        try {
            if(fs.existsSync(rootUrl)) {
                if(fs.statSync(rootUrl).isDirectory()) {
                    CustomConsoles.secondary(`❤ ${rootUrl} -> Сканируем папку...`);
                    fs.readdir(rootUrl, onDirectoryRead);
                }
                else {
                    throw new Error("Это не папка")
                }
            }
            else {
                throw new Error("Такой папки не существует")
            }
        } catch (error) {
            CustomConsoles.error(error.message);
            throw error;
        }
    };
}

module.exports = AutoCompressor;
