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
const {auth} = require("./../helpers/authorization.js");
const cookieParser = require("cookie-parser"); //Cookie parser


users.use(cookieParser()); //Use cookie parser middle ware

//Middle ware to sanitize request body
users.use("/login", (req, res, next) => {
    req.body = sanitize(req.body);
    next();
});



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


users.get("/signup/verify/:token", (req, res) => {
    const user = new UserController(req, res);
    user.validate()
    .then((isValid) => {
        if(isValid) user.process();
    })
    .catch((error) => console.log(error)) //Log this error
})


users.post("/signup", (req, res) => {
    const user = new UserController(req, res);
    user.validate()
    .then((isValid) => {
        if(isValid) user.process();
    })
    .catch((error) => console.log(error)) //Log this error
})


users.use((req, res, next) => auth(req, res, next));


module.exports = users;



