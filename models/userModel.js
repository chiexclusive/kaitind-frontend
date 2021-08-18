/**
 * 
 * 
 * ////////////////////////////
 * User Models
 * ////////////////////////////
 * 
 * 
 */

module.exports = class UserModel{

    constructor(){
        this.users = [
            {id: 111, email: "chiboy@gmail.com", password: "$2b$10$NsRlGcpQZOW4mPWF87hLKO6u8RO1IyF2juYnN.PBELfIkEDlsc9EG"},
        ]
    }

    getUserByEmail(email){
        //Make this to obtained fromo a persistent db 
        return this.users.find(user=> user.email == email);
    }
}