const port = 1080;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const fetch = require('isomorphic-fetch');

// parse application/json
app.use(bodyParser.json({ extended: true }));

app.use(express.static('public'));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

function getStringParams(params) {
    const arrStringParams = params.map((param) => {
        return `${param.name}=${param.value}`;
    });

    return arrStringParams.join('&');
}

const createRequestGET = async ({headers, params, url}) => {
    return await fetch(`${url}?${getStringParams(params)}`, {
        method: 'GET',
        headers
    });
};

const createRequestPOST = async ({headers, body, url}) => {
    return await fetch(url, {
        method: 'POST',
        body,
        headers
    });
};

const sendRequest = async (requestMethod, data) => {
    switch (requestMethod) {
        case "GET":
            return await createRequestGET(data);
        case "POST":
            return await createRequestPOST(data);
    }
};

const getStringBodyFromResponse = (body) => {
    let data = '';

    body.setEncoding('utf8');

    body.on('data', function(chunk) {
        data += chunk;
    });

    return new Promise(resolve => {
        body.on('end', function() {
            resolve(data);
        });
    });

};

app.post('/proxy', async (req, res) => {
    try {

        const response = await sendRequest(req.body.method, req.body);

        const stringBody = await getStringBodyFromResponse(response.body);

        const headers = {};

        response.headers.forEach((name, key) => {
            headers[key] = name;
        });

        res.send(JSON.stringify({
            body: stringBody,
            status: response.status,
            headers
        }));
    }
    catch (error) {
        console.warn(error);
        res.send(error);
    }
});

app.listen(port, () => {
    console.warn(`App is running. Port: ${port}`);
});
