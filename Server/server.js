const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const path = require('path');
const mongoclient = require("mongodb").MongoClient;
const ObjId = require('mongodb').ObjectId;

// body-parser 라이브러리 추가
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// 정적 파일 라이브러리 추가
app.use(express.static("public"));

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

    app.get('/', function (req, res) {
      res.render('index.ejs');
    });

    app.get('/enter', function (req, res) {
      res.render('enter.ejs');
    });

  app.get('/list', async function (req, res) {
    const result = await mydb.collection('post').find().toArray();
    res.render('list.ejs', { data: result });
  });

  app.get("/content/:id", function (req, res) {
  console.log(req.params.id);
  req.params.id = new ObjId(req.params.id);
  mydb
    .collection("post")
    .findOne({ _id: req.params.id })
    .then((result) => {
      console.log(result);
      res.render("content.ejs", { data: result });
    });
  });

  app.get('/edit/:id', function(req, res){
  req.params.id = new ObjId(req.params.id);
  mydb
    .collection("post")
    .findOne({ _id: req.params.id })
    .then((result) => {
      console.log(result);
      res.render("edit.ejs", { data: result });
    });
});


    // '/save' 요청에 대한 post 방식의 처리 루틴
    app.post("/save", function (req, res) {
      mydb
        .collection("post")
        .insertOne({
          title: req.body.title,
          content: req.body.content,
          date: req.body.someDate,
        })
        .then((result) => {
          console.log(result);
          console.log("데이터 추가 성공");
        });

      res.redirect("/list");
    });


    app.post("/delete", function (req, res) {
  console.log(req.body._id);
  req.body._id = new ObjId(req.body._id);
  mydb.collection('post').deleteOne(req.body)
    .then(result => {
      console.log('삭제완료');
      res.status(200).send();
    })
      .catch(err => {
        console.log(err);
        res.status(500).send();
      });
    });

    app.post("/edit", function (req, res) {
    console.log(req.body);
      req.body.id = new ObjId(req.body.id);
      mydb
        .collection("post")
        .updateOne(
          { _id: req.body.id },
          {
            $set: {
              title: req.body.title,
              content: req.body.content,
              date: req.body.someDate
            }
          }
        )
        .then((result) => {
          console.log("수정완료");
          res.redirect("/list");
        })
        .catch((err) => {
          console.log(err);
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


