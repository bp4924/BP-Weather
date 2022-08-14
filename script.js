let hist1 = document.createElement("button");

let currentWxCity = document.createElement("div");
let wxIconImg = document.createElement("img");
let currentTemp = document.createElement("div");
let currentHumidity = document.createElement("div");
let currentWind = document.createElement("div");
let currentUVindex = document.createElement("div");

let today = moment().format("MM/DD/YYYY");

// TODO: ------
// save to local storage
// display last 5 cities in search-history

console.log(today);

function makeCityQuery(city) {
  const cityQueryString =
    "https://api.geoapify.com/v1/geocode/search?text=" +
    city +
    "&apiKey=92450b90549f40a9970b46139ae2ed67";
  console.log("cityQueryString=" + cityQueryString);
  return cityQueryString;
}

async function getCityCoords(cityQueryString) {
  let res = await fetch(cityQueryString)
    .then((res) => {
      return res.json();
    })
    .then((loadedCity) => {
      let curCity = loadedCity;
      console.log(curCity);
      return curCity;
    })
    .catch((err) => {
      console.error(err);
    });
  return res;
}

var apiKey = "72055e427a01724fa3fd9ce3dd2c9a97"; // openweather api key
let currentWeather = [];

function loadLatLon(cityCoords) {
  let lat = cityCoords.features[0].bbox[1],
    lon = cityCoords.features[0].bbox[0];

  console.log(lat, lon);

  return [lat, lon];
}

function makeQueryUrl(coords) {
  let queryURL =
    "https://api.openweathermap.org/data/3.0/onecall?lat=" +
    coords[0] +
    "&lon=" +
    coords[1] +
    "&appid=" +
    apiKey +
    "&units=imperial";
  console.log(queryURL);
  return queryURL;
}

function getCurrentDay(queryURL) {
  const res = fetch(queryURL)
    .then((res) => {
      return res.json();
    })
    .then((loadedWeather) => {
      return loadedWeather;
    })
    /*city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index*/
    .catch((err) => {
      console.error(err);
    });
  return res;
}

function loadCurrentDay(currentWeather) {
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
  let wxIconCode = currentWeather.current.weather[0].icon;
  console.log(wxIconCode);
  let wxIcon = `http://openweathermap.org/img/wn/${wxIconCode}.png`;
  wxIconImg.src = wxIcon;
  wxIconImg.setAttribute("style", "height: 2rem");
  $(".current-weather").append(wxIconImg);
  console.log(wxIcon);
  //
  // place remainder of data
  currentTemp.innerHTML = "Temperature: " + currentWeather.current.temp + "°";
  $(".current-weather").append(currentTemp);
  currentHumidity.innerHTML =
    "Humidity: " + currentWeather.current.humidity + "%";
  $(".current-weather").append(currentHumidity);
  currentWind.innerHTML =
    "Wind from " +
    currentWeather.current.wind_deg +
    " degrees at " +
    currentWeather.current.wind_speed +
    " mph";
  $(".current-weather").append(currentWind);

  currentUVindex.innerHTML = "UV index: " + currentWeather.current.uvi;
  $(".current-weather").append(currentUVindex);

  console.log("Temperature " + currentWeather.current.temp + "°");
  console.log("Humidity " + currentWeather.current.humidity + "%");
  console.log(
    "Wind from " +
      currentWeather.current.wind_deg +
      " degrees at " +
      currentWeather.current.wind_speed +
      " mph"
  );
  console.log("UV index: " + currentWeather.current.uvi);
}

function getForecast() {
  console.log("forecast");
}

function getHistory() {
  for (var i = 0; i <= 4; i++) {
    console.log(i);
  }
}

$(".search-btn").click(async function () {
  city = document.getElementById("city-picker").value;
  console.log("city= " + city);

  // get coordinates for selected city
  const cityQuery = makeCityQuery(city);

  const cityCoords = await getCityCoords(cityQuery);

  // get weather for selected city
  const coords = loadLatLon(cityCoords);
  const queryURL = makeQueryUrl(coords);
  const currentDay = await getCurrentDay(queryURL);
  loadCurrentDay(currentDay);
  getForecast();
});
