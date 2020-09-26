const fs = require("fs");

const path = require("path");

const dataUrl = path.resolve(__dirname, "data.json");

class FilesData {
    data = null;

    constructor(uploadsFilesUrl) {
        if (!fs.existsSync(uploadsFilesUrl)){
            fs.mkdirSync(uploadsFilesUrl);
        }

        this.data = this.getData();

        this.data.rootUrl = uploadsFilesUrl;

        this.data.files = this.data.files.filter(fileData => {
            return fs.existsSync(fileData.path);
        });

        this.updateData();
    }

    getData = () => {
        if(fs.existsSync(dataUrl)) {
            const data = fs.readFileSync(dataUrl);
            return JSON.parse(data);
        }
        else {
            const defaultData = {
                files: [],
                rootUrl: null
            };
            fs.writeFileSync(dataUrl, JSON.stringify(defaultData));
            return defaultData;
        }

    };

    updateData = () => {
        fs.writeFileSync(dataUrl, JSON.stringify(this.data));
    };

    updateFiles = (files) => {
        this.data.files = files;
        this.updateData();
    };

    getFiles = () => {
        return this.data.files;
    }
}

module.exports = FilesData;
