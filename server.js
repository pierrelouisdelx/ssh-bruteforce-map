const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require("body-parser");
const geoip = require('geoip-lite');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const util = require('util');
const spawn = require('child_process').spawn;
var logs;
var result;

app.get('/geoip/length', (req, res) => {
    logs = spawn('python3', ['auth_logs_parser.py']);

    var scriptOutput = "";

    logs.stdout.on('data', (data) => {
        data = data.toString();
        scriptOutput += data;
    });

    logs.stdout.on('close', () => {
        result = JSON.parse(scriptOutput);
        data = JSON.parse(scriptOutput);
        keys = Object.keys(data);
        for (key of keys) {
            var geo = geoip.lookup(key);
            if (geo == null)
                delete data[key]
            else {
                data[key]['lat'] = geo.ll[0];
                data[key]['lng'] = geo.ll[1];
            }
        }
        res.send({"length" : data.length});
    });
});

app.get('/geoip/:n', (req, res) => {
    res.send(result[req.params.n]);
});

http.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
