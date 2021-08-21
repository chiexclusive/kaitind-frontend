/**
 * 
 * ///////////////////////////
 * Data base connection module
 * //////////////////////////
 * 
 */

 //dependencies
 const mongoose = require("mongoose"); //Expose mongoose

class DBConnection {

    constructor() {
        this.db = process.env.DB_URL;
        this.config = {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        }
    }

    connect () {
        mongoose.connect(this.db, this.config, (err) => {
             if(err) console.log(err.message) //Log this later
             else console.log("Successfully connected to data base");
        })
    }
}


module.exports = new DBConnection();