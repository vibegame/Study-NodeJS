const port = 4095;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fetch = require('isomorphic-fetch');
const inspector = require('inspector');

app.use(express.static('public'));

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

// parse application/json
app.use(bodyParser.json({ extended: true }));

app.options('/proxy', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(200);
});

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
    res.setHeader('Access-Control-Allow-Origin', '*');

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
});

app.listen(port);
