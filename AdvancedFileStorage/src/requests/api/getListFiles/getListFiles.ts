import {Request, Response} from "express";
import {ResponseError} from "../error";
import {Session} from "../../../mongoose/models/Session.model";
import {User} from "../../../mongoose/models/User.model";
import {isSessionActive} from "../session";
import {FilesStorage} from "../../../FilesStorage/FilesStorage";

interface GetListFilesRequest extends Request {
    body: {
        token: string
    }
}

export const getListFiles = async (req: GetListFilesRequest, res: Response) => {

    const token = req.body.token;

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

    const responseData = filesStorage.data.files.map(({filename, comment, timestamp}) => ({filename, comment, timestamp}));

    return res.send(responseData);

};
