var router = require('express').Router();

const mongoclient = require("mongodb").MongoClient;
const ObjId = require("mongodb").ObjectId;
const url = process.env.DB_URL;

let mydb;
    mongoclient
    .connect(url)
    .then((client) => {
        mydb = client.db("myboard");
    })
    .catch((err) => {
        console.log(err);
    });

    router.get("/list", function (req, res) {
    mydb
        .collection("post")
        .find()
        .toArray()
        .then((result) => {
        console.log(result);
        res.render("list.ejs", { data: result });
        });
    });

module.exports = router;
