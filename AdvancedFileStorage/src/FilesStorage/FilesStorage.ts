import * as path from "path";
import * as fs from "fs";
import {terminal} from "../utils/Terminal";

type FilePath = string;

interface FileInformation {
    filename: string,
    comment: string,
    timestamp: Date | number
}

interface SavedFileInformation extends FileInformation {
    path: FilePath
}

interface DataFileInformation {
    files: Array<SavedFileInformation>
}

export class FilesStorage {
    readonly filesDirPath: FilePath = path.resolve(__dirname, "files");
    readonly dataFilePath: FilePath | null = null;
    readonly dataFileName: string = "__data.json";

    data: DataFileInformation | null = null;

    constructor(dirname: string) {
        if(!fs.existsSync(this.filesDirPath)) {
            fs.mkdirSync(this.filesDirPath);
        }

        this.filesDirPath = path.resolve(this.filesDirPath, dirname);
        this.dataFilePath = path.resolve(this.filesDirPath, this.dataFileName);

        if (!fs.existsSync(this.filesDirPath)){
            fs.mkdirSync(this.filesDirPath);
        }

        if(!fs.existsSync(this.dataFilePath)) {
            this.createFileData();
        }

        this.data = this.getData();

        this.data.files = this.data.files.filter(fileName => {
            return fs.existsSync(fileName.path);
        });
    }

    private createFileData() {
        const defaultData: DataFileInformation = {
            files: []
        };
        fs.writeFileSync(this.dataFilePath, JSON.stringify(defaultData));
    }

    private getData():DataFileInformation | null {
        if(fs.existsSync(this.dataFilePath)) {
            return JSON.parse(fs.readFileSync(this.dataFilePath) as unknown as string) as DataFileInformation;
        }
        else {
            this.createFileData();
        }
    }


    async saveFile(file: NodeJS.ReadableStream, fileInformation: FileInformation) {
        const filePath = path.resolve(this.filesDirPath, fileInformation.filename);

        const fileData = {
            ...fileInformation,
            path: filePath
        };

        if(fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            this.data.files = this.data.files.filter(({path}) => path !== fileData.path);
        }

        const writeStream = fs.createWriteStream(filePath);

        file.pipe(writeStream);

        writeStream.on("finish", async () => {
            this.data.files.push(fileData);

            fs.writeFileSync(this.dataFilePath, JSON.stringify(this.data));
        });
    }
}
