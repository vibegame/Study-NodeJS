const port = 1080;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fetch = require('isomorphic-fetch');

// parse application/json
app.use(bodyParser.json({ extended: true }));

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



app.options('/proxy', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.send('');
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

app.get('/test', (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.send("GOOD");
});

app.post('/proxy', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
    } catch (error) {
        res.send(error);
    }
});

app.listen(port);
