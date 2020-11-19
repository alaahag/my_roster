const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const ip = '0.0.0.0';
const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));
const router = require('./router.js');
app.use('/', router);

// app.use(function(req, res, next)
// {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });

app.listen(port, ip, function()
{
    console.log(`server is running on IP: '${ip}' port: '${port}'`);
});