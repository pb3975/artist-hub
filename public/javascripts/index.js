let bearerToken = document.querySelector('#sink').value
let button = document.querySelector('#button')
let result = document.querySelector('#result')
let keyword = document.getElementById('keyword')
bearerToken = 'Bearer '+bearerToken;

window.onload = function() {






  // Prevent Form Submit
  $('#search').submit(function(e) {
    e.preventDefault();
  });


   
  




button.addEventListener('click', function( ) {
  

  

    // $.ajax(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${late},${long}&key=AIzaSyClV0bMDHQmNhgrZpJwC3-4Srz0wQrlWec`)
    // .done(function(data) {
    //   console.log(data);
    // });

      
  let keyword = $('#keyword').val();
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
    
  })
  
	.fail(function(error) {
		console.log(error);
  });



// Get Latest Setlist from setlist.fm
// $.ajax({
//   url: `https://api.setlist.fm/rest/1.0/search/setlists?artistName=${keyword}&p=1`,
//   type: 'GET',
//   headers: {"x-api-key": "[KEY]",
//             "Accept": "application/json",
//             'Access-Control-Allow-Origin': 'http://localhost:3000'}
// })
// .done(function(response) {
//   console.log(setlist);
// });


})
}
