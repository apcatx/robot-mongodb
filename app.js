const express = require('express');
const mustacheExpress = require('mustache-express');
const app = express();
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/robots';

var findBrokeRobots = function(db, callback) {
  var notForHire = db.collection('robots');
  notForHire.find({
    "company": null
  }).toArray(function(err, result) {
    callback(result);
  });
}

var findNotForHire = function(db, callback) {
  var hired = db.collection('robots');
  hired.find({
    "company": {
      $nin: [null]
    }
  }).toArray(function(err, result) {
    callback(result);
  });
}

MongoClient.connect(url, function(err, db) {
  console.log('error?', err);
  console.log("Connected successfully to server");
  db.close();
});

app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/robotmustache');

app.use(express.static('public'));


app.get('/', function(request, response) {
  MongoClient.connect(url, function(err, db) {
    findNotForHire(db, function(result) {
        response.render('the_help', {
          staff: result
      })
    });
  });
});

app.get('/thehelp', function(request, response) {
  MongoClient.connect(url, function(err, db) {
    findNotForHire(db, function(result) {
      response.render('the_help', {
        staff: result
      })
    });
  });
});

app.get('/:username', function(request, response) {
  MongoClient.connect(url, function(err, db) {
    findBrokeRobots(db, function(result) {
      response.render('need_help', {
        staff: result
      });
    });
  });
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
});
