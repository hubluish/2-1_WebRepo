const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const path = require('path');
const ObjId = require('mongodb').ObjectId;
const sha = require('sha256');
const dotenv = require('dotenv').config();


// body-parser 라이브러리 추가
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('/', require('./routes/post.js'));

app.set('view engine', 'ejs');

const url = process.env.DB_URL; 

let mydb;

    let multer = require('multer');

    let storage = multer.diskStorage({
      destination: function(req, file, done){
        done(null, './public/image')
      },
      filename: function(req, file, done){
        done(null, file.originalname)
      }
    })

    let upload = multer({storage : storage});

    let imagepath = '';




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

  app.get("/content/:id", function (req, res) {
  console.log(req.params.id);
  req.params.id = new ObjId(req.params.id);
  mydb
    .collection("post")
    .findOne({ _id: req.params.id })
    .then((result) => {
      console.log(result);
      let imagePath = result.path.replace(/\\public\\image\\/, "/image/");
      res.render("content.ejs", { data: result });
    });
  });

  app.get('/edit/:id', function(req, res) {
    req.params.id = new ObjId(req.params.id);
    mydb
      .collection("post")
      .findOne({ _id: req.params.id })
      .then((result) => {
        console.log(result);
        if (result.path) {
          result.path = result.path.replace(/\\public\\image\\/, "/image/");
        }
        res.render("edit.ejs", { data: result });
      });
  });


  let cookieParser = require("cookie-parser");
  
  app.use(cookieParser('ncvka0e398423kpfd'));
  app.get('/cookie', function(req, res){
    let milk = parseInt(req.signedCookies.milk) + 1000;
    if (isNaN(milk)) {
      milk = 0;
    }
    res.cookie('milk', milk, {signed: true});
    res.send('product :' + milk + '원');
  });

  let session = require('express-session');

  app.use(session({
    secret: 'dkufe8938493j4e08349u',
    resave: false,
    saveUninitialized: true,
  }));
  app.get('/session', function(req, res){
    if (isNaN(req.session.milk)) {
      req.session.milk = 0;
    }
    req.session.milk = req.session.milk + 1000;
    res.send("session : " + req.session.milk + "원");
  });

  app.get('/login', function(req, res){
    console.log(req.session);
    if (req.session.user) {
      console.log('세션 유지');
      res.render('index.ejs', {user: req.session.user});
    }else{
      res.render('login.ejs');
    }
  });

  app.post("/login", function (req, res) {
    console.log("아이디 : " + req.body.userid);
    console.log("비밀번호 : " + req.body.userpw);

    mydb
      .collection("account")
      .findOne({ userid: req.body.userid })
      .then((result) => {
        if (result.userpw == sha(req.body.userpw)) {
          req.session.user = req.body;
          console.log("새로운 로그인");
          res.render("index.ejs", { user: req.session.user });
        } else {
          res.render("login.ejs");
        }
      });
  });


    app.get('/logout', function(req, res){
      console.log('로그아웃');
      req.session.destroy();
      res.render('index.ejs', {user: null});
    });

    app.get('/signup', function(req, res){
      res.render('signup.ejs');
    });

    app.get("/", function (req, res) {
    // res.render("index.ejs");
    if (req.session.user) {
      console.log("세션 유지");
      // res.send('로그인 되었습니다.');
      res.render("index.ejs", { user: req.session.user });
    } else {
      console.log("user : null");
      res.render("index.ejs", { user: null });
    }
  });

  app.get('/search', function (req, res) {
    console.log(req.query);
    mydb.collection("post").find({ title: req.query.value }).toArray()
      .then((result) => {
        console.log(result);
        result = result.map(post => {
          post.path = post.path.replace(/\\public\\image\\/, "/image/");
          return post;
        });
        res.render("sresult.ejs", { data: result });
      });
  });




    app.post('/photo', upload.single('picture'), function(req, res){
      console.log(req.file.path);
      imagepath = 'www' + req.file.path;
    })

    app.post("/signup", function (req, res) {
      console.log(req.body.userid);
      console.log(req.body.userpw);
      console.log(req.body.usergroup);
      console.log(req.body.useremail);

      mydb
        .collection("account")
        .insertOne({
          userid: req.body.userid,
          userpw: sha(req.body.userpw),
          usergroup: req.body.usergroup,
          useremail: req.body.useremail,
        })
        .then((result) => {
          console.log("회원가입 성공");
        });

      res.redirect("/");
    });


    // '/save' 요청에 대한 post 방식의 처리 루틴
    app.post("/save", function (req, res) {
      mydb
        .collection("post")
        .insertOne({
          title: req.body.title,
          content: req.body.content,
          date: req.body.someDate,
          path: imagepath,
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
    app.listen(process.env.PORT, function () {
      console.log('포트 8080으로 서버 대기중 ...');
    });

  })
  .catch(err => {
    console.error('몽고DB 접속 실패:', err);
  });


