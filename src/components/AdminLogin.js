/**
*
* //////////////////////
* Admin Login Page
* //////////////////////
*
*/

import "./../assets/template/assets/images/favicon.ico";
import "./../assets/template/assets/css/bootstrap.min.css";
import "./../assets/template/assets/css/animate.css";
import "./../assets/template/assets/css/animate.css";
import "./../assets/template/assets/css/app-style.css";
import {useEffect, useState} from "react"; //Get state


function AdminLogin () {


	//Set state
	const [rememberPassword, setRememberpassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [buttonDisabled, setButtonDisabled] = useState(false);
	const [error, setError] = useState("");


	//Log form error
	const logError = (object) => {
		setError(object.field + " cannot be left empty");
	}



	//Store admin credential to local storage
	const storeAdminCredential = (object) =>{
		if(localStorage.getItem("adminCredentials")){
			let credentials = JSON.parse(localStorage.getItem("adminCredentials"));
			credentials.forEach((item, index) => {
				if(item.email === object.email) credentials[index].password = object.password;
				else credentials.push(object);
			})
		}
	}


	//Sign in
	const signIn = () => {
		setButtonDisabled(true);
		const result = handleEmptyFields({email: email, password: password}) //Validate empty fields
		if(result.isEmpty !== true){
			if(rememberPassword === true) storeAdminCredential({email: email, password: password});
			const options = {
				method: "POST",
				body: JSON.stringify({email: email, password: password}),
				headers: {
					"Content-Type": "application/json"
				}
			}
			fetch(`${window.BASE_URL}/admin/signin`, options)
			.then((response) => response.json()
		)
			.then((result) => {
				console.log(result);
				//if(result.success === true) window.location = "/admin/dashboard";
				//else{
				//	console.log(result)
				//}
			})
		}else{
			logError(result);
		}
		
		setButtonDisabled(false);
	}


	//Check for empty fields
	const handleEmptyFields = (payload) => {
		for (let field in payload){
			if(payload[field].trim() === "") return {
				isEmpty: true,
				field : field
			};
		}

		return {
			isEmpty: false
		}
	}



	//Get password from local storage
	const getPassword = (name) =>{
		if(localStorage.getItem(name)){
			const credentials = JSON.parse(localStorage.getItem(name));
			credentials.forEach((item, index) => {
				if(item.email === email) return item.password;
			})
		}

		return "";
	}

	//Store password to browser
	const rememberPasswordFunc = (event) => {
		setRememberpassword(event.target.checked);
		//Check if password exist in the local storage
		if(event.target.checked === true){
			const storedPassword = getPassword("adminCredentials");
			if(storedPassword !== "" && password === "") setPassword(storedPassword);
		}
	}


	//Update username and password field

	const listeners = {
		email: (email) => setEmail(email),
		password: (password) => setPassword(password)
	}

	const updateFieldState = (event) => {
		listeners[event.target.name](event.target.value);
	}


	//Set Page title
	useEffect(() => {
		document.title = `${window.APP_NAME} | Admin Login`
	})

	return (
		<div id="wrapper" className = "loginWrapper">
			<div className="card card-authentication1 mx-auto my-5">
				<div className="card-body">
			 		<div className="card-content p-2">
			 			<div className="text-center">
			 				<img src="assets/images/logo-icon.png" alt="logo icon"/>
			 			</div>
				  		<div className="card-title text-uppercase text-center py-3">Admin Login</div>
			    		<form>
			    			<div className="form-group log-admin-form-error col-12 text-center">
					  			<h6 className = "text-danger">{error}</h6>
					 		</div>
					  		<div className="form-group">
					  			<label htmlFor="exampleInputUsername" className="">Email</label>
					   			<div className="position-relative has-icon-right">
						  			<input name = "email" type="email" id="exampleInputUsername" className="form-control input-shadow" placeholder="Enter Username" value = {email} onChange = {(event) => updateFieldState(event)}/>
					  				<div className="form-control-position">
							  			<i className="icon-user"></i>
							  		</div>
						   		</div>
					  		</div>
					  		<div className="form-group">
					  			<label htmlFor="exampleInputPassword" className="">Password</label>
					   			<div className="position-relative has-icon-right">
									<input name = "password" type="password" id="exampleInputPassword" className="form-control input-shadow" placeholder="Enter Password" value = {password} onChange = {(event) => updateFieldState(event)}/>
									<div className="form-control-position">
										<i className="icon-lock"></i>
									</div>
					   			</div>
				  			</div>
							<div className="form-row">
						 		<div className="form-group col-6">
						   			<div className="icheck-material-primary">
			                			<input type="checkbox" id="user-checkbox" checked={rememberPassword} onChange = {(event) => rememberPasswordFunc(event)}/>
			                			<label htmlFor="user-checkbox">Remember me</label>
						  			</div>
						 		</div>
							</div>
					 		<button type="button" disabled = {buttonDisabled} className="btn btn-primary shadow-primary btn-block waves-effect waves-light" onClick = {() => signIn()}>{(buttonDisabled === true)? "Signing in...":"Sign in"}</button>
					 	</form>	
			     	</div>
		   
		   
			
				 	<script src="assets/js/jquery.min.js"></script>
				 	<script src="assets/js/popper.min.js"></script>
				 	<script src="assets/js/bootstrap.min.js"></script>
				</div>
			</div>
		</div>
	);
}


export default AdminLogin;