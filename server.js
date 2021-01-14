const filestream = require('fs'); //database.json 파일을 읽기위해
const express = require('express');
const bodyParser = require('body-parser');
const app = express();


const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const data = filestream.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql'); //mysql라이브러리를 가져와서 mysql변수에 넣음

const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database
});
connection.connect();

app.get('/api/customers', (req,res)=>{
    connection.query("SELECT * FROM CUSTOMER",
    (err, rows, fields) => {
        res.send(rows);
    });
});

app.listen(port, ()=> console.log("nodejs 실행됨"));