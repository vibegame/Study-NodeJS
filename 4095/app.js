const port = 1080;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const path = require('path');
const fs = require('fs');

const fetch = require('isomorphic-fetch');

const databaseFile = path.join(__dirname, 'data.json');

Object.compare = function (obj1, obj2) {
	//Loop through properties in object 1
	for (var p in obj1) {
		//Check property exists on both objects
		if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;
 
		switch (typeof (obj1[p])) {
			//Deep compare objects
			case 'object':
				if (!Object.compare(obj1[p], obj2[p])) return false;
				break;
			//Compare function code
			case 'function':
				if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
				break;
			//Compare values
			default:
				if (obj1[p] != obj2[p]) return false;
		}
	}
 
	//Check object 2 for any extra properties
	for (var p in obj2) {
		if (typeof (obj1[p]) == 'undefined') return false;
	}
	return true;
};

const get = () => {
    let data = '';

    try {
        data = fs.readFileSync(databaseFile, "utf8");
    } 
    catch (error) {
        if (error.code === 'ENOENT') {
            fs.writeFile(databaseFile, "", function (err) {
                if (err) throw err;
                console.log('File is created successfully.');
              });
        } 
        else {
            throw error;
        }
    }
    return data ? JSON.parse(data) : {
        configures: []
    };
};

const database = get();

const update = () => {
    fs.writeFileSync(databaseFile, JSON.stringify(database));
};


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

        database.configures.push();

        let hasConfigure = false;

        const newConfigure = {
            ...req.body
        };

        for(let i = 0; i < database.configures.length; i++) {
            const configure = database.configures[i];
            if(Object.compare(configure, newConfigure)) { 
                hasConfigure = true;
                break;
            }
        }

        if(!hasConfigure) {
            database.configures.push(newConfigure);
            update();
        }
        

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

app.get('/configures', (req, res) => {
    res.send(database.configures);
});

app.listen(port, () => {
    console.warn(`App is running. Port: ${port}`);
});
