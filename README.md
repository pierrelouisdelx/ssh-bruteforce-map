# SSH Bruteforce Map
This is a simple gui for viewing ssh failed logs

## Prerequisites
* Python3
```
sudo apt install python3
```

## Setup

Create a Node server app add the code below

### Usage :
```
node server.js
```

### Server main code
```js
app.get('/geoip', (req, res) => {
    const util = require('util');
    const spawn = require('child_process').spawn;
    const logs = spawn('python3', ['auth_logs_parser.py']);

    var result = [];

    logs.stdout.on('data', (data) => {
        data = JSON.parse(data);
        keys = Object.keys(data);
        for (key of keys) {
            var geo = geoip.lookup(key);
            data[key]['lat'] = geo.ll[0];
            data[key]['lng'] = geo.ll[1];
        }
        res.send(data);
    });
});
