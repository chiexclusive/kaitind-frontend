/**
 * 
 * /////////////////////////////////
 * Base model for creating connections and destroying connection
 * //////////////////////////////////
 * 
 */

//Dependencies
const mongoose = require("mongoose");
let dbUrl = process.env.DB_URL
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if(err) console.log(err)//Log this
    else console.log("connected");
});


