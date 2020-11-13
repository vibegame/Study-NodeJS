import * as jwt from "jsonwebtoken";
import {RegistrationFields} from "./types/RegistrationFields";
import {v4} from "uuid";
import {SessionDocument} from "../../mongoose/models/Session.model";
import {generateSessionExpiration} from "./session";

const {SECRET_HASH_KEY} = process.env;

export const parseToken = (token: string) => {
    return jwt.verify(token, SECRET_HASH_KEY);
};

export const generateMailToken = (data: RegistrationFields) =>
    jwt.sign(data, SECRET_HASH_KEY);

export const generateSessionToken = () => v4();

export const updateSessionToken = async (session: SessionDocument) => {
    const updateData = {
        expiration: generateSessionExpiration(),
        token: generateSessionToken()
    };

    await session.updateOne(updateData);

    return updateData;
};
