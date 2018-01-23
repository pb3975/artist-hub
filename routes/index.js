var express = require('express');
var router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node')

require('dotenv').config();

/* GET home page. */
router.get('/', function(req, res, next) {
  //
  var spotifyApi = new SpotifyWebApi({
    clientId : process.env.SPOTITFY_CLIENT,
    clientSecret : process.env.SPOTITFY_SECRET,
    // redirectUri : process.env.SPOTITFY_RED_URI
  });

  // Retireve Acces Token (Bearer)
  spotifyApi.clientCredentialsGrant()
  .then(function(data) {
  console.log(data.body['access_token'])
});

  res.render('index', { title: 'Music SPA' });
});

module.exports = router;
