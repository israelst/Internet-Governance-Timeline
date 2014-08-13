var express = require('express'),
    app = express(),
    port = '8000';

app.use(express.static('app'));
app.listen(port);
console.log('Listening on port', port);

