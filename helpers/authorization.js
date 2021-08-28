/**
 * 
 * ////////////////////////////
 * Authorize request
 * ///////////////////////////
 * 
 */

 //Dependencies
 const jwt = require("jsonwebtoken");//JWT
 const fs = require("fs");
 

 //Variables
 const NOT_AUTH_ROUTE = [
    "users/login",
    "users/signup",
    "/isLoggedIn",
 ];

 
 class Authorization {
     
    constructor(req, res){
        this.req = req;
        this.res = res;
    }



    /**
     * @returns {Boolean}
     */
    isAuthorized(){
        if(!this.req.cookies.tokens) this.res.status(401).send();
        else{
            const tokens = JSON.parse(this.req.cookies.tokens);
            return jwt.verify(tokens.token, process.env.TOKEN_SECRET, (err, payload) => {
                if(err){
                    if(this.refreshToken(tokens.refreshToken)) return true;
                    return false;
                }
                else return true;
            })
        }
    }


    //Refresh token
    /**
     * 
     * @param {String} refreshToken 
     */
    refreshToken (refreshToken){
        if(!this.jwTokenExists(refreshToken)) this.res.status(401).send(); //Log user out {Not implemented}
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) =>{
            if(err) this.res.status(401).send();
            const newToken = this.jwtGenerateToken({id: data.id, email: data.email});
            return true;
        })
    }//Come back to this



    /**
     * Verify Token Existence in a token.json file
     * @param {String} refreshToken 
     * @returns {Boolean}
     */
    jwTokenExists(refreshToken){
        const tokens = JSON.parse(fs.readFileSync(__dirname+"/../token.json", "utf-8"));
        for(let id  in tokens){
            if(tokens[id] !== refreshToken) continue;
            else return true
        }
        return false; 
    }


    /**
     * Generate token
     * @param {Object} payload 
     * @return {String}
     * Note that token expires after 30 min
     */
    jwtGenerateToken(payload, secret, options){
        const token = jwt.sign(payload, secret, options);
        return token;
    }



    /**
     * Generate refresh token
     * @param {Object} payload
     * @returns {Sring}
     */
    jwtGenerateRefreshToken(payload){
        const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
        return token;
    }


    /**
     * @param {String}
     */
    setAuthorizationToken(newToken){
        const tokens = JSON.parse(this.req.cookies.tokens);
        tokens.token = newToken;
        storeCookie("tokens", JSON.stringify(tokens), this.res);
        return true;
    }
 }


function storeCookie (name, data, res){
    const TWO_DAYS = 2 * 1000 * 60 * 60 * 24
    const options = {
        maxAge: TWO_DAYS,
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    }
    res.cookie(name, data, options).send();
    process.exit();
}

 function auth(req, res, next) {
    if(notAuthorizationRoute(req)) 
    {   
        next(); 
        return;
    }
    const authorization = new Authorization(req, res);
    if(authorization.isAuthorized()) next();
    else res.status(401).send()
}


/**
 * Check the list for routes that does not require authorization
 * @param {Object} req 
 * @returns {Boolean}
 */
function notAuthorizationRoute(req){
    const result = NOT_AUTH_ROUTE.find(res => res == req.originalUrl);
    if(result) return true;
    return false;
}



 module.exports = {Authorization, auth} //Export Auth