require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const body_parser = require('body-parser');
const mongodb = require("mongodb")

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

const urlSchema = new mongoose.Schema({
  url: {type: String},
  shortUrl: {type: Number}
})

const Url = mongoose.model('Url', urlSchema)

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(body_parser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {
  const url = req.body.url
  const shortUrl = Math.floor(Math.random() * 10000)

  const newUrl = new Url({ url, shortUrl})
  newUrl.save().then(() => {
    res.json({original_url: url, short_url: shortUrl})
  }).catch(err => console.error(err));
})

app.get('/api/shorturl/:num', function(req, res) {
  const num = req.params.num

  Url.findOne({ shortUrl:Number(num)}).then(data => {
    if(data) {
      res.redirect(data.url)
    }
    else {
      res.json({error: 'invalid url'})
    }
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
