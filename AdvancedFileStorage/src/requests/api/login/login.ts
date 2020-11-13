import {Request, Response} from 'express';
import {User} from "../../../mongoose/models/User.model";
import {LoginFields} from "../types/LoginFields";
import {Session} from "../../../mongoose/models/Session.model";
import {isSessionActive} from "../session";
import {updateSessionToken} from "../token";
import {ResponseError} from "../error";

interface LoginRequest extends Request {
    body: LoginFields
}

export const login = async (req: LoginRequest, res: Response) => {
    const {username, password} = req.body;

    let token = null;

    if(!username && !password) {
        return res.status(500).send(new ResponseError("Bad request"));
    }

    const foundUser = await User.findOne({
        username,
        password
    });

    if(!foundUser) {
        return res.status(500).send(new ResponseError("Username or password is not valid"));
    }

    const foundSession = await Session.findOne({
       user: foundUser._id
    });

    if(!foundSession) {
        return res.status(500).send(new ResponseError("Session is not found"));
    }

    token = foundSession.token;

    if(!isSessionActive(foundSession)) {
        const sessionData = await updateSessionToken(foundSession);
        token = sessionData.token;
    }

    return res.send(token);
};
