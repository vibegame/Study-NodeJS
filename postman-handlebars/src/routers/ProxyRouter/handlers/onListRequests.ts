import {RequestHandler} from "express";
import {savedRequests} from "./onProxy";

export const onListRequests: RequestHandler = async (req, res) => {
    res.send(savedRequests);
};
