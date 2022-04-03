const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require("body-parser");
const geoip = require('geoip-lite');
const mysql = require('mysql');
const util = require('util');
const spawn = require('child_process').spawn;

const db = mysql.createConnection({
    host: "localhost",
    user: "",
    password: "",
    database : "ssh-bruteforce-map"
 });

app.use('/', express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var sql = "INSERT INTO logs (ip, lat, lng, attempts, date) VALUES (?)";

const update = () => {
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
            const tmp = data[key];
            const val = [key, tmp['lat'], tmp['lng'], tmp['attempts'], tmp['date']];
            db.query(sql, [val], function (err, result) {
                if (err) throw err;
            });
        }
    });
}

app.get('/geoip/length', (req, res) => {
    db.connect(function(err) {
        if (err) throw err;
        db.query("SELECT COUNT(*) FROM logs", function (err, result) {
            if (err) throw err;
            var tmp = Object.values(JSON.parse(JSON.stringify(result)))
            tmp = tmp[0]['COUNT(*)']
            res.send({"n" : tmp})
        });
    });
});

app.get('/geoip/:n', (req, res) => {
    res.send(result[req.params.n]);
});

http.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
