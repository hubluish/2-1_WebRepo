// server.js
const mongoclient = require('mongodb').MongoClient;

const url = 'mongodb+srv://james2048:2055@james2048.3i9tg4t.mongodb.net/?retryWrites=true&w=majority&appName=james2048';

mongoclient.connect(url)
  .then(client => {
    console.log('몽고DB 접속 성공');
    
    // 서버 실행
    const express = require('express');
    const app = express();

    app.listen(8080, function () {
      console.log('포트 8080으로 서버 대기중 ...');
    });
  })
  .catch(err => {
    console.error('몽고DB 접속 실패', err);
  });
