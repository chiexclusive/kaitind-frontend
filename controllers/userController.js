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
const jwt = require("jsonwebtoken");

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
        this.url = req._parsedUrl.pathname; //store url for ref
        this.refreshToken = "";// Set initial state of refresh token
    }

    async validate () {
        //Validate users' login data
        if(this.url == "/login"){
            try{ await loginSchema.validateAsync(this.log)}
            catch(error){this.res.status(400).send(error); return false;}            
        }


        //Validate user signin data
        if(this.url == "/signup"){
            //do some validation
            try{ const result = await signUpSchema.validateAsync(this.log)}
            catch(error){this.res.status(400).send(error); return false;}
        }

        //do some other checks
        return new Promise((resolve, reject) => resolve(true));
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

        var model = new UserModel();
        if(this.url == "/login"){
            if(this.req.session.data){
                this.res.status(400).json({success: false, message: "You are logged in already"});
                return;
            }
            
            let user = await model.getUserByEmail(this.log.email);
            console.log(user);
            if(user === null){
                return this.res.status(404).json({
                    success : false,
                    message: "Username or password is incorrect"
                })
            }
 
            const passwordHash = user.password;
            bcrypt.compare(this.log.password, passwordHash, (err) => {
                if(err) res.status(401).send();
                this.setSession({id: user.id, email: user.email}, (err, data) => {
                    if (err) res.status(401).send();
                    const payload = data;
                    const auth = new Authorization(this.req, this.res);
                    const token = auth.jwtGenerateToken(payload, process.env.TOKEN_SECRET, {expiresIn : "30min"});
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
            if(!this.isAdminRequest(this.req)) return this.res.status(403).send(); //Check if this request is from the admin
            if(await this.userExistInTemp(this.log, model)){
                const tempToken = await model.getTempUserToken(this.log.email);
                console.log(await this.tokenIsValid(tempToken.token, process.env.SIGNUP_TOKEN));
                if(await this.tokenIsValid(tempToken.token, process.env.SIGNUP_TOKEN))  return this.res.status(403).json({success: false, message: "Email exist, Please check mail to complete registration"})
                else model.removeTempUser(this.log.email);
            }
            const user = await model.getUserByEmail(this.log.email);
            if(user !== null) {this.res.status(400).json({success: false, message: "User exist already"}); return;}
            const salt = await bcrypt.genSalt(64); //Server generated salt for user verification
            const payload = {email: this.log.email, salt: salt};
            const jwt = new Authorization();
            const token = await jwt.jwtGenerateToken(payload, process.env.SIGNUP_TOKEN, {expiresIn : "30min"});
            //console.log(token);
            try{
                const passwordSalt = await bcrypt.genSalt(); //Password salt
                this.log.password =  await bcrypt.hash(this.log.password, passwordSalt)
            }catch(e){
                //Log this errors
                this.res.send(500).send();
            }
            //const sender = new Mailer();//Send verification token to email
            //sender.send(process.env.ENGINE_NAME, this.log.email, getEmailVerificationHTML)
            //.then(() => {
                //Store user to temportal collection
                model.storeTempUser(this.log.email, salt, token, JSON.stringify(this.log))
                .then((result) => {this.res.status(201).json({success: true, message: "User successfully created. Check mail to verify email"})})
                .catch(err => this.res.send(err)); 
            //})
            //.catch(() => this.res.status(500).send());
            
        }

        /**
         * Verify token 
         */
        //Check if a token came with the request
        //If token exist then used token to validate user 
        //Store finally to the database
         if(Object.keys(this.req.params).length !== 0){
            const token = this.req.params.token;
            return jwt.verify(token, process.env.SIGNUP_TOKEN, (err, data) => {
                if(err) return this.res.status(403).send();
                model.getTempUserByEmailAndSalt(data.email, data.salt)
                .then((result) => {
                    const user = JSON.parse(result.data);
                    model.createUser(user)
                    .then((res) => {
                        model.removeTempUser(data.email)
                        .then(() => {
                            this.res.status(201).json({success: true, message: "Registration success: Email validated successfully"});
                        })
                        .catch((err) => this.res.status(500).send());
                    })
                    .catch((err) => this.res.status(400).send());
                })
                .catch((err) => this.res.status(400).send())
            })
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

    
    /**
     * @param {Object} //Request object
     * @returns {Boolean}
     */
    isAdminRequest(){
        if((!"access_key" in this.log) || this.log.access_key == "") return false;
        if(process.env.ADMIN_ACCESS_KEY !== this.log.access_key) return false;
        return true;
    }

    /**
     * Is there a valid user in tempusers
     * @param {Object | User}
     * @returns {Boolean}
     */
    async userExistInTemp(user, model){
        try{
            const result = await model.getTempUserByEmail(user.email);
            if(result === null) return false;
            else return true;
        }catch{
            return false;
        }
    }

    /**
     * Is token valid
     * @param {String | token}
     * @param {String | secret}
     * @return {Boolean | isValid}
     */
    async tokenIsValid(token, secret){
        return jwt.verify(token, secret, (err, data) => {
            if(err) return false;
            return true;
        })
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