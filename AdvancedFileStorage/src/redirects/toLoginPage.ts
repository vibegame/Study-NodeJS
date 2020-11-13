import {Response} from "express";

export const redirectToLoginPage = (res: Response) => {
    res.redirect(`http://${process.env.HOST_IP}:${process.env.FRONT_PORT}/login`);
};
