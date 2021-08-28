/**
 *
 * ////////////////////
 * Base server
 * ////////////////////
 *
 */

 //Establish environment
 if(process.env.NODE_ENV !== "production") require("dotenv").config();

//Dependencies
const express = require("express"); //express
const app = express(); //app
const apiRouter = require("./api/index.js"); //api
const users = require("./routes/usersRoute.js"); //Users
const admin = require("./routes/adminRoute.js"); //Admin 
const cors = require ("cors"); //Cross Site Resource Sharing
const db = require ("./helpers/dbConnection.js"); //Get data base connection from helpers
const session = require("express-session");

db.connect(); //Start db connection



const TWO_DAYS = 2 * 1000 * 60 * 60 * 24 //Duration in milliseconds
app.use(session({
    secret: "process.env.SESSION_SECRET", 
    saveUninitialized: true,
    cookie: {maxAge: TWO_DAYS},
    reSave: false
})) 


//Variables
const port = process.env.PORT;


//Uses json parser
app.use(express.json());

//Use cors for react connections
app.use(cors());


//Route request to the appropriate router

//User router {Staff | Students}
app.use("/users", users)

//Admin router
app.use("/admin", admin);

// Home route
app.get("/", (req, res) => res.status(200).json({page: "home"}))
 
//Start server
app.listen(port, () => console.log(`Server started  at port ${port}`));
