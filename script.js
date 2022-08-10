let hist1 = document.createElement("button");
//search  OpenWeather One Call API for city
// save to local storage
// display last 5 cities in search-history
//var city = "Nome";
let today = moment().format("MM/DD/YYYY");
let queryURL;

console.log(today);
getHistory();

var apiKey = "72055e427a01724fa3fd9ce3dd2c9a97";
let currentWeather = [];

$(".search-btn").click(function () {
  makeQueryUrl();
  console.log(queryURL);
  getCurrent();
  getForecast();
});

function makeQueryUrl() {
  queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiKey +
    "&units=imperial";
}

function getCurrent() {
  fetch(queryURL)
    .then((res) => {
      return res.json();
    })
    .then((loadedWeather) => {
      currentWeather = loadedWeather;
      loadCurrent();
    })
    /*city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index*/
    .catch((err) => {
      console.error(err);
    });
}

function loadCurrent() {
  //create elements when current weather is loaded
  console.log(currentWeather);
  hist1.classList.add("btn", "search-btn", "hist1");
  hist1.innerHTML = city;
  $(".city-search").append(hist1);

  console.log(city + " (" + today + ")");
  console.log(currentWeather.weather[0].icon);
  console.log("Temperature " + currentWeather.main.temp + "°");
  console.log("Humidity " + currentWeather.main.humidity + "%");
  console.log(
    "Wind from " +
      currentWeather.wind.deg +
      " degrees at " +
      currentWeather.wind.speed +
      " mph"
  );
  console.log("UV index - missing");
}

function getForecast() {
  console.log("forecast");
}

function getHistory() {
  for (var i = 0; i <= 4; i++) {
    console.log(i);
  }
}
