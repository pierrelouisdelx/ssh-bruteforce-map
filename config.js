const mysql = require('mysql');

const db = mysql.createConnection({
    host: "localhost",
    user: "",
    password: "",
    database : "ssh-bruteforce-map"
 });

module.exports = db

