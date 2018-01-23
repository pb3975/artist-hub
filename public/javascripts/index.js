// Prevent Form Submit
$('#search').submit(function(e) {
    e.preventDefault();
});
// let bearerToken = document.querySelector('#sink').value
let button = document.querySelector('#button')
let result = document.querySelector('#result')
let keyword = document.getElementById('keyword')


button.addEventListener('click', function( ) {

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
    

	console.log(response);
	})
	.fail(function(error) {
		console.log(error);
	});
})
