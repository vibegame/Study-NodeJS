const express = require("express");

const cors = require("cors");

const bodyParser = require('body-parser');

const morgan = require('morgan');

const fs = require("fs");

const io = require('socket.io').listen(8080);

const app = express();

const busboy = require('connect-busboy');

const FilesData = require("./FilesData/FilesData");

const path = require("path");

io.sockets.on('connection', client => {
    client.emit("tokenId", client.id);
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('tiny'));

app.use(express.static('static'));

const uploadsUrl = path.resolve(__dirname, "uploads")

const filesData = new FilesData(uploadsUrl);

const getFilesData = async () => {
    const files = filesData.getFiles();

    const result = [];

    for(let {path, comment, filename} of files) {
        try {
            const stat = await fs.promises.stat(path);
            result.push({
                filename,
                timestamp: stat.mtimeMs,
                size: stat.size,
                comment
            });
        } catch (e) {}
    }

    return result;
};

app.post('/upload', busboy(), (request, response) => {
    const totalRequestLength = +request.headers["content-length"];

    let totalDownloaded = 0;

    let client = null;

    const requestBusboy = request['busboy'];

    const fileData = {
        filename: null,
        isDownloaded: false,
        path: null,
        writeStream: null,
        comment: null
    };

    request.pipe(requestBusboy);

    request.on("close", () => {
        if(!fileData.isDownloaded) {
            fileData.writeStream.end();
            fs.unlinkSync("./uploads/" + fileData.filename);
        }
    });

    requestBusboy.on('field', function(fieldName, value) {
        if(fieldName === "tokenId") {
            client = io.sockets.sockets[value];
        }
        if(fieldName === "comment") {
            fileData.comment = value;
        }
    });

    requestBusboy.on('file', (fieldName, file, filename, mimetype) => {  // это событие возникает, когда в запросе обнаруживается файл
        if(fieldName === 'file') {
            fileData.filename = filename;
            fileData.path = path.resolve(uploadsUrl, filename);
            fileData.writeStream = fs.createWriteStream(fileData.path);

            file.pipe(fileData.writeStream);

            file.on('data', function(data) {
                totalDownloaded += data.length;

                const progress = (totalDownloaded / totalRequestLength * 100).toFixed(1);

                client.emit("progress", {
                    type: "PROGRESS",
                    progress
                });
            });

            file.on("end", function () {
                fileData.isDownloaded = true;
            });

            fileData.writeStream.on("finish", async () => {
                filesData.data.files.push({
                    filename: fileData.filename,
                    path: fileData.path,
                    comment: fileData.comment
                });
                filesData.updateData();
                client.emit("progress", {
                    type: "END"
                });
                response.send(JSON.stringify(await getFilesData()));
            });
        }
    });
});

app.get("/get-files", async function (request, response) {
    response.send(JSON.stringify(await getFilesData()));
});

app.post("/download-file", function (request, response) {
    response.download(path.resolve(uploadsUrl, request.body.filename));
});

app.listen(80, () => {
    console.log("FileStorage is running on port 80");
});

