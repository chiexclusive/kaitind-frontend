/**
 * 
 * //////////////////////
 * Sanitize data
 * /////////////////////
 * 
 * 
 */

//Dependencies
const sanitizeHtml = require ("sanitize-html");

/**
 * 
 * @param {Object | Array of Objects} data
 * @returns {Object | Array of Objects}
 */
function sanitize(data){
 
    //Expecting an array or an object
    if(typeof data !== "object" && !Array.isArray(data)) return data.toString();

    //Object
    if(typeof data == "object") for(var index in data) data[index] = sanitizeHtml(data[index]);

    //Array
    if(Array.isArray(data)){
        const result = [];
        data.map(uniqueData => {
        for(var index in uniqueData) uniqueData[index] = sanitizeHtml(uniqueData[index]); 
            result.push(uniqueData);
        })
    }
    return data;
}
module.exports = sanitize;