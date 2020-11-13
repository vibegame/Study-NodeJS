import {Request, Response} from "express";
import {Session} from "../../../mongoose/models/Session.model";
import {User} from "../../../mongoose/models/User.model";
import {isSessionActive} from "../session";
import {ResponseError} from "../error";

interface GetUserDataRequest extends Request {
    body: {
        token: string
    }
}

export const getUserData = async (req: GetUserDataRequest, res: Response) => {
    const token = req.body.token;

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

    const user = await User.findOne({
        _id: foundSession.user
    });

    return res.send({
        username: user.username,
        email: user.email
    });
};
