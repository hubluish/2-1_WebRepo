const express = require('express');
const mongoclient = require('mongodb').MongoClient;
const mysql = require('mysql');
const app = express();

const url= 'mongodb+srv://james2048:2055@james2048.3i9tg4t.mongodb.net/?retryWrites=true&w=majority&appName=james2048';
mongoclient.connect(url)
.then(client => {
    console.log('몽고DB 접속 성공');
    app.listen(8080, function(){
        console.log("포트 8080으로 서버 대기중 ... ");
    });
    })
.catch(err => {
    console.log(err);
  });

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2055',
    database: 'myboard',
});
conn.connect();


app.get('/list', function(req, res) {
    conn.query("SELECT * FROM post", function(err, rows, fields) {
        if (err) {
            console.error(err);
            return res.status(500).send('서버 오류');
        }
        res.json(rows); 
    });
});
