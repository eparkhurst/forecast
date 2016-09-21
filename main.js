
//d03abe95d979d9a08ace2336a67520c4

var $loading = $('.gears').show();

if (sessionStorage.getItem('location')) {
  var geolocation = JSON.parse(sessionStorage.getItem('location'))
  getWeatherData(geolocation.lat, geolocation.lng)
}else{
  getLocation()
}



function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          console.log(position);
          getWeatherData(position.coords.latitude.toFixed(4), position.coords.longitude.toFixed(4))
          var loc = {
            lat:position.coords.latitude.toFixed(4),
            lng:position.coords.longitude.toFixed(4)
          }
          sessionStorage.setItem('location', JSON.stringify(loc));
        });
    } else {
      console.log('No geolocation using New York, NY');
      getWeatherData(40.7128, -74.0059)
    }
}


function getWeatherData(lat, long){
  $.get(`https://vast-hollows-78143.herokuapp.com/${lat}/${long}`,
   function(data){
     console.log(JSON.parse(data.body));
     populatePage(JSON.parse(data.body))
     $loading.hide()
  })
}

function populatePage(data){
  var weatherObj = reformat(data.list)
  var objectKeys  = Object.keys(weatherObj)
  var currentTemp = toFahrenheit(data.list[0].main.temp)
  $('.current').append(`<h1>${data.city.name}</h1>`)
  $('.current').append(`<i class="owf owf-5x owf-${data.list[0].weather[0].id}"></i>`)
  $('.current').append(`<h2>${currentTemp} &#8457</h2>`)

  for (var i = 0; i < 5; i++) {
    var max = Math.round(toFahrenheit(weatherObj[objectKeys[i]].max))
    var min = Math.round(toFahrenheit(weatherObj[objectKeys[i]].min))
    $('.forecast').append(`<div class="day">
        <h2>${weatherObj[objectKeys[i]].dow}</h2>
        <i class="owf owf-5x owf-${weatherObj[objectKeys[i]].icon_id}"></i>
        <h3>${weatherObj[objectKeys[i]].description}</h3>
        <h3>${max}/${min} &#8457 </h3>
      </div>`)
  }
}


function reformat(arr){
  var obj = {}
  var daysOfWeek = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
  for (var i = 0; i < arr.length; i++) {
    var date = arr[i].dt_txt.split(' ')[0]
    if (obj[date]) {
      if (obj[date].max<arr[i].main.temp) {
        obj[date].max = arr[i].main.temp
      } else if(obj[date].min>arr[i].main.temp){
        obj[date].min = arr[i].main.temp
      } else if(arr[i].dt_txt.split(' ')[1].trim() == '12:00:00'){
        obj[date].description = arr[i].weather[0].description
        obj[date].icon_id = arr[i].weather[0].id
      }
    }else{
      var d = new Date(arr[i].dt_txt.split(' ')[0])
      obj[date]={
        dow: daysOfWeek[d.getDay()],
        min: arr[i].main.temp_min,
        max: arr[i].main.temp_max,
        description: arr[i].weather[0].description,
        icon_id:arr[i].weather[0].id
      }
    }
  }
  return obj
}

function toFahrenheit(temp){
  return Math.round(1.8*(temp - 273)+32)
}
