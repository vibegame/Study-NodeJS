import * as dotenv from 'dotenv';

dotenv.config();

import * as express from "express";
import {ApiRouter} from "./requests/api/ApiRouter";

import * as cors from 'cors';
import * as bodyParser from "body-parser";
import {AddressInfo} from "net";
import {terminal} from "./utils/Terminal";

import {connectToDatabase} from "./mongoose/Database";
import * as path from "path";

const runApplication = async ({port}: { port: number | unknown }) => {

    try {
        terminal.success("Connecting to MongoDB");

        await connectToDatabase();

        terminal.success("Connected to MongoDB");
    }
    catch (error) {
        terminal.error("Failed connected to MongoDB", error);

        process.exit(0);
    }

    const app = express();



    // resolve CORS
    app.use(cors());

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({extended: true}));

    // parse application/json
    app.use(bodyParser.json());

    app.use("/api", ApiRouter);

    app.use('/static', express.static(path.join(__dirname, '/public/static')));

    app.get('*', function(req, res) {
        res.sendFile('index.html', {root: path.join(__dirname, '/public')});
    });

    const appListener = app.listen(port, () => {
        terminal.success(`App is working on http://localhost:${(appListener.address() as AddressInfo).port}`);
    });
};

runApplication({
    port: process.env.PORT || 443
});

