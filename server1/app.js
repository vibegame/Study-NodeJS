const port = 1001;
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('public'));

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'), function(err) {
      if (err) {
        res.status(500).send(err)
      }
    })
  })

app.listen(port, () => {
    console.warn(`App is running. Port: ${port}`);
});
