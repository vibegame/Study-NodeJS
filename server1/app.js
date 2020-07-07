const port = 443;
const express = require('express');
const app = express();

app.use(express.static('public'));


app.listen(port, () => {
    console.warn(`App is running. Port: ${port}`);
});
