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


//Variables
const port = process.env.PORT;


//Uses json parser
app.use(express.json());


//Route request to the appropriate router
// app.use("/api", apiRouter);
app.use("/users", users)


//Default page routes
app.post("/login", (req, res) => {

})
 
//Start server
app.listen(port, () => console.log(`Server started  at port ${port}`));
