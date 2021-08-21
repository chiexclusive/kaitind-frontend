/**
 * 
 * //////////////////////////
 * Handle request from the user routes
 * //////////////////////////
 * 
 */

const express = require ("express"); //Express
const sanitize = require("../helpers/sanitizer.js");//Sanitize helper
const users = express.Router(); //Use router
const UserController = require("./../controllers/userController.js")//User controller
const session = require ("express-session");
const {auth} = require("./../helpers/authorization.js");
const cookieParser = require("cookie-parser"); //Cookie parser
const db = require ("./../helpers/dbConnection.js"); //Get data base connection from helpers

db.connect(); //Start db connection


const TWO_DAYS = 2 * 1000 * 60 * 60 * 24 //Duration in milliseconds
users.use(session({
    secret: "process.env.SESSION_SECRET", 
    saveUninitialized: true,
    cookie: {maxAge: TWO_DAYS},
    resave: false
})) 

users.use(cookieParser()); //Use cookie parser middle ware

//Middle ware to sanitize request body
users.use("/login", (req, res, next) => {
    req.body = sanitize(req.body);
    next();
});
users.use((req, res, next) => auth(req, res, next));



//**Define the routes under users */
users.post("/login", (req, res) => {
    const user = new UserController(req, res);
    user.validate()
    .then((isValid) => {
        if(isValid) user.process();
    })
    .catch((error) => console.log(error)) //Log this error
})

users.delete("/logout", auth, (req, res) => {
    const user = new UserController(req, res); 
    user.process();
})


users.post("/signup", (req, res) => {
    const user = new UserController(req, res);
    user.validate()
    .then((isValid) => {
        if(isValid) user.process();
    })
    .catch((error) => console.log(error)) //Log this error
})


users.post("/signup/:id", (req, res) => {
    const user = new UserController(req, res);
    user.validate()
    .then((isValid) => {
        if(isValid) user.process();
    })
    .catch((error) => console.log(error)) //Log this error
})


module.exports = users;



