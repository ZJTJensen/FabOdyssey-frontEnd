const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('./dist/FabOdyssey-frontEnd'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/FabOdyssey-frontEnd/'}),
);

app.listen(process.env.PORT || 8080);