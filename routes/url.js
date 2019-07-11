const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const shortId = require('shortid');
const config = require('config');
const Url = require('../models/Url');

// @route     POST /api/url/shorten
// @desc      Create short URL

router.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;
  const baseUrl = config.get('baseUrl');

  //Check base url
  if (!validUrl.isUri) {
    return res.status(401).json({
      message: 'Invalid base Url'
    });
  }

  //Create code
  const urlCode = shortId.generate();

  //Check long url
  if (validUrl.isUri(longUrl)) {
    try {
      let url = await Url.findOne({ longUrl });
      if (url) {
        res.json(url);
      } else{
        const shortUrl = baseUrl + '/' + urlCode;

        url = new Url ({
          longUrl,
          shortUrl,
          urlCode,
          date : new Date()
        });

        await url.save();

        res.json(url);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json('Server Error');

    }
  } else {
    res.status(401).json('Invalid url')
  }

})

module.exports = router