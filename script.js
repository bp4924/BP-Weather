let hist1 = document.createElement("button");

let currentWxCity = document.createElement("div");
let currentTemp = document.createElement("div");
let currentHumidity = document.createElement("div");
let currentWind = document.createElement("div");
let currentUVindex = document.createElement("div");

let today = moment().format("MM/DD/YYYY");

// TODO: ------
// save to local storage
// display last 5 cities in search-history
// clear previous results before reload

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
  return queryURL;
}

function getWeather(queryURL) {
  const res = fetch(queryURL)
    .then((res) => {
      return res.json();
    })
    .then((loadedWeather) => {
      return loadedWeather;
    })
    .catch((err) => {
      console.error(err);
    });
  return res;
}

function loadCurrentDay(weather) {
  //create elements when current weather is loaded
  localStorage.setItem("City", city);
  hist1.classList.add("btn", "search-btn", "hist1");
  hist1.innerHTML = city;
  $(".city-search").append(hist1); // place button on page for search history

  //
  // place city & date on page
  let cityString = city + " (" + today + ")";
  currentWxCity.classList.add("current-wx-city");
  currentWxCity.innerHTML = cityString;
  currentWxCity.setAttribute(
    "style",
    "font-weight: 700; font-style: italic; font-size: 2.5rem"
  );
  $(".current-weather").append(currentWxCity);

  // ----------------
  //generate & place icon
  let wxIconCode = weather.current.weather[0].icon;
  const wxIconImg = getWxIcon(wxIconCode);
  currentWxCity.append(wxIconImg);

  // place remainder of data
  // Temperature
  currentTemp.innerHTML =
    "Temperature: " + Math.floor(weather.current.temp) + "°";
  currentTemp.setAttribute(
    "style",
    "font-weight: 700; font-style: italic; font-size: 1.5rem"
  );
  $(".current-weather").append(currentTemp);

  // Humidity
  currentHumidity.innerHTML =
    "Humidity: " + Math.floor(weather.current.humidity) + "%";
  $(".current-weather").append(currentHumidity);
  currentWind.innerHTML =
    "Wind from " +
    weather.current.wind_deg +
    "° at " +
    Math.floor(weather.current.wind_speed) +
    " mph";
  $(".current-weather").append(currentWind);

  //UV w/colors
  let uvIndex = weather.current.uvi;
  currentUVindex.innerHTML = "UV index: " + Math.floor(uvIndex);
  currentUVindex.setAttribute("style", "margin: 1rem");
  if (uvIndex < 4) {
    currentUVindex.setAttribute(
      "style",
      "background-color: darkgrey; color: white"
    );
  } else if (uvIndex > 8) {
    currentUVindex.setAttribute("style", "background-color: red; color: white");
  } else {
    currentUVindex.setAttribute(
      "style",
      "background-color: green; color: white"
    );
  }

  $(".current-weather").append(currentUVindex);
}

// load forcast items
function loadForecast(weather) {
  for (var i = 0; i <= 4; i++) {
    const index = i + 1;
    let forecastIdString = "#day" + index;
    let forecastDay = moment().add(index, "days").format("MM/DD/YYYY");

    const forecastCardItem = document.createElement("div");
    forecastCardItem.classList.add("forecast-wx-city");
    forecastCardItem.setAttribute(
      "style",
      "font-weight: 700; font-style: italic; font-size: 1.5rem"
    );
    forecastCardItem.innerHTML = forecastDay;
    $(forecastIdString).append(forecastCardItem);

    // Forecast icon
    let forecastWxIconCode = weather.daily[index].weather[0].icon;
    const wxImg = getWxIcon(forecastWxIconCode);
    forecastCardItem.append(wxImg);

    // forecast temperature
    const temperatureDiv = document.createElement("div");
    let forecastTemp = Math.floor(weather.daily[index].temp.day);
    temperatureDiv.innerHTML = "Temperature: " + forecastTemp + "°";
    temperatureDiv.setAttribute(
      "style",
      "font-weight: 700; font-style: font-size: 1.25rem"
    );
    $(forecastIdString).append(temperatureDiv);

    // forecast wind speed and direction
    const windDiv = document.createElement("div");
    const forecastWindDir = weather.daily[index].wind_deg;
    const forecastWindSpd = Math.floor(weather.daily[index].wind_speed);
    const forecastWind =
      "Wind from " + forecastWindDir + "° at " + forecastWindSpd + " mph";
    windDiv.innerHTML = forecastWind;
    $(forecastIdString).append(windDiv);

    // forecast humidity
    const humidityDiv = document.createElement("div");
    let forecastHumidity = weather.daily[index].humidity;
    humidityDiv.innerHTML = "Humidity: " + forecastHumidity + "%";
    $(forecastIdString).append(humidityDiv);
  }
}

function getHistory() {
  for (var i = 0; i <= 4; i++) {
    console.log(i);
  }
}

// get weather icon from icon code
function getWxIcon(wxIconCode) {
  let wxIconImg = document.createElement("img");
  let wxIconSrc = `https://openweathermap.org/img/wn/${wxIconCode}.png`;
  wxIconImg.src = wxIconSrc;
  wxIconImg.setAttribute("style", "height: 4rem");
  return wxIconImg;
}

// search
$(".search-btn").click(async function () {
  //remove previous results
  $(".day").empty();

  city = document.getElementById("city-picker").value;

  // get coordinates for selected city
  const cityQuery = makeCityQuery(city);
  const cityCoords = await getCityCoords(cityQuery);

  // get weather for selected city
  const coords = loadLatLon(cityCoords);
  const queryURL = makeQueryUrl(coords);
  const weather = await getWeather(queryURL);

  //  load results
  loadCurrentDay(weather);
  loadForecast(weather);
});
