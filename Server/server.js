const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://james2048:2055@james2048.3i9tg4t.mongodb.net/?retryWrites=true&w=majority&appName=james2048';

let mydb;

// MongoDB 연결
MongoClient.connect(url)
  .then(client => {
    console.log('몽고DB 접속 성공');

    mydb = client.db('myboard');

    // /list 요청 처리
    app.get('/list', function (req, res) {
      mydb.collection('post').find().toArray()
        .then(result => {
          console.log(result);  // 콘솔 출력
          res.send(result);     // 클라이언트에 응답
        })
        .catch(error => {
          console.error('데이터 조회 실패:', error);
          res.status(500).send('서버 오류');
        });
    });

    // 서버 시작
    app.listen(8080, function () {
      console.log('포트 8080으로 서버 대기중 ...');
    });

  })
  .catch(err => {
    console.error('몽고DB 접속 실패:', err);
  });