
//d03abe95d979d9a08ace2336a67520c4


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
  var weatherObj = reformat(data.list)
  var objectKeys  = Object.keys(weatherObj)
  var currentTemp = toFahrenheit(data.list[0].main.temp)
  $('.current').append(`<h1>${data.city.name}</h1>`)
  $('.current').append(`<i class="owf owf-5x owf-${data.list[0].weather[0].id}"></i>`)
  $('.current').append(`<h2>${currentTemp} F</h2>`)

  for (var i = 0; i < objectKeys.length; i++) {
    var max = Math.round(toFahrenheit(weatherObj[objectKeys[i]].max))
    var min = Math.round(toFahrenheit(weatherObj[objectKeys[i]].min))
    $('.forecast').append(`<div class="day">
        <h2>${weatherObj[objectKeys[i]].dow}</h2>
        <i class="owf owf-5x owf-${weatherObj[objectKeys[i]].icon_id}"></i>
        <h2>${max}/${min} F</h2>
      </div>`)
  }
}


function reformat(arr){
  var obj = {}
  var daysOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  for (var i = 0; i < arr.length; i++) {
    var date = arr[i].dt_txt.split(' ')[0]
    if (obj[date]) {
      if (obj[date].max<arr[i].main.temp) {
        obj[date].max = arr[i].main.temp
      } else if(obj[date].min>arr[i].main.temp){
        obj[date].min = arr[i].main.temp
      } else if(arr[i].dt_txt.split(' ')[1].trim() == '12:00:00'){
        console.log('hit');
        obj[date].description = arr[i].weather[0].description
        obj[date].icon_id = arr[i].weather[0].id
      }
    }else{
      var d = new Date(arr[i].dt_txt)
      console.log(arr[i].dt_txt);
      obj[date]={
        dow: daysOfWeek[d.getDay()],
        min: arr[i].main.temp_min,
        max: arr[i].main.temp_max,
        description: arr[i].weather[0].description,
        icon_id:arr[i].weather[0].id
      }
    }
  }
  console.log(obj);
  return obj
}

function toFahrenheit(temp){
  return Math.round(1.8*(temp - 273)+32)
}
