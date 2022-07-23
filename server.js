const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const geoip = require('geoip-lite');
const sqlite3 = require('sqlite3').verbose();

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

                const tmp = data[key];
                const val = [key, tmp['lat'], tmp['lng'], tmp['attempts'], tmp['date']];

                var check = "SELECT COUNT(*) as c from logs WHERE ip=" + mysql.escape(key) + " and date=" + mysql.escape(tmp['date']);
                db.query(check, function (err, res) {
                    if (err) throw err;
                    if (res[0].c == 0) {
                        db.query(sql, [val], function (error, result) {
                            if (error) throw error
                        });
                    }
                });
            }
        }
    });
}

app.get('/api/getData', (req, res) => {
    const sql = "SELECT * FROM logs LIMIT 100";
    db.query(sql, function (err, result) {
        if (err) throw err;
        var data = Object.values(JSON.parse(JSON.stringify(result)))
        res.send(data);
    });
});

setInterval(update, 21600); // Update every 6 hours

// Update at first run then every 6 hours
update();

http.listen(3001, () => {
    console.log("Server is listening on port 3001");
});
