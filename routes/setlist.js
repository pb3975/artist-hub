var express = require('express');
var router = express.Router();
const setlistfm = require('setlistfm-js')

var setlistfmClient = new setlistfm({
	key: "b70b2456-ba9a-4763-8804-c421fe00a682", // Insert your personal key here
	format: "json", // "json" or "xml", defaults to "json"
	language: "en", // defaults to "en"
});


router.post('/set', function(req, res, next) {
let artist = req.params.artist

setlistfmClient.searchArtists({
    artistName: 'Eminem'
  })
    .then(function(results) {
      // Returns results of the search
      return results
      console.log(results);
    })
    .catch(function(error) {
      // Returns error
    });
});
module.exports = router;