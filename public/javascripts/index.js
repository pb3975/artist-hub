window.onload = function() {

  // Prevent Form Submit
$('#search').submit(function(e) {
  e.preventDefault();
});


  if (navigator.geolocation) {
    // support geolocation
    var success = function(position){
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        console.log('here latitude :'+latitude+' && longitude :'+longitude);
    }
    var errors = function(){
        console.log('not working');
    }
    navigator.geolocation.getCurrentPosition(success, errors);
} else {
    alert('upgrade your browser !');
};





// let bearerToken = document.querySelector('#sink').value
let button = document.querySelector('#button')
let result = document.querySelector('#result')
let keyword = document.getElementById('keyword')


button.addEventListener('click', function( ) {

  let keyword = $('#keyword').val();
  let bearerToken = 'Bearer XXXXX'
	$.ajax({
        url: `https://api.spotify.com/v1/search?q=${keyword}&type=artist&market=US&limit=1`,
        type: 'GET',
        headers: {"Authorization": bearerToken }
    })
	.done(function(response) {


        $('#spot-artist').empty();
        

    if (response) {
      console.log(response);
      let artist = response.artists.items[0]
        $('#spot-artist').append(`<li><h1>${artist.name}</h1> Image: <img src="${artist.images[0].url}"></li>`) 
    }
    else {
      $('#spot-artist').append(`<h1>We don't have any record of that artist.. :(</h1>`) 
    }
    

	console.log(response);
  })
  
	.fail(function(error) {
		console.log(error);
  });

  // Get User Location From Google Maps API
  $.ajax(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=[KEYHERE]`)
.done(function(data) {
  console.log(data);
});

// Get Latest Setlist from setlist.fm
$.ajax({
  url: `https://api.setlist.fm/rest/1.0/search/setlists?artistName=${keyword}&p=1`,
  type: 'GET',
  headers: {"x-api-key": "[KEY]",
            "Accept": "application/json",
            'Access-Control-Allow-Origin': 'http://localhost:3000'}
})
.done(function(response) {
  console.log(setlist);
});


})
};
