import * as express from "express";
import { onProxy } from "./handlers/onProxy";
import {onListRequests} from "./handlers/onListRequests";

const ProxyRouter = express.Router();

ProxyRouter.post("/", onProxy);
ProxyRouter.get("/list/requests", onListRequests);

export {ProxyRouter};
