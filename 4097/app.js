const express = require('express');

const app = express(); // создаём веб-сервер

app.use(express.urlencoded({extended: true}));

const port = 1080;

class Field {

    constructor(props = {}) {
        this.value = typeof props.value === 'undefined' ? '' : props.value;
        this.ok = typeof props.ok === 'undefined' ? true : props.ok;
        this.errorMessage = typeof props.errorMessage === 'undefined' ? '' : props.errorMessage;
    }

}

const validateUsername = (username) => {

    const ok = username.length >= 8;

    let errorMessage = '';

    if (!ok) {
        errorMessage = 'Length of username is less than 8 symbols';
    }

    return new Field({
        ok,
        errorMessage,
        value: username
    });
};

const validatePassword = (password) => {
    const ok = (/[0-9a-zA-Z!@#$%^&*]{6,}/).test(password);

    let errorMessage = '';

    if (!ok) {
        errorMessage = 'Password is not valid';
    }

    return new Field({
        ok,
        errorMessage,
        value: password
    });
};

const getStyles = () => {
    return (
        `
        <style>
        html, body {
            font-family: 'Century Gothic', sans-serif;
        }
        
        .registered {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
        
        .registered .title-registered {
            font-size: 40px;
            font-weight: bold;
            color: #0078D6;
            text-transform: uppercase;
        }
        
        .main-form {
            display: flex;
            flex-direction: column;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
        }
        
        .main-form-title {
            font-size: 24px;
            text-transform: uppercase;
        }
        
        .main-form label {
            display: flex;
            flex-direction: column;
            margin: 15px 0;
        }
        .main-form input {
            height: 40px;
            font-family: 'Century Gothic', sans-serif;
        }
        .main-form button {
            width: 140px;
            padding: 8px 16px;
            cursor: pointer;
            background: #00D4D6;
            border: none;
            font-size: 16px;
            font-weight: bold;
        }
        
        .main-form .errorMessage {
            color: #D64C41;
            margin-top: 3px;
        }
        
        .registered .result-field {
            display: flex;
            font-size: 18px;
            font-weight: bold;
            color: #4434D6;
            align-items: center;
        }
        
        .registered .result-field-value {
            font-weight: normal;
            margin-left: 6px;
        }
        
        </style>
        `
    );
};

const renderForm = ({username, password}) => {
    console.log(username, password);
    return (
        `
        <form
        method="post"
        action="/validate"
        class="main-form"
        >
            <h1 class="main-form-title">Registration</h1>
            <label>
                <span>Type your username:</span>
                <input type="text" name="username" value="${username.value}">
                ${username.ok ? `` : `<span class="errorMessage">${username.errorMessage}</span>`}
            </label>
            <label>
                <span>Type your password:</span>
                <input type="text" name="password" value="${password.value}">
                ${password.ok ? `` : `<span class="errorMessage">${password.errorMessage}</span>`}
            </label>
            <button>Register</button>
        </form>
        `
    ) + getStyles();
};

const renderSuccess = ({username, password}) => {

    return (
        `
            <div class="registered">
                <h1 class="title-registered">
                    Registered
                </h1>
                <span class="result-field">Username: <span class="result-field-value">${username}</span></span>
                <span class="result-field">Password: <span class="result-field-value">${password}</span></span>  
            </div>
        `
    ) + getStyles();


};

const convertToStringParams = params => {
    const stringParamsArray = Object.keys(params).map(paramName => {

        const paramValue = params[paramName];

        return `${paramName}=${paramValue}`;
    })


    return stringParamsArray.join('&');
};

app.get('/', (req, res) => {
    res.send(renderForm({
        username: new Field(),
        password: new Field()
    }));
});

app.post('/validate', (req, res) => {
    const validatedUsername = validateUsername(req.body.username);

    const validatedPassword = validatePassword(req.body.password);

    if (!validatedUsername.ok || !validatedPassword) {
        res.send(renderForm({
            username: validatedUsername,
            password: validatedPassword
        }));
        return;
    } else  {
        res.setHeader('Location', '/registered' + `?${convertToStringParams({username: validatedUsername.value, password: validatedPassword.value})}`);
        res.send(303);
    }
});

app.get('/registered', (req, res) => {
    res.send(renderSuccess(req.query));
});

app.listen(port, () => {
    console.log("web server running on port " + port);
}); 
