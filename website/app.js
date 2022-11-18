/* Global Variables */
const generateBtn = document.querySelector("#generate");
const ZIPCodeInput = document.querySelector("#zip");
const feelingsTextArea = document.querySelector("#feelings");
const dateOutput = document.querySelector("#date");
const countryOutput = document.querySelector("#country");
const weatherOutput = document.querySelector("#weather");
const tempOutput = document.querySelector("#temp");
const iconOutput = document.querySelector("#icon");
const contentOutput = document.querySelector("#content");
const entryHolder = document.querySelector("#entryHolder");
const errorOutput = document.querySelector("#err");
const inputArea = document.querySelector("#input-area");
const outputArea = document.querySelector("#output-area");
const arrow = document.querySelector("#arrow");

// Create a new date instance dynamically with JS
const d = new Date();
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const newDate =
  months[d.getMonth()] + "." + d.getDate() + "." + d.getFullYear();

/*when clicking on the generate button chain of async promises will be executed consequently*/
//fetching remote api and get resolved data
//consuming returned data from the previous promise and assign them to an object
//post returned data from the previous promise to the local server
//get data from the local server
//use data from local server to update UI
generateBtn.addEventListener("click", handleAPI);
function handleAPI() {
  //open-weather API info
  const key = "1397df6969c093d63159553d0140d888";
  const URL = `https://api.openweathermap.org/data/2.5/weather?zip=${ZIPCodeInput.value}&appid=${key}`;
  //validate zip code input is not empty
  if (ZIPCodeInput.value) {
    //if valid change border color back to default
    ZIPCodeInput.style.cssText = "border-color:var(quinary-color)";
    fetchAPI(URL)
      .then((data) => consumeDataFromAPI(data))
      .then((data) => postToServer("/post", data))
      .then(() => getFromServer("/getAll"))
      .then((data) => putDataInUI(data));
  } else {
    //if not valid change border color to red and chnage placeholder
    ZIPCodeInput.style.cssText = "border-color:red";
    ZIPCodeInput.placeholder = "required input *";
  }
}

//fetch open-weather api and return the resolved data
async function fetchAPI(url) {
  const fetchAPI = await fetch(url);
  const resolvedData = await fetchAPI.json();
  console.log(resolvedData);
  return resolvedData;
}

// consume data from remote api and assign them to an object
async function consumeDataFromAPI(data) {
  let UIData;
  if (data.cod != 200) {
    UIData = {
      error: data.message,
    };
  } else {
    UIData = {
      date: newDate,
      temp: data.main.temp,
      weather: data.weather[0].main,
      icon: data.weather[0].icon,
      country: data.sys.country,
      region: data.name,
      feelings: feelingsTextArea.value,
    };
  }
  return UIData;
}

//post data to local server and get response
async function postToServer(url = "", data = {}) {
  const fetchedData = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  // const parsedData = await fetchedData.json();
  // return parsedData;
}

//get data body from the local server
async function getFromServer(url = "") {
  const fetchedData = await fetch(url);
  const parsedData = await fetchedData.json();
  return parsedData;
}

//update UI based on the returned data
async function putDataInUI(data) {
  const result = await data;
  const iconURL = `http://openweathermap.org/img/wn/${await result.icon}.png`;
  //hide input area and show output area
  inputArea.style.display = "none";
  outputArea.style.display = "flex";
  //check if the response is valid data
  if (result.date && result.temp) {
    //hide error field & show the entryholder fields container
    errorOutput.style.display = "none";
    entryHolder.style.display = "flex";
    dateOutput.textContent = await result.date;
    countryOutput.textContent = `${await result.country},${await result.region}`;
    tempOutput.textContent = Math.round((((await result.temp) - 32) * 5) / 9);
    weatherOutput.textContent = await result.weather;
    iconOutput.src = iconURL;
    contentOutput.textContent =
      (await result.feelings) || "please, tell us what do you feel?!!";
  } else {
    //show error field & hide the entryholder fields container
    entryHolder.style.display = "none";
    errorOutput.style.display = "block";
    errorOutput.textContent = result.error;
    reloadApp();
  }
  arrow.style.display = "flex";
}

/*UI related logic*/

//handle clicking on the arrow to go back one step and hide the arrow
arrow.addEventListener("click", () => {
  inputArea.style.display = "flex";
  outputArea.style.display = "none";
  arrow.style.display = "none";
});

//reload app incase the request was an error message
function reloadApp() {
  setInterval(() => {
    errorOutput.textContent += ".";
  }, 200);

  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

//clean all the fields after reloading
function emptyFields() {
  ZIPCodeInput.value = "";
  feelingsTextArea.value = "";
}
emptyFields();
