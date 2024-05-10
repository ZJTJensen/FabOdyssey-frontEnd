const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('./dist/fab-adventure-game'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/fab-adventure-game/'}),
);

app.listen(process.env.PORT || 8080);