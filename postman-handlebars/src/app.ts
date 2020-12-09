import * as express from "express";

import * as cors from 'cors';
import * as bodyParser from "body-parser";
import {AddressInfo} from "net";
import {terminal} from './Terminal';

import * as path from 'path';
import { ProxyRouter } from "./routers/ProxyRouter/ProxyRouter";
import { RootRouter } from "./routers/RootRouter/RootRouter";

import * as handlebars from 'express-handlebars';

const runApplication = async ({port}: { port: number | unknown }) => {

    const app = express();

    app.set("views", __dirname + "/views");
    app.set("view engine", "handlebars");

    app.engine("handlebars", handlebars({
        layoutsDir: __dirname + '/views/layouts',
        partialsDir: __dirname + "/views/partials",
        defaultLayout: "main"
    }));

    // resolve CORS
    app.use(cors());

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({extended: true}));

    // parse application/json
    app.use(bodyParser.json());

    app.use("/proxy", ProxyRouter);

    app.use("/", RootRouter);
    app.use('/', express.static(path.join(__dirname, '/static')));

    const appListener = app.listen(port, () => {
        terminal.success(`App is working on http://localhost:${(appListener.address() as AddressInfo).port}`);
    });
};

runApplication({
    port: 1080
});

