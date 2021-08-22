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


    storeTempUser(email, salt, token, data) {
        return new Promise((resolve, reject) => {
            new tempUsers({email: email, salt: salt, token: token, data: data})
            .save((err, data) => {
                if(err) return reject(error);
                return resolve(data)
            })
        })
    }


    getTempUserByEmailAndSalt(email, salt){
        return new Promise((resolve, reject) => {
            tempUsers.findOne({
                email: email,
                salt: salt
            }).exec((err, data) =>{
                if(err) return reject(err);
                return resolve(data)
            })
        })
    }


    getTempUserByEmail(email){
        return new Promise((resolve, reject) => {
            tempUsers.findOne({
                email: email,
            }).exec((err, data) =>{
                if(err) return reject(err);
                return resolve(data)
            })
        })
    }


    createUser(user){
        console.log(user);
        return new Promise((resolve, reject) => {
            const usersQuery = new users();
            // usersQUery.first_name = user.first_name;
            // usersQuery.last_name = user.last_name;
            // usersQuery.email = user.email;
            // usersQuery.password = user.password;
            // usersQuery.save((err, data) => {
            //     if(err) console.log(err);
            //     return resolve(data);
            // })
            users.create({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                password: user.password
            }).then((result)=> resolve(result))
            .catch((err) => reject(err))
        })
    }


    removeTempUser(email){
        return new Promise ((resolve, reject) => {
            tempUsers.deleteMany({
                email: email
            }).then(() => resolve())
            .catch((err) => reject(err))
        })
    }

    getTempUserToken(email){
        return new Promise ((resolve, reject) => {
            tempUsers.findOne({
                email: email,
            })
            .select({
                token: 1
            })
            .exec()
            .then((token) => resolve(token))
            .catch((err) => reject(err))
        })
    }
}