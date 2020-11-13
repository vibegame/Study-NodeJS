import {SessionDocument} from "../../mongoose/models/Session.model";

export const generateSessionExpiration = (ms = 1000*60*10) => {
    const date = new Date();

    date.setTime(ms + date.getTime());

    return date;
};

export const isSessionActive = (session: SessionDocument) => {
    return session.expiration > new Date();
};
