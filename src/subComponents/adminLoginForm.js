
import {useState, useEffect} from "react";



export default function AdminLoginForm () {


	const [id, setId] = useState("");
	const [password, setPassword] = useState("");



	//Button state
	const [buttonState, setButtonState]= useState(false);



	const actions = {
		id: setId,
		password: setPassword
	}

	const setData = (event) => {
		actions[event.target.name](event.target.value);
	}



	const processAdminLogin = () => {
		setButtonState(true)

		if(id.toString().trim() === "") return (() => {setButtonState(false); logAlert("Id is required", false)})()
		if(password.toString().trim() === "") return (() => {setButtonState(false); logAlert("Password is required", false)})()

		const url = window.BASE_URL + "/admin/login";
		const config = {
			credentials: "include",
			method: "POST",
			body: JSON.stringify({id, password}),
			headers: {
				"Content-Type": "application/json"
			}
		}
		fetch(url, config)
		.then(res => res.json())
		.then(res => {
			if(res.success){
				logAlert("Successfully Logged in ", true)
				setTimeout(() => {
					window.location = "/admin/manage";
				}, 1000)
			}else logAlert(res.message, false)
			setButtonState(false)
		})
		.catch(() => setButtonState(false) )
	
	}





	useEffect(() => {
		const button = document.querySelector(".submit-login")
		if(buttonState === true) button.setAttribute("disabled", true)
		else button.removeAttribute("disabled")
	});



	const logAlert = (...args) => {
		const elem = document.querySelector(".admin-log-box")
		if(args.length === 1 && args[0] === false){
			elem.innerHTML = "";
			return;
		}


		elem.innerHTML = `
			<div class = "text-left alert alert-dismissible ${(args[1] === true )? 'alert-success': 'alert-danger'}">
       			<strong>${(args[1] === true )? 'Success !': 'Error !'}</strong>
       			<span>${args[0]}</span>
       			<span class = "close" data-dismiss = "alert">&times;</span>
       		</div>
		`;
	}





	return (
		<div style = {{"background" : "#f2f0f0"}} className = "w-100 h-100 py-3 d-flex justify-content-center align-items-center flex-column w-100">
			<div className = "bg-white contact-form-card col-sm-12 col-md-6">
				<div style = {{"marginBottom": "20px"}}  className = "contact-header-text d-flex justify-content-center flex-column">
					<div style = {{"marginBottom": "20px"}}><a href = "/"><h3><strong className = "text-orange">Kaitind</strong></h3></a></div>
					<div><h4 className = "text-muted">Admin Log In</h4></div>
				</div>


				<div className="input-group mb-3">
	              <div className="input-group-prepend">
	                <span style = {{"width": "50px"}} className="text-center input-group-text">@</span>
	              </div>
	              <input type="text" className="form-control input" placeholder="Admin ID" name = "id" value = {id} onChange = {setData}/>
	            </div>
	           	<div className="input-group mb-3">
	              <div className="input-group-prepend">
	                <span style = {{"width": "50px"}} className="text-center input-group-text">
	                	<span className = "fa fa-key"></span>
	                </span>
	              </div>
	              <input type="password" className="form-control input" placeholder="*******"  name = "password" value = {password} onChange = {setData}/>
	            </div>
	            <div className = "d-flex justify-content-start">Forgot Password? Contact webmaster</div>
	           	<div className = "d-flex justify-content-start"><button className = "input mt-3 px-3 btn btn-orange submit-login"  onClick = {processAdminLogin}>{(buttonState === true)? "Requesting...": "Log In"}</button></div>
	           	<div className = "mt-3 contact-success w-100 admin-log-box">
	           		
	           	</div>
			</div>


			<div style = {{"marginTop" : "50px"}} className = "d-flex justify-content-center align-items-center container">
					<span className = "contactHorizontalLine"></span>
					<strong className = "d-block">Or</strong>
					<span className = "contactHorizontalLine"></span>
			</div>
			<div className = "mt-3 container text-center">
				<div className = "text-center">
					<div>Sign in to manage products </div>
					<strong>Go back <a href ="/"> home</a></strong>
				</div>
			</div>


		</div>
	)
}


