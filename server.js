const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('./dist/fabodyssey-frontend'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/fabodyssey-frontend/'}),
);

app.listen(process.env.PORT || 8080);