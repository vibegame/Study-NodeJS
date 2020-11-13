import {Request, Response} from "express";
import {RegistrationFields} from "../types/RegistrationFields";
import {terminal} from "../../../utils/Terminal";
import {User} from "../../../mongoose/models/User.model";
import {generateSessionToken, parseToken} from "../token";
import {redirectToLoginPage} from "../../../redirects/toLoginPage";

import {Session} from "../../../mongoose/models/Session.model";
import {generateSessionExpiration} from "../session";
import {FilesStorage} from "../../../FilesStorage/FilesStorage";

interface ConfirmAccountRequest extends Request {
    params: {
        token: string | undefined
    }
}

export const confirmAccount = async (req: ConfirmAccountRequest, res: Response) => {
    const {token} = req.params;

    if (!token) {
        return res.send("Invalid link");
    }

    const decoded = parseToken(token) as RegistrationFields;

    if (
        decoded.username &&
        decoded.email &&
        decoded.password
    ) {
        const sessionToken = generateSessionToken();

        const sessionExpiration = generateSessionExpiration();

        try {
            const user = await new User({
                username: decoded.username,
                email: decoded.email,
                password: decoded.password,
            }).save();

            await new Session({
                expiration: sessionExpiration,
                token: sessionToken,
                user: user._id
            }).save();

            new FilesStorage(decoded.username);

            return redirectToLoginPage(res);
        }
        catch (error) {
            terminal.error(error);
            return res.send("Unknown error");
        }
    }
};
