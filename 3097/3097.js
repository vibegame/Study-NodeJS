const express = require('express');

const webserver = express(); // создаём веб-сервер

webserver.use(express.urlencoded({extended:true}));


const port = 1080;


const renderFormStyles = () => {
    return `
    <style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Century Gothic" !important;
    }
    
    body {
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    
    .btn {
        border: 0;
        background-color: #9B66FF;
        color: #ffffff;
        cursor: pointer;
        transition: .2s;
        outline: none;
        padding: 10px 35px;
        border-radius: 6px;
    }
    
    label {
        display: inline-block;
        position: relative;
        height: 35px;
        font-size: 14px;
        margin: 10px 0;
    }
    
    label p {
        display: inline;
    }
    
    input {
        height: 100%;
        border: 0;
        outline: none;
        border-bottom: solid 1px #9B66FF;
    
    }
    
    .btn:hover {
        background-color: #5B3BFF;
    }
    
    .btn:active {
        background-color: #AD2AFF;
    }

    .error {
        color: red;
        font-weight: bold;
        font-size: 13px;
    }

    .error.hidden {
        visibility: hidden;
    }
    </style>
    `;
};

const renderForm = ({
    _passwordValue,
    _loginValue,
    error
}) => {

    const loginValue = _loginValue || '';
    const passwordValue = _passwordValue || '';

    return (`
    <form class="form" action="/validate" method="get">


        <label>
            <p>Логин: </p>
            <input type="text" name="login" value="${loginValue}">
        </label>

        <label>
            <p>Пароль: </p>    
            <input type="password" name="password" value="${passwordValue}">
        </label>


        <span class="error ${!error && 'hidden'}">${error}</span>

        <input class="btn" type=submit value="Войти">

    </form>
`);


};

const successResult = ({_passwordValue, _loginValue}) => {
    return `
    
        <h1>Ваши данные: </h1>
        <p>${_loginValue}</p>
        <p>${_passwordValue}</p>
    
    `;
};

webserver.get('/', (req, res) => {
    res.send(
        renderFormStyles() +
        renderForm({
            _loginValue: '',
            _passwordValue: ''
        }) 
    );
});

webserver.get('/validate', (req, res) => {

    if(req.query.password.length < 8) {
        res.send(
            renderFormStyles() +
            renderForm({
                _loginValue: req.query.login,
                _passwordValue: req.query.password,
                error: 'Слишком короткий пароль!'
            }) 
        );
    }
    else if(req.query.login.length < 5) {
        res.send(
            renderFormStyles() +
            renderForm({
                _loginValue: req.query.login,
                _passwordValue: req.query.password,
                error: 'Маленький логин!'
            }) 
        );
    }
    else {
        res.send(
            successResult({
                _loginValue: req.query.login,
                _passwordValue: req.query.password,
            })
        );
    }
});

webserver.listen(port,()=>{ 
    console.log("web server running on port "+port);
}); 
