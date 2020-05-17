require('isomorphic-fetch');

const express = require('express');

const webserver = express(); // создаём веб-сервер

const token = '20NOdRs2GxKVJnvyTrpGbUSypfErB4YEfcSaudiMc_gCVPG8Ht0';

webserver.get('/', function (req, res) {
    fetch(`https://api.pandascore.co/dota2/players?token=${token}&search[name]=meracle`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        return res.send(
            JSON.stringify(data)
        );
    });
})

webserver.listen(3000, function () {
    console.log('Listening on port 3000...')
})