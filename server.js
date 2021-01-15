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

const multer = require('multer');
const upload = multer({dest: './upload'})

app.get('/api/customers', (req,res)=>{
    connection.query("SELECT * FROM CUSTOMER",
    (err, rows, fields) => {
        res.send(rows);
    });
});

app.use('/image', express.static('./upload')); //image 라는 경로로 접근을 하지만 실제로 upload로 이동

app.post('/api/customers', upload.single('IMAGE'), (req,res)=>{
    let sql = 'INSERT INTO CUSTOMER VALUES (null, ?,?,?,?,?)';
    let image = '/image/' + req.file.filename;
    console.log(req.body.NAME);
    let name = req.body.NAME;
    let birthday = req.body.BIRTHDAY;
    let gender = req.body.GENDER;
    let job = req.body.JOB;
    let params = [image, name, birthday, gender, job];
    connection.query(sql, params,
        (err, rows, fields)=>{
            res.send(rows);
        })
});

app.listen(port, ()=> console.log("nodejs 실행됨"));