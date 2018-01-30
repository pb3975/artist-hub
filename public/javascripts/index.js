let bearerToken = document.querySelector('#sink').value
let button = document.querySelector('#button')
// let result = document.querySelector('#result')
let keyword = document.getElementById('keyword')
// let topSongs = document.querySelector('#top-songs')
// let concerts = document.querySelector('#concerts')

bearerToken = 'Bearer '+bearerToken;


function getLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(callback);
    } 
};

const minutes = (ms) => {
  ms = 1000*Math.round(ms/1000);
  let d = new Date(ms);
  let seconds;
  if (d.getSeconds() < 10) {
    seconds = ('0' + d.getUTCSeconds().toString());
  }
  else {
    seconds = d.getUTCSeconds();
  }
  return (d.getMinutes() + ':' + seconds);
};
  // Prevent Form Submit
  $('#search').submit(function(e) {
    e.preventDefault();
  });

  
// On Search
button.addEventListener('click', function( ) {
  $('#setlist-section').fadeOut();
  let keyword = $('#keyword').val();
  let artist;
  // get current coordinates...
  getLocation(function (position) {
    var currentLatitude = position.coords.latitude;
    var currentLongitude = position.coords.longitude;

    //Get City from Coordinates
    $.ajax(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLatitude},${currentLongitude}&key=AIzaSyClV0bMDHQmNhgrZpJwC3-4Srz0wQrlWec`)
    .done(function(data) {
      if (data.results[1]) {
        //formatted address
            for (var i=0; i<data.results[0].address_components.length; i++) {
           for (var b=0;b<data.results[0].address_components[i].types.length;b++) {
               if (data.results[0].address_components[i].types[b] == "administrative_area_level_1") {
                   city= data.results[0].address_components[i];
                   break;
               }
           }
       }
       //city data
      city = city.long_name;
      // Search For Concerts
      $.ajax({
        url: `/${keyword}/${city}`,
        type: 'GET'}
    )
      .done(function(response) {
        $('#concerts').empty();
        $('#concert-section').removeAttr("hidden");
        if (response.search.total_items > 0 && response.search.events.event[0]) {
        let data = response.search.events.event[0];
        let title = data.title;
        let date =  moment(data.start_time).format('dddd MMMM D');
        if (keyword.toLowerCase().search(title.toLowerCase()) !== -1) {
      $('#concerts').append(
          `<h1 class="h1 text-white"> Concerts </h1>
          <h1><a target="_blank" href="${data.url}" class="genric-btn success circle">${data.title} at ${data.venue_name} on ${date} </a></h1>
          <p class="text-white"> ${data.description} </p>
          <p class="spotify-link"> Learn more about <a target="_blank" class="spotify-link" href="${data.venue_url}">${data.venue_name}</a> </p>
          <h3 class="genric-btn success circle" id="btn-setlist">Check Out a Recent Setlist! </h3>`
        );   

        $('#btn-setlist').click(function() {
          $('#setlist-section').show();
          
        });

      }
      else {
        $('#concerts').append(
        `<h1 class="spotify-link"> Concerts </h1> 
        <p class="spotify-link">No upcomming concerts in your location</p>
        `);
      }
    }
    else {
      $('#concerts').append(
      `<h1 class="spotify-link"> Concerts </h1> 
      <p class="spotify-link">No upcomming concerts in your location</p>
      `);
    }});



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
                let genSearch = song.name
                songStr =  (genSearch.replace(/ *\([^)]*\) */g, "").split(/[-.?!]/)[0]).replace(/[^\w\s]/g, '').replace(/ /g,'-').replace(/--/g, '-');
                if (songStr[songStr.length -1] === '-'){
                  genSearch = `${artist.name.replace(/ /g,'-')}-${songStr}lyrics` ;
                }
                else{
                  genSearch = `${artist.name.replace(/ /g,'-')}-${songStr}-lyrics` ;
                }

               $('#song-table').append(
							`<div class="table-row">
								<div class="serial">${i+1}</div>
								<div class="country">${song.name}</div>
                <div class="visit">${minutes(song.duration_ms)}</div>
								<div><a target="_blank" class="genric-btn success circle" href="${song.external_urls.spotify}">Spotify</a>  <a target=_"blank" class="genric-btn genius circle" href="https://genius.com/${genSearch}">Lyrics from Genius</a> </div>
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


  $.ajax(`/${keyword}`)
  .done(function(response) {
    $('#setlist').empty();
    $('#setlist-header').empty();
    $('#setlist-date').empty();
    
    let songSet;  
    let concertData;  
    response.setlist.forEach(function(concert) {
      if (concert.sets.set.length > 0) {
        if (songSet === undefined) {
        songSet = concert.sets.set;
        concertData = concert;
        }
        else {
          songSet = songSet;
        }
      }
      else {
        songSet = songSet;
      }


        })
        if (songSet.length >  0) {
          songSet.forEach(function(set) {
            if (set.encore) {
              $('#setlist').append(
                `<h3 class="text-white">Encore:</h3>`);
            }

            set.song.forEach(function(song) {
              $('#setlist').append(
                `<li class="text-white"> ${song.name}</li>`
              )
            })

        });

    };
    if (songSet) {
      concertDate = moment(concertData.eventDate,'DD-MM-YYYY', true).format('dddd MMMM D');
      $('#setlist-header').text(`${concertData.artist.name} at ${concertData.venue.name} in ${concertData.venue.city.name}, ${concertData.venue.city.state}`);
      $('#setlist-date').text(`${concertDate}`);
    }

  });
 
    




  
});

