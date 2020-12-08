import * as express from "express";

const RootRouter = express.Router();

RootRouter.use('/', express.static("./public"));

RootRouter.get("/", (req, res) => {
    res.render('index', {
        title: "Postman"
    });
});

export {RootRouter};
