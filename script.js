let hist1 = document.createElement("button");
let currentWxCity = document.createElement("div");
let wxIconImg = document.createElement("img");
let currentTemp = document.createElement("div");
let currentHumidity = document.createElement("div");
let currentWind = document.createElement("div");
let currentUVindex = document.createElement("div");
//search  OpenWeather One Call API for city
// save to local storage
// display last 5 cities in search-history
let city;
let today = moment().format("MM/DD/YYYY");
let queryURL;

console.log(today);
getHistory();

var apiKey = "72055e427a01724fa3fd9ce3dd2c9a97";
let currentWeather = [];

$(".search-btn").click(function () {
  city = document.getElementById("city-picker").value;
  //  let city = $("#city-picker").value;
  console.log(city);
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
  localStorage.setItem("City", city);
  hist1.classList.add("btn", "search-btn", "hist1");
  hist1.innerHTML = city;
  $(".city-search").append(hist1); // place button on page for search history
  //
  // place city & date on page
  let cityString = city + " (" + today + ")";
  currentWxCity.classList.add("current-wx");
  currentWxCity.innerHTML = cityString;
  $(".current-weather").append(currentWxCity);

  // ----------------
  //generate & place icon
  let wxIconCode = currentWeather.weather[0].icon;
  console.log(wxIconCode);
  let wxIcon = `http://openweathermap.org/img/wn/${wxIconCode}.png`;
  wxIconImg.src = wxIcon;
  wxIconImg.setAttribute("style", "height: 1.5rem");
  $(".current-weather").append(wxIconImg);
  console.log(wxIcon);
  //
  // place remainder of data
  currentTemp.innerHTML = currentWeather.main.temp + "°";
  $(".current-weather").append(currentTemp);
  currentHumidity.innerHTML = currentWeather.main.humidity + "%";
  $(".current-weather").append(currentHumidity);
  currentWind.innerHTML =
    "Wind from " +
    currentWeather.wind.deg +
    " degrees at " +
    currentWeather.wind.speed +
    " mph";
  $(".current-weather").append(currentWind);

  currentUVindex.innerHTML = "UV index - missing";
  $(".current-weather").append(currentUVindex);

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
