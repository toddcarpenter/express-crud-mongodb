const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;

var db;

MongoClient.connect('mongodb://tcarpenter:edjn^hnrSE#@ds011903.mlab.com:11903/quotes-test', (err, database) => {
  // start server only if we can connect to db
  if (err) {
    return console.log(err)
  }

  // retrieve database for later use
  db = database;

  // start server
  app.listen(3000, () => {
    console.log('on 3000');
  })
})

// tell Express to use EJS for the view engine
app.set('view engine', 'ejs');

// bodyParser is middleware to get form data & attach it to the body object
// middleware is basically a plugin for express
// must call this before CRUD handlers below
app.use(bodyParser.urlencoded({extended: true}))

// handle the GET request from the browser
// this is what is called initially (READ)
// first arg is the path, second param is the callback (tells the server what to do when the path is matched)
app.get('/', (req, res) => {
  console.log(__dirname);
  //res.sendFile(__dirname + '/index.html');

  db.collection('quotes').find().toArray((err, results) => {
    if (err) return console.log(err)

    // send index.ejs quotes as an array for use in its file
    res.render('index.ejs', {quotes: results})
  });
})

// handle the POST request from the browser
app.post('/quotes', (req, res) => {
  // the post request is attached the the body element by the bodyParser middleware we added above
  console.log(req.body);

  db
    // create a new collection called 'quotes'
    .collection('quotes')
    // save form entry
    .save(req.body, (err, result) => {
      if (err) {
        return console.log(err);
      }

      console.log('saved to db');
      res.redirect('/');
    });
})