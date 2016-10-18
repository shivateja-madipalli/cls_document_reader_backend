var express = require("express");
var Client = require("node-rest-client").Client;
var bodyParser = require('body-parser');
var json = require('express-json');

var multer= require('multer');

var client = new Client();
var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

var options = multer.diskStorage({ destination : 'uploads/' ,
  filename: function (req, file, cb) {
    cb(null, (Math.random().toString() + Date.now() + file.originalname));
  }
});

var upload = multer({ storage: options }).single('pdfFile');

app.post('/upload', function(req,res) {
  upload(req, res, function(err) {
    if(err) {
        console.log(err);
    }
    callbackMethod(req.file.path, req.body, function(innerRes) {
      console.log('RESPONSE: ', innerRes);
      return res.status(200).json(innerRes);
    });
  });
});

var callbackMethod = function(uploadedFilePath, fields, callback) {
  callback('SUCESSFULLY UPLAODED to path: ' + uploadedFilePath);
}

app.listen(port, function () {
  console.log('App is running on port ', port);
});


// backup

// app.get('/getdata', function (req, res) {
//   res.json('MAKE THIS HAPPEN');
// });
//
// app.post('/postdata', function (req, res) {
//   var uploadedFile = req.files;
//   var result = false;
//   return res.status(200).json(uploadedFile + fieldArrayList);
// });
