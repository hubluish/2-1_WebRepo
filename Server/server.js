const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const path = require('path');


app.use(express.urlencoded({ extended: true }));
const db = require('node-mysql/lib/db');
app.set('view engine', 'ejs');

const url = 'mongodb+srv://james2048:2055@james2048.3i9tg4t.mongodb.net/?retryWrites=true&w=majority&appName=james2048';

let mydb;

// MongoDB 연결
MongoClient.connect(url)
  .then(client => {
    console.log('몽고DB 접속 성공');

    mydb = client.db('myboard');

    app.get('/enter', function (req, res) {
      res.render('enter.ejs');
    });

  app.get('/list', async function (req, res) {
    const result = await mydb.collection('post').find().toArray();
    res.render('list.ejs', { data: result });
  });








    app.post('/save', function(req, res){
      console.log(req.body.title);
      console.log(req.body.content);
      console.log(req.body.someDate);
  // 몽고DB에 데이터 저장하기
    mydb.collection('post').insertOne(
      { title: req.body.title, content: req.body.content, date: req.body.someDate }
    ).then(result => {
      console.log(result);
      console.log('데이터 추가 성공');
    });

    res.send('데이터 추가 성공');
  });



    // 서버 시작
    app.listen(8080, function () {
      console.log('포트 8080으로 서버 대기중 ...');
    });

  })
  .catch(err => {
    console.error('몽고DB 접속 실패:', err);
  });


