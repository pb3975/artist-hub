let bearerToken = document.querySelector('#sink').value
let button = document.querySelector('#button')
let result = document.querySelector('#result')
let keyword = document.getElementById('keyword')
let topSongs = document.querySelector('#top-songs')
let concerts = document.querySelector('#concerts')
const setlistButton = document.querySelector('#btn-setlist')
// let artist;
bearerToken = 'Bearer '+bearerToken;

let currentLatitude;
let currentLongitude;
let city;

function getLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(callback);
    } else { 
        console.log("Geolocation is not supported by this browser.");
    }
};

const minutes = (ms) => {
  ms = 1000*Math.round(ms/1000); // round to nearest second
  let d = new Date(ms);
  return (d.getUTCMinutes() + ':' + d.getUTCSeconds());
};


const randPic = (picList) => {
    var pic = picList[Math.floor(Math.random() * picList.length)];
    return pic;
};
window.onload = function() {







  // Prevent Form Submit
  $('#search').submit(function(e) {
    e.preventDefault();
  });




button.addEventListener('click', function( ) {
  let keyword = $('#keyword').val();
  let artist;
  // get current coordinates...
  getLocation(function (position) {
    var currentLatitude = position.coords.latitude;
    var currentLongitude = position.coords.longitude; 
    console.log(currentLongitude, currentLatitude);  

    //Get City from Coordinates
    $.ajax(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLatitude},${currentLongitude}&key=AIzaSyClV0bMDHQmNhgrZpJwC3-4Srz0wQrlWec`)
    .done(function(data) {
      if (data.results[1]) {
        //formatted address
        console.log(data.results[0].formatted_address)
       //find country name
            for (var i=0; i<data.results[0].address_components.length; i++) {
           for (var b=0;b<data.results[0].address_components[i].types.length;b++) {
               if (data.results[0].address_components[i].types[b] == "administrative_area_level_1") {
                   //this is the object you are looking for
                   city= data.results[0].address_components[i];
                   break;
               }
           }
       }
       //city data
      city = city.long_name;
      console.log(city);
      // Search For Concerts
      $.ajax({
        url: `/${keyword}/${city}`,
        type: 'GET'}
    )
      .done(function(response) {
        console.log(response);
        $('#concerts').empty();
        $('#concert-section').removeAttr("hidden");
        if (response.search.total_items > 0 && response.search.events.event[0]) {
          
        let data = response.search.events.event[0];
        let title = data.title;
        let date = Date(data.start_time);
        date = moment(date).format('dddd MMMM D');
        if (keyword.toLowerCase().search(title.toLowerCase()) !== -1) {
      $('#concerts').append(
          `<h1 class="h1 text-white"> Concerts </h1>
          <h1><a target="_blank" href="${data.url}" class="genric-btn success circle">${data.title} at ${data.venue_name} on ${date} </a></h1>
          <p class="text-white"> ${data.description} </p>
          <p class="spotify-link"> Learn more about <a target="_blank" class="spotify-link" href="${data.venue_url}">${data.venue_name}</a> </p>
          <h3 class="genric-btn success circle id="btn-setlist">Check Out a Recent Setlist! </h3>`
        );   


      }
      else {
        $('#concerts').append(
        `<h1 class="spotify-link"> Concerts </h1> 
        <p class="spotify-link">No upcomming concerts in your location</p>`);
      }
    }
    else {
      $('#concerts').append(
      `<h1 class="spotify-link"> Concerts </h1> 
      <p class="spotify-link">No upcomming concerts in your location</p>`);
    }
    });



    }});
  });
      // Get Artist info from Spotify
	$.ajax({
        url: `https://api.spotify.com/v1/search?q=${keyword}&type=artist&market=US&limit=1`,
        type: 'GET',
        headers: {"Authorization": bearerToken }
    })
	.done(function(response) {


  $('#spot-artist').empty();
  $('#song-table').empty();
  $('#img-section').removeAttr("hidden");
  $('#song-section').removeAttr("hidden");
 
        

    if (response.artists.items[0]) {
      console.log(response);
      artist = response.artists.items[0];
      $('#artist-name').text(artist.name);
      $('#artist-img').removeAttr("hidden");
        $("#artist-img").attr("src", `${artist.images[0].url}`);
        //Get Top Songs
              $.ajax({
                url: `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?country=US`,
                type: 'GET',
                headers: {"Authorization": bearerToken }
            })
            .done(function(response) {

              

            if (response) {
              let songs = response.tracks;
              $('#song-table').append(
               `
                <div class="table-head">
								<div class="serial">#</div>
								<div class="country">Title</div>
								<div class="visit">Duration</div>
								<div class="visit">Actions</div>
              </div>`);
              songs.forEach(function(song, i) {
               $('#song-table').append(
							`<div class="table-row">
								<div class="serial">${i+1}</div>
								<div class="country">${song.name}</div>
								<div class="visit">${minutes(song.duration_ms)}</div>
								<div class="visit"><a target="_blank" class="spotify-link" href="${song.external_urls.spotify}">Listen on Spotify</a></div>
							</div>`
               );
              });
            }
            else {
              $('#top-songs').append(`<h1>We don't have top tracks for that artist.. :(</h1>`) 
            }

            })

            .fail(function(error) {
            console.log(error);
            });
                    

    }
    else {
      $('#spot-artist').append(`<h1>We don't have any record of that artist.. :(</h1>`) 
    }
    
  })
  
  .fail(function(error) {
    console.log(error);
  });

setlistButton.addEventListener('click', function () {



  $.ajax(`/set/${keyword}`)
  .done(function(response) {
    let setlistAvailable = false;
    let setlists = response.setlist;
    console.log(setlists);
    setlists.forEach(function(setlist, i) {
      if (setlist.sets[i].set.length !== 0) {
        console.log("Setlist ", i, setlist.sets[i].set)
        setlistList = setlist.sets.set;
        console.log(setlistList);
        continue
      } 
      else
      { setlistAvailable = false;
        console.log("Bad Query");
        // $('#concerts').append(
        //   `<h3> We Couldn't find a recent ssetlist for this arts :(</h3>`
        // )
      }

    });
    


    // <div class="col-md-4 mt-sm-30">
    // 		<h3 class="mb-20">Ordered List</h3>
    // 		<div class="">
    // 			<ol class="ordered-list">
    // 				<li><span>Fta Keys</span></li>
    // 				<li><span>For Women Only Your Computer Usage</span></li>
    // 				<li><span>Facts Why Inkjet Printing Is Very Appealing</span>
    // 					<ol class="ordered-list-alpha">
    // 						<li><span>Addiction When Gambling Becomes</span>
    // 							<ol class="ordered-list-roman">
    // 								<li><span>Protective Preventative Maintenance</span></li>
    // 							</ol>
    // 						</li>
    // 					</ol>
    // 				</li>
    // 				<li><span>Dealing With Technical Support 10 Useful Tips</span></li>
    // 				<li><span>Make Myspace Your Best Designed Space</span></li>
    // 				<li><span>Cleaning And Organizing Your Computer</span></li>
    // 			</ol>
    // 		</div>
    // 	</div>
  });

});
  
});
}
