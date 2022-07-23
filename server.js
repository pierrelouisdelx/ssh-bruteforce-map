const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const geoip = require('geoip-lite');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

app.use('/', express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = new sqlite3.Database('db.sqlite3');
var check = "SELECT COUNT(*) as c FROM logs WHERE ip=?";
var update = "UPDATE logs SET attempts=attempts+1 WHERE ip=?";
var insert = "INSERT INTO logs (ip, lat, lng, attempts, date) VALUES (?, ?, ?, ?, ?)";

const parser = () => {
    const failed = 'Failed password for';
    let f = fs.readFileSync('logs.txt', 'utf8');
    let lines = f.split('\n');

    console.log('[+] Parsing logs...');

    lines.forEach(line => {
        // Check if line is a failed login
        if (line.includes(failed)) {
            // Get ip address
            let ip = line.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)[0];

            // Get location
            let geo = geoip.lookup(ip);
            let lat = geo.ll[0];
            let lng = geo.ll[1];

            // Get date
            let date = line.match(/^[a-zA-Z]{3}(\s+)[\d]{1,2}(\s+)[\d]{2}:[\d]{2}:[\d]{2}/)[0];

            // Check if ip is already in database
            db.all(check, [ip], function (err, res) {
                if (err) {
                    console.log(err);
                } else {
                    // If ip is not in database, insert it
                    if (res[0].c == 0)
                        db.run(insert, [ip, lat, lng, 1, date]);
                    else // If ip is in database, update it
                        db.run(update, [ip]);
                }
            });
        }
    });
    console.log('[+] Parsing logs... done!');
}


app.get('/api/getData', (req, res) => {
    // Get data from database
    const sql = "SELECT * FROM logs WHERE attempts > 10 LIMIT 100";
    db.all(sql, function (err, result) {
        if (err) throw err;
        var data = Object.values(result)
        res.send(data);
    });
});

setInterval(parser, 21600); // Update every 6 hours

// Update at first run then every 6 hours
parser();

app.listen(3001, () => {
    console.log("Server is listening on port 3001");
});
