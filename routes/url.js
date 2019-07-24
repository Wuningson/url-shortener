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
  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json({
      message: 'Invalid base Url'
    });
  }

  //Create code
  const urlCode = shortId.generate();

  //Checks if long url is valid
  if (validUrl.isUri(longUrl)) {
    try {
      //checks if long url already exists in database
      let url = await Url.findOne({ longUrl });
      if (url) {
        //if long url exists, returns the entire object
        res.json(url);
      } else{
        // if long url doesn't exist
        const shortUrl = baseUrl + '/' + urlCode;
        //concatenates baseUrl defined in the config which is the host domain and the urlCode which is a
        //randomly generated string of numbers and letters
        //creates the new url and adds the long, short and urlCode including a date property
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

// @route   POST/api/url/custom
// desc     create custom shortened url
router.post('/custom', async (req, res) =>{
  const {longUrl, customUrl} = req.body;
  const baseUrl = config.get('baseUrl');

  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json({
      message: 'Invalid base Url'
    });
  }

  if (validUrl.isUri(longUrl)) {
    let url = await Url.findOne({ longUrl });
    if (url) {
      res.json(url);
    } else {
      try {
        const urlCode = customUrl
        const shortUrl = baseUrl + `/${urlCode}`;
        url = new Url({
          urlCode,
          longUrl,
          shortUrl,
          date: new Date()
        });
        await url.save();
      } catch(err) {
        console.log(err);
        res.status(500).json('Server Error');
      }
    }
  }else {
    res.status(401).json('Invalid Url Code');
  }
})

module.exports = router