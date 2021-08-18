/**
 *
 * ////////////////////
 * Base server
 * ////////////////////
 *
 */

//Dependencies
const express = require("express"); //express
const app = express(); //app
const env = require("dotenv"); //environment var
const apiRouter = require("./api/index.js"); //api
const users = require("./routes/usersRoute.js"); //Users

const router = express.Router();


//Initialize environment variables
env.config();


//Variables
const port = process.env.PORT;


//Uses json parser
app.use(express.json());


//Route request to the appropriate router
app.use("/api", apiRouter);
app.use("/users", users)


//Default page routes
app.post("/login", (req, res) => {

})
 
//Start server
app.listen(port, () => console.log(`Server started  at port ${port}`));
