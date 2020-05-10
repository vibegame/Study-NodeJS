const express = require('express');
const db = require('./database');

const webserver = express();
const port = 1080;

const question = 'Who do you want to vote for?';

const variants = ['Nikita Tolstik', 'Elia Middle', 'Hellski Api', 'Onto Ken'];

webserver.use(express.json({extended:true}));

webserver.use(express.static('public'));

const stats = db.data.stats || (() => {
    
    const stats = {};

    variants.forEach(variant => stats[variant] = 0);
    
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

    if(variants.indexOf(value) === -1) {
        res.status(504).send({
            errorMessage: "There is no such answer"
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

