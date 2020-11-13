import {Request, Response} from "express";

import * as busboy from 'busboy';
import {ResponseError} from "../error";
import {Session} from "../../../mongoose/models/Session.model";
import {isSessionActive} from "../session";
import {User} from "../../../mongoose/models/User.model";
import {FilesStorage} from "../../../FilesStorage/FilesStorage";

interface UploadFileRequest extends Request {
    busboy: busboy.Busboy
}

export const uploadFile = async (req: UploadFileRequest, res: Response) => {
    const requestBusboy = req.busboy;

    let token: string | null = null;
    let comment: string = null;

    req.pipe(requestBusboy);

    requestBusboy.on('field', (fieldName, value) => {
        if(fieldName === "token") {
            token = value;
        }
        if(fieldName === "comment") {
            comment = value;
        }
    });

    requestBusboy.on('file', async (fieldName, file, filename) => {
        if(fieldName === "file") {

            if(!token) {
                return res.status(500).send(new ResponseError("Not valid token"));
            }

            const foundSession = await Session.findOne({
                token
            });

            if(!foundSession) {
                return res.status(500).send(new ResponseError("Session is not found"));
            }

            if(!isSessionActive(foundSession)) {
                return res.status(500).send(new ResponseError("Not active token", "EXPIRATION_OUT"));
            }

            const {username} = await User.findOne({
                _id: foundSession.user
            });

            const filesStorage = new FilesStorage(username);

            file.on("end", () => {
                res.sendStatus(200);
            });

            await filesStorage.saveFile(file, {
                filename,
                timestamp: Date.now(),
                comment
            });
        }
    });
};
