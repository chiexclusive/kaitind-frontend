/**
 * //////////////////////////
 * User Controller
 * /////////////////////////
 */

//Dependencies
const bcrypt = require("bcrypt"); //Bcrypt
const UserModel = require("./../models/userModel.js");//User Database
const {loginSchema, signUpSchema}= require("./../helpers/userValidations.js");//Validation schemas
const fs = require("fs"); //File system
const {Authorization} = require("./../helpers/authorization.js"); //Auth

//Variables
const REFRESH_TOKEN_STORE = __dirname+"./../token.json";



//Define controller class
class UserController{

    /**
     * @param{Object} Request object from http
     * @param{Object} Response object from http
     */
    constructor(req, res) {
        this.res = res;
        this.req = req;
        if(this.req.body) this.log = this.req.body;
        this.url = req.url; //store url for ref
        this.refreshToken = "";// Set initial state of refresh token
    }

    async validate () {
        //Validate users' login data
        if(this.url == "/login"){
            if(this.isEmptyBody()) this.res.status(400).send();
            try{ await loginSchema.validateAsync(this.log)}
            catch(error){this.res.status(400).send(error);}            
        }


        //Validate user signin data
        if(this.url == "/signup"){
            //do some validation
            try{ const result = await signUpSchema.validateAsync(this.log)}
            catch(error){this.res.status(400).send(error)}
        }

        //do some other checks
        return true;
    }

    async process () {
        /**Handle login
        * (1) Check for the right url
        * (2) Get single user from db based on the request name
        * (3) If user exist verify user
        * (4) If verification is successfully then create session
        * (5) Generate token and refresh token and send back to the user
        * 
        * Note that token expires every 30 min;
        */

        if(this.url == "/login"){
            if(this.req.session.data){
                this.res.status(400).json({success: false, message: "You are logged in already"});
                return;
            }
            const model = new UserModel();
            const user = model.getUserByEmail(this.log.email);
            if(Object.keys(user).length == 0) res.status(401).send();
            const passwordHash = user.password;
            bcrypt.compare(this.log.password, passwordHash, (err) => {
                if(err) res.status(401).send();
                this.setSession({id: user.id, email: user.email}, (err, data) => {
                    if (err) res.status(401).send();
                    const payload = data;
                    const auth = new Authorization(this.req, this.res);
                    const token = auth.jwtGenerateToken(payload, {expiresIn : "30min"});
                    console.log(token);
                    const refreshToken = auth.jwtGenerateRefreshToken(payload);
                    this.refreshToken = refreshToken;
                    this.storeRefreshToken(user.id, refreshToken);
                    UserController.storeCookie("tokens", JSON.stringify({token: token, refreshToken: refreshToken}), this.res);
                    this.res.status(200).json({success: true, token: token, refreshToken: this.refreshToken}); 
                });
            })
        }


        /**
         * Handle sign up
         * Sign up with out token
         * (1) Html Escape all string data
         * (2) Sanitize all database
         * (3) Store user temporarily with a token which will be sent to user email
         * Note token expires after 3 Hours
         * 
         * Sign up with tokens
         * (1) Html real escape the token obtained
         * (2) Verify tokens
         * (3) Get users by id in token
         * (4) Store user to database
         * (5) Send back a response
         *
         */
        if(this.url == "/signup"){
            const model = new UserModel();
            if(model.emailExist()){}
            const token = jwt.sign(payload, process.env.SIGNIN_TOKEN_SECRET, {expiresIn : "30min"});
        }


        if(this.url == "/logout"){
            /**
             * Handle logout
             * 
             * (1) Clear session
             * (2) Clear refresh token list
             */
            new Promise((resolve, reject) =>{
                if("data" in this.req.session){
                    this.destroyRefreshTokenById(this.req.session.data.id);
                    if(this.destroySession()) resolve(); 
                }else reject("culprit");
            })
            .then(() => this.res.status(200).json({success: true, message: "User is logged out successfully"}))
            .catch((suspect) => this.res.status(400).send(suspect))
        }
    }


    //Create user session
   /**
    * 
    * @param {Object} sessionData | Session data from login verification
    * @param {Function} callBack | Callback function to begin jwt processing
    */
    setSession(sessionData, callBack){
        let error = null;
        try {this.req.session.data = sessionData;}
        catch(err){error = new Error("Session settings failed")}
        finally{callBack(error, sessionData);}
    }


    //Validate if user request came with a body
    /**
     * 
     * @returns {Boolean} 
     */
    isEmptyBody () {
        if(Object.keys(this.log).length == 0) return true;
        return false;
    }


    destroyRefreshTokenById(id) {
        const getToken = JSON.parse(fs.readFileSync(REFRESH_TOKEN_STORE, "utf-8"));
        delete getToken[id];
        const results = getToken;
        fs.writeFileSync(REFRESH_TOKEN_STORE, JSON.stringify(results));
        return true;
    }

    /**
     * Delete session for user
     */
    destroySession(){
        if(this.req.session.destroy()) return true;
        return false;
    }

    /**
     * 
     * @param {Number} id 
     */
    storeRefreshToken(id, token){
        const tokens = JSON.parse(fs.readFileSync(REFRESH_TOKEN_STORE, "utf-8"));
        tokens[id] = token;
        //fs.writeFileSync(REFRESH_TOKEN_STORE, JSON.stringify(tokens));
    }



    /**
     * 
     * @param {String} name 
     * @param {String} data 
     */
    static storeCookie(name, data, res){
        const TWO_DAYS = 2 * 1000 * 60 * 60 * 24
        const options = {
            maxAge: TWO_DAYS,
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        }
        res.cookie(name, data, options);
    }
}


module.exports = UserController; //Export controller