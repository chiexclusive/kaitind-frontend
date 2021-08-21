/**
 * 
 * /////////////////////
 * Handle user route validation
 * //////////////////////
 * 
 */

 //Dependencies
const Joi = require("joi"); //Joi


/**
 * Define schema
 */
const loginSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required()
})

const signUpSchema = Joi.object({
    first_name: Joi.string().lowercase().required(),
    last_name: Joi.string().lowercase().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().alphanum().min(6).required(),
    ref_password: Joi.string().alphanum().min(6).required(),
    access_key: Joi.number().required()
})


module.exports = {
    loginSchema, 
    signUpSchema
}//Export schemas