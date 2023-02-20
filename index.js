require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const url = require('url');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static(`${process.cwd()}/public`));

// Basic Configuration
const port = process.env.PORT || 3000;
const db = [];

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {
  const submittedUrl = req.body.url;
  const parsedUrl = url.parse(submittedUrl);
  if (!parsedUrl.protocol || !parsedUrl.hostname) {
    res.json({ error: 'invalid url' });
    return;
  }
  dns.lookup(parsedUrl.hostname, function(err) {
    if (err) {
      res.json({ error: 'invalid url' });
      return;
    }
    const shortUrl = db.length;
    db.push(submittedUrl);
    res.json({ original_url: submittedUrl, short_url: shortUrl });
  });
});

app.get('/api/shorturl/:shortUrl', function(req, res) {
  const shortUrl = parseInt(req.params.shortUrl);
  if (isNaN(shortUrl) || shortUrl >= db.length) {
    res.json({ error: 'invalid short url' });
    return;
  }
  res.redirect(db[shortUrl]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
