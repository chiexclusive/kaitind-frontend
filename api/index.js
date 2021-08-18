/**
 *
 * ////////////////////
 * Api
 * /////////////////////
 */

//Dependencies
const express = require("express");
const apiRouter = express.Router();

apiRouter.use(function(req, res, next){
  next();
})

//Define the routes
apiRouter.get("/", (req, res) => {
  res.send("i just create the api route");
});

module.exports = apiRouter;
