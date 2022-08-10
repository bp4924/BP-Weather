//search  OpenWeather One Call API for city
// save to local storage
// display last 5 cities in search-history
//var city = "Nome";
let today = moment().format("MM/DD/YYYY");
let queryURL;

console.log(today);

var apiKey = "1ae665f43747a0f78a49241d740d7b7e";
let currentWeather = [];

$(".search-btn").click(function () {
  console.log("clicked search");
  city = document.getElementById("city-picker").value;
  console.log("new " + city);
  makeQueryUrl();
  console.log(queryURL);
  getCurrent();
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
      console.log(currentWeather.main.temp);
    })
    .catch((err) => {
      console.error(err);
    });
}
/*
  .then(loadedQuestions => {
    console.log(loadedQuestions.results);
    questions = loadedQuestions.results.map(loadedQuestion => {
      const formattedQuestion = {
        question: loadedQuestion.question
      };

      const answerChoices = [... loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
      answerChoices.splice(
        formattedQuestion.answer -1, 
        0, 
        loadedQuestion.correct_answer);

      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      })
      return formattedQuestion;
    });
  })
*/
