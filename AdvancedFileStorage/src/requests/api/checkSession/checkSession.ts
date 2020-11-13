import {Response, Request} from "express";
import {ResponseError} from "../error";
import {Session} from "../../../mongoose/models/Session.model";
import {isSessionActive} from "../session";

interface CheckSessionRequest extends Request {
    body: {
        token: string
    }
}

export const checkSession = async (req: CheckSessionRequest, res: Response) => {
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

    return res.status(200).end();
};
