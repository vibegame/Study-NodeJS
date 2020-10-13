const PORT = 3030;

const mysql      = require('mysql');

const express = require("express");

const webserver = express();

const routeToDB = express.Router();

const cors = require("cors");

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'sql-explorer'
});

webserver.use(cors());

// parse application/x-www-form-urlencoded

const bodyParser = require('body-parser')
webserver.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
webserver.use(bodyParser.json())

connection.connect((err) => {
    if(err)
        console.log("Ошибка подключения к базе данных", err);
    else
        console.log(`Connected to database "sql-explorer"`);
});

routeToDB.post("/request", (req, res) => {
    connection.query(req.body.query, (err, result) => {
        const action = {
            payload: {
                type: null,
                data: null
            },
            errorInfo: {
                code: 0,
                description: null,
            }
        };

        if(err) {
            res.status(500);
            action.errorInfo.code = 1;
            action.errorInfo.description = err;
        }
        else if("affectedRows" in result && "changedRows" in result) {
            action.payload.type = "change";
            action.payload.data = result;
        }
        else {
            action.payload.type = "select";
            action.payload.data = result;
        }

        res.send(JSON.stringify(action));
    });
});

webserver.use("/database", routeToDB);

setTimeout(() => {
    connection.query("show datables", (err, result) => {
        if(err) {
            console.log("Ошибка", err);
        }
        else {
            console.log("Реузльтат", result);
        }
    });

}, 5000);

webserver.listen(3030, () => {
    console.log("Webserver is listening on port " + PORT);
});

