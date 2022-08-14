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

function getWeather(queryURL) {
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

function loadCurrentDay(weather) {
  //create elements when current weather is loaded
  console.log(weather);
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
  console.log(wxIconCode);
  getWxIcon(wxIconCode);
  $(".current-weather").append(wxIconImg);
  //
  // place remainder of data
  currentTemp.innerHTML = "Temperature: " + weather.current.temp + "°";
  $(".current-weather").append(currentTemp);

  currentHumidity.innerHTML = "Humidity: " + weather.current.humidity + "%";
  $(".current-weather").append(currentHumidity);
  currentWind.innerHTML =
    "Wind from " +
    weather.current.wind_deg +
    "° at " +
    weather.current.wind_speed +
    " mph";
  $(".current-weather").append(currentWind);

  currentUVindex.innerHTML = "UV index: " + weather.current.uvi;
  $(".current-weather").append(currentUVindex);
}

function loadForecast(weather) {
  for (var i = 0; i <= 4; i++) {
    index = i + 1;
    let forecastIdString = "#day" + index;
    let forecastDay = moment().add(index, "days").format("MM/DD/YYYY");
    console.log(forecastDay);

    let forecastCardItem = document.createElement("div");
    forecastCardItem.innerHTML = forecastDay;
    $(forecastIdString).append(forecastCardItem);

    forecastCardItem = document.createElement("div");
    let forecastTemp = weather.daily[index].temp.day;
    forecastCardItem.innerHTML = forecastTemp + "°";
    $(forecastIdString).append(forecastCardItem);

    //    let forecastWxItemImg = document.createElement("img");
    let forecastWxIconCode = weather.daily[index].weather[0].icon;
    getWxIcon(forecastWxIconCode);
    console.log(wxIconImg);
    let forecastWxIconImg = document.createElement("img");
    forecastCardItem.append(wxIconImg);

    /*
    $(forecastWxItemImg).append(wxIconImg);
    console.log(forecastWxIconCode);
*/
    // wind speed
    forecastCardItem = document.createElement("div");
    let forecastWindDir = weather.daily[index].wind_deg;
    let forecastWindSpd = weather.daily[index].wind_speed;
    forecastWind =
      "Wind from " + forecastWindDir + "° at " + forecastWindSpd + " mph";
    forecastCardItem.innerHTML = forecastWind;
    $(forecastIdString).append(forecastCardItem);

    // humidity
    forecastCardItem = document.createElement("div");
    let forecastHumidity = weather.daily[index].humidity;
    forecastCardItem.innerHTML = "Humidity: " + forecastHumidity + "%";
    $(forecastIdString).append(forecastCardItem);

    //    console.log(wxIconCode);
    //    console.log(wxIconImg);
    console.log(forecastIdString);
  }
}

function getHistory() {
  for (var i = 0; i <= 4; i++) {
    console.log(i);
  }
}

function getWxIcon(wxIconCode) {
  let wxIcon = `https://openweathermap.org/img/wn/${wxIconCode}.png`;
  wxIconImg.src = wxIcon;
  wxIconImg.setAttribute("style", "height: 4rem");
  return wxIconImg;
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
  const weather = await getWeather(queryURL);
  loadCurrentDay(weather);
  loadForecast(weather);
});
