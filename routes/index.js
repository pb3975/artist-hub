const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node')
const setlistfm = require('setlistfm-js')
const eventful = require('eventful-node');
const eventfulClient = new eventful.Client(process.env.EVENTFUL_KEY);

const clientId = process.env.SPOTIFY_CLIENT;
const clientSecret = process.env.SPOTIFY_SECRET;
const setlistKey = process.env.SETLIST_FM_KEY;
let bearerToken;

var setlistfmClient = new setlistfm({
	key: setlistKey,
	format: "json", 
	language: "en", 
});
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
    bearerToken = data.body['access_token'];


  

  res.render('index', { title: 'Artist-Hub', bearerToken: bearerToken, res: res });
});
});


router.get('/:artist', function(req, res, next) {
  let artist = req.params.artist
  
  setlistfmClient.searchSetlists({
      artistName: artist
    })
      .then(function(results) {

        res.send(results);
      })
      .catch(function(error) {
        res.send(error);
      });
  });


  router.get('/:artist/:city', function(req, res, next) {
    let artist = req.params.artist
    let city = req.params.city
    
    eventfulClient.searchEvents({
        keywords: artist,
        location: city

      }, function(err, data){
        if (err) {
          return console.log(err);
        }
       else {
        res.send(data);
        }
        });

    });
module.exports = router;
