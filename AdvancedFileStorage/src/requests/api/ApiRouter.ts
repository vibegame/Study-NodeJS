import * as express from "express";
import {register} from "./register/register";
import {login} from "./login/login";
import {confirmAccount} from "./confirmAccount/confirmAccount";
import {refreshToken} from "./refreshSession/refreshToken";
import { getUserData } from "./getUserData/getUserData";
import { getListFiles } from "./getListFiles/getListFiles";
import { checkSession } from "./checkSession/checkSession";
import { downloadFile } from "./downloadFile/downloadFile";

import * as busboy from 'connect-busboy';
import { uploadFile } from "./uploadFile/uploadFile";

const ApiRouter = express.Router();

ApiRouter.post("/register", register);

ApiRouter.post("/login", login);

ApiRouter.get("/confirm-account/:token", confirmAccount);

ApiRouter.post("/refreshToken", refreshToken);

ApiRouter.post("/getUserData", getUserData);

ApiRouter.post("/getListFiles", getListFiles);

ApiRouter.post("/checkSession", checkSession);

ApiRouter.post("/downloadFile", downloadFile);

ApiRouter.post("/uploadFile", busboy(), uploadFile);

export {ApiRouter};
