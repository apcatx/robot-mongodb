const express = require('express');
const mustacheExpress = require('mustache-express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/robots';

var findBrokeRobots = function(db, callback) {
  var notForHire = db.collection('robots');
  notForHire.find({
    "job": null
  }).toArray(function(err, result) {
    console.log("found", result.length, "users")
    callback(result);
  });
};

var findAllRobots = function(db, callback) {
  var notForHire = db.collection('robots');
  notForHire.find().toArray(function(err, result) {
    console.log("found ", result.length, "users")
    callback(result);
  });
};

MongoClient.connect(url, function(err, db) {
  console.log('error?', err);
  console.log("connected");

  findBrokeRobots(db, function() {
    console.log('Results are in.');
    db.close();
  });
});

app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.send('Hello there! Do you need ' + `<a href="http://localhost:3000/thehelp">Robots?</a>`);
});

app.get('/thehelp', function(req, res) {
  MongoClient.connect(url, function(err, db) {
    findAllRobots(db, function(result) {
      res.render('the_help', {
        staff: result
      });
    });
  });
});

app.get('/needhelp', function(req, res) {
  MongoClient.connect(url, function(err, db) {
    findBrokeRobots(db, function(result) {
      res.render('help_the_help', {
        staff: result
      });
    });
  });
});

app.get('/:id', function(req, res) {
  MongoClient.connect(url, function(err, db) {
    findAllRobots(db, function(result) {
      let staff = result.find(function(broke) {
        return broke.username.toLowerCase() === req.params.id;
      });
      res.render('need_help', {
        staff
      });
    });
  });
});

app.listen(3000, function() {
  console.log('I never want to deal with robots again!!');
});
