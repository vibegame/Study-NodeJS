const express = require('express');
const db = require('./database');

const webserver = express();
const port = 1080;

const question = 'Who do you want to vote for?';

const variants = {
    '1': 'Nikita Tolstik',
    '2': 'Elia Middle',
    '3': 'Hellski Api',
    '4': 'Onto Ken',
};

webserver.use(express.json({extended:true}));

webserver.use(express.static('public'));

const stats = db.data.stats || (() => {
    const stats = {};

    for(let variant in variants) {
        stats[variant] = 0;
    }
    
    return stats;
})();

webserver.get('/question', (req, res) => {
    res.send(question);
});

webserver.get('/stats', (req, res) => {
    res.setHeader("Cache-Control", "max-age=0");
    res.send(JSON.stringify(stats));
});

webserver.post('/vote', (req, res) => {

    const value = req.body.value;

    if(value === null) {
        res.status(504).send({
            errorMessage: "Bad Request"
        });
        return;
    }

    stats[value]++;

    db.data.stats = stats;
    db.update();

    

    res.send('');

});

webserver.get('/variants', (req, res) => {
    res.send(variants);
});

webserver.listen(port,()=>{ 
    console.warn(`Webserver is running. Port: ${port}`);
}); 

