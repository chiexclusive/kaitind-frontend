/**
*
* ///////////////////////////
* //Admin routes
* ///////////////////////////
*/

//Dependencies
const express = require("express"); //Express
const admin = express.Router();//Router
const AdminController = require("./../controllers/adminController.js")


//Define routes
admin.get("/isLoggedin", (req, res) => {
	if(req.session.admin){
		res.status(200).json({success: true});
	}else{
		res.status(200).json({success: false});
	}
})


//Admin login
admin.post("/signin", async(req, res) => {
	const admin =  new AdminController(req, res);
	if(await admin.validate()) admin.process();
})

module.exports = admin;