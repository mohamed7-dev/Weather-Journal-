//node modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Setup empty JS object to act as endpoint for all routes
let projectData = {};

//define port to run local server
const port = 8005;

// Start up an instance of app
const app = express();

/* Middleware*/

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());
// Initialize the main project folder
app.use(express.static('website'));

/*Setup Server*/

//post data to  local server
app.post("/post" , async (req , res) => {
    const bodyData = await req.body;
    projectData = bodyData;
    res.status(200).send(projectData);
})

//get data from  local server
app.get("/getAll" , async (req,res) => {
    res.send(projectData);
})

//run server 
app.listen(port , () => {
    console.log("server runs on port number" + port);
})