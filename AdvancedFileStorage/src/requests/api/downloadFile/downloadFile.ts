import {Request, Response} from "express";
import {ResponseError} from "../error";
import {Session} from "../../../mongoose/models/Session.model";
import {isSessionActive} from "../session";
import {User} from "../../../mongoose/models/User.model";
import {FilesStorage} from "../../../FilesStorage/FilesStorage";

interface DownloadFileRequest extends Request {
    body: {
        token: string,
        filename: string
    }
}

export const downloadFile = async (req: DownloadFileRequest, res: Response) => {
    const {token, filename} = req.body;

    if(!token) {
        return res.status(500).send(new ResponseError("Token is required"));
    }

    const session = await Session.findOne({token});

    if(!session) {
        return res.status(500).send(new ResponseError("Token is not valid"));
    }

    if(!isSessionActive(session)) {
        return res.status(500).send(new ResponseError("Not active token", "EXPIRATION_OUT"));
    }

    const user = await User.findOne({
        _id: session.user
    });

    const filesStorage = new FilesStorage(user.username);

    const fileIndex = filesStorage.data.files.findIndex((file) => file.filename === filename);

    if(fileIndex === -1) {
        return res.status(500).send(new ResponseError("File didn't found", "FILE_NOT_FOUND"));
    }

    return res.download(filesStorage.data.files[fileIndex].path);
};
