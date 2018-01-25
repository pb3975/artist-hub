var express = require('express');
var router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node')

// const clientId = '1c63d20daf9147c08f4b1f499347ec6f';
// const clientSecret = '11196469ad734de38ae9068d0ea2fad9';

const clientId = process.env.SPOTIFY_CLIENT;
const clientSecret = process.env.SPOTIFY_SECRET;

require('dotenv').config();

/* GET home page. */
router.get('/', function(req, res, next) {
  
// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});
 
// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
    let bearerToken = data.body['access_token'];

  res.render('index', { title: 'Music SPA', bearerToken: bearerToken });
});
});
module.exports = router;
