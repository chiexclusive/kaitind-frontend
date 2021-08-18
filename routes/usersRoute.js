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
const cookieParser = require("cookie-parser");



const TWO_DAYS = 2 * 1000 * 60 * 60 * 24 //Duration in milliseconds
users.use(session({
    secret: "process.env.SESSION_SECRET", 
    saveUninitialized: true,
    cookie: {maxAge: TWO_DAYS},
    resave: false
})) 

users.use(cookieParser());


//Middle ware to sanitize request body
users.use("/login", (req, res, next) => {
    req.body = sanitize(req.body);
    next();
});
users.use((req, res, next) => auth(req, res, next));



//**Define the routes under users */
users.post("/login", (req, res) => {
    const user = new UserController(req, res);
    if(user.validate()){} user.process();
})

users.delete("/logout", auth, (req, res) => {
    const user = new UserController(req, res); 
    user.process();
})
module.exports = users;

users.post("/signup/:id", (req, res) => {
    console.log(params);
    const user = new UserController(req, res);
    if(user.validate()) user.process();
})

users.post("/signup", (req, res) => {
    const user = new UserController(req, res);
    if(user.validate()) user.process();
})

