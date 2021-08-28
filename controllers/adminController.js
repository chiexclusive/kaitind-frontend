/*
*
* //////////////////////////////////
* Admin Controller
* //////////////////////////////////
*
*
*/


//Dependencies
const Joi = require("joi") //Get Joi
const loginSchema = require("./../helpers/userValidations.js")

class AdminController{

	constructor(req, res) {
		this.req = req;
		this.res = res;
		this.log = this.req.body;
	}

	validate(){
		if(this.req.pathname == "/signin"){
			try{
				Joi.validate(loginSchema);
			}catch(error){
				console.log(error);
				return this.res.status(400).json(JSON.stringify(error));
			}
		}


		return true;
	}


	process(){
		var model = new UserModel();
        if(this.url == "/login"){

        	//Redirect admin to dashboard if session is set
            if(this.req.session.data){
                this.res.status(400).json({success: false, message: "You are logged in already"}, redirect: "/admin/dashboard");
                return;
            }
            const role = 1;
            let admin = await model.getUserByEmailAndRole(this.log.email, role);
            if(user === null){
                return this.res.status(404).json({
                    success : false,
                    message: "Username or password is incorrect"
                })
            }
 
            const passwordHash = user.password;
            bcrypt.compare(this.log.password, passwordHash, (err, data) => {
                if(err) return this.res.status(401).send();
                if(data === false) return this.res.status(404).json({success: false, message: "Email or password incorrect"});
                this.setSession({id: user.id, email: user.email}, (err, data) => {
                    if (err) return this.res.status(401).send();
                    const payload = data;
                    const auth = new Authorization(this.req, this.res);
                    const token = auth.jwtGenerateToken(payload, process.env.TOKEN_SECRET, {expiresIn : "30min"});
                    const refreshToken = auth.jwtGenerateRefreshToken(payload);
                    this.refreshToken = refreshToken;
                    this.storeRefreshToken(user.id, refreshToken);
                    UserController.storeCookie("tokens", JSON.stringify({token: token, refreshToken: refreshToken}), this.res);
                    this.res.status(200).json({success: true, token: token, refreshToken: this.refreshToken}); 
                });
            })
        }
	}
}
module.exports = AdminController;
