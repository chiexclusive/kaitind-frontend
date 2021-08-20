/**
 *
 * ////////////////////
 * Api
 * /////////////////////
 */

//Dependencies
const express = require("express");
const apiRouter = express.Router();
const passport = require("passport");
const session = require("express-session");
const initializePassportConfig = require("./../passportConfig.js");


apiRouter.use(session({
  secret: 'sdasdsdasdas',
  resave: false,
  saveUninitialized: false
}))

apiRouter.use(passport.initialize());
apiRouter.use(passport.session());



const users = [
  {email: "a@a.com", password: "a"},
  {email: "b@b.com", password: "b"}
]


initializePassportConfig(passport, users[0]);





//Define the routes
apiRouter.get("/", (req, res) => {
  res.send("This is my home page");
});


apiRouter.post("/login", (req, res) => passport.authenticate("local", (err, user) => {
  if(!user) res.send("Email or password is incorrect");
  else res.send("Log in successful");
})(req, res))

apiRouter.delete("/logout", (req, res) => {res.send("Logged out")})

module.exports = apiRouter;
