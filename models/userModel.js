/**
 * 
 * 
 * ////////////////////////////
 * User Models
 * ////////////////////////////
 * 
 * 
 */

//Dependencies

const {users, tempUsers} = require("./schemas/user.schema.js");


module.exports = class UserModel{

    getUserByEmail(userEmail){
        return new Promise((resolve, reject) => {
            return  users.findOne({
                        email: userEmail
                    }).exec((err, user) => {
                        if(err) reject(err);//Log this error
                        else resolve(user);
                    })
        })
    }


    storeTempUser(data, email) {
        return new Promise((resolve, reject) => {
            tempUsers.create({email: email, data: data})
            .then((err, result) => {
                if(err) return reject(err);
                return resolve(data);
            })
            .catch((err) => reject(err));
        })
    }


}