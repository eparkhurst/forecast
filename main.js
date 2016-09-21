console.log('hit');
//d03abe95d979d9a08ace2336a67520c4

$( "body" ).append( "<p>Test</p>" );

if (sessionStorage.getItem('location')) {
  var geolocation = JSON.parse(sessionStorage.getItem('location'))
  getWeatherData(geolocation.lat, geolocation.lng)
}else{
  getLocation()
}



function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          getWeatherData(position.coords.latitude, position.coords.longitude)
          var loc = {
            lat:position.coords.latitude,
            lng:position.coords.longitude
          }
          sessionStorage.setItem('location', JSON.stringify(loc));
          console.log(position.coords);
        });
    } else {
      console.log('No geolocation');
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}


function getWeatherData(lat, long){
  $.get("http://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+long+"&APPID=d03abe95d979d9a08ace2336a67520c4",
   function(data){
     populatePage(data)
  })
}

function populatePage(data){
  var currentTemp = Math.round(1.8*(data.list[0].main.temp - 273)+32)
  console.log(data);
  $('.current').append(`<h1>${data.city.name}</h1>`)
  $('.current').append(`<i class="owf owf-5x owf-${data.list[0].weather[0].id}"></i>`)
  $('.current').append(`<h2>${currentTemp} F</h2>`)
  console.log(data.list[0]);
}
