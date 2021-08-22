/**
 * ///////////////////
 * User schemas
 * //////////////////
 */

 //Dependencies
 const mongoose = require("mongoose"); //Mongoose
 const Schema = mongoose.Schema; //Get the Schema class


 //Design schema
 //Schema for users
 const usersSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String, 
        required: true,
    }
 })


//Schema for temporal users
 const tempUsersSchema = new Schema({
     email: {
         type: String,
         required: true
     },
     salt: {
        type: String,
        required: true
     },
     token: {
         type: String,
         required: true
     },
     data: {
         type: String,
         required: true
     }
 })

 const users = mongoose.model("users", usersSchema);
 const tempUsers = mongoose.model("temp_user", tempUsersSchema);
 module.exports = {users, tempUsers}; //Export schema for use
