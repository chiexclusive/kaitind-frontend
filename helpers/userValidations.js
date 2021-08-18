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
    firstName: Joi.string().lowercase().required(),
    lastName: Joi.string().lowercase().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().alphanum().min(6).required(),
    refPassword: Joi.string().alphanum().min(6).required(),
    accessKey: Joi.number().required()
})


module.exports = {
    loginSchema, 
    signUpSchema
}//Export schemas