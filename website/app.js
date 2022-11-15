/* Global Variables */
const generateBtn = document.querySelector("#generate");
const ZIPCodeInput = document.querySelector("#zip");
const feelingsTextArea = document.querySelector("#feelings");
const dateOutput = document.querySelector("#date");
const tempOutput = document.querySelector("#temp");
const contentOutput = document.querySelector("#content"); 

// Create a new date instance dynamically with JS
const d = new Date();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const newDate = months[d.getMonth()]+'.'+ d.getDate()+'.'+ d.getFullYear();


//generate function
generateBtn.addEventListener("click" , handleAPI);
function handleAPI() {
    //open-weather repo info
    const key = "1397df6969c093d63159553d0140d888";
    const URL = `https://api.openweathermap.org/data/2.5/weather?zip=${ZIPCodeInput.value}&appid=${key}`;
    fetchAPI(URL).then((data) => consumeDataFromAPI(data));
}

async function fetchAPI(url){
    const fetchAPI = await fetch(url);
    const resolvedData = await fetchAPI.json();
    return resolvedData;
}

async function consumeDataFromAPI(data){
    if(data.cod != 200){
        const UIData = data.message;
        console.log(UIData)
        return UIData;
    }else{
        const UIData = {
            date: newDate,
            temp: data.main.temp,
            feelings: feelingsTextArea.value  
        }
        console.log(UIData)
        return UIData;
    }
}