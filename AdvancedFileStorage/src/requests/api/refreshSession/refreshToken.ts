import {Request, Response} from "express";
import {Session, SessionFields} from "../../../mongoose/models/Session.model";
import {generateSessionToken} from "../token";
import {generateSessionExpiration} from "../session";
import {terminal} from "../../../utils/Terminal";
import {ResponseError} from "../error";

interface RefreshTokenRequest extends Request {
    body: {
        token: string
    }
}

export const refreshToken = async (req: RefreshTokenRequest, res: Response) => {
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

    try {
        const updateSession: SessionFields = {
            token: generateSessionToken(),
            expiration: generateSessionExpiration()
        };

        await foundSession.updateOne(updateSession);

        res.send(updateSession.token);
    }
    catch (error) {
        terminal.error(error);
        res.status(500).send(new ResponseError("Unknown error"));
    }
};
