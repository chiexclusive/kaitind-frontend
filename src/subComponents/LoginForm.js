
import {useState, useEffect} from "react";


export default function LoginForm () {



	const [Email, setEmail] = useState("");
	const [Password, setPassword] = useState("");



	//Button state
	const [buttonState, setButtonState]= useState(false);



	const actions = {
		Email: setEmail,
		Password: setPassword
	}

	const setData = (event) => {
		actions[event.target.name](event.target.value);
	}



	const processLogin = () => {
		setButtonState(true)

		if(Email.toString().trim() === "") return (() => {setButtonState(false); logAlert("Email is required", false)})()
		if(Password.toString().trim() === "") return (() => {setButtonState(false); logAlert("Password is required", false)})()

		const url = window.BASE_URL + "/users/login";
		const config = {
			credentials: "include",
			method: "POST",
			body: JSON.stringify({Email, Password}),
			headers: {
				"Content-Type": "application/json"
			}
		}
		fetch(url, config)
		.then(res => res.json())
		.then(res => {
			if(res.success){
				logAlert("Successfully Logged In. ", true)
				setTimeout(() => {
					window.location = "/";
				}, 1000)
			}else logAlert(res.message, false)
			setButtonState(false)
		})
		.catch(() => setButtonState(false))
	
	}





	useEffect(() => {
		const button = document.querySelector(".submit-login")
		if(buttonState === true) button.setAttribute("disabled", true)
		else button.removeAttribute("disabled")
	}, [buttonState]);



	const logAlert = (...args) => {
		const elem = document.querySelector(".login-log")
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
					<div><h4 className = "text-muted">Log In</h4></div>
				</div>


				<div className="input-group mb-3">
	              <div className="input-group-prepend">
	                <span style = {{"width": "50px"}} className="text-center input-group-text">@</span>
	              </div>
	              <input type="email" className="form-control input" placeholder="Email" name = "Email" value = {Email} onChange = {setData}/>
	            </div>
	           	<div className="input-group mb-3">
	              <div className="input-group-prepend">
	                <span style = {{"width": "50px"}} className="text-center input-group-text">
	                	<span className = "fa fa-key"></span>
	                </span>
	              </div>
	              <input type="password" className="form-control input" placeholder="*******" name = "Password" value = {Password} onChange = {setData}/>
	            </div>
	            <div className = "d-flex justify-content-start"><a href = "/forgot-password">Forgot Password</a></div>
	           	<div className = "d-flex justify-content-start"><button className = "input mt-3 px-3 btn btn-orange submit-login" onClick = {processLogin}>{(buttonState === true)?"Requesting...": "Log In"}</button></div>
	           	<div className = "mt-3 login-log w-100">
	           		
	           	</div>
			</div>


			<div style = {{"marginTop" : "50px"}} className = "d-flex justify-content-center align-items-center container">
					<span className = "contactHorizontalLine"></span>
					<strong className = "d-block">Or</strong>
					<span className = "contactHorizontalLine"></span>
			</div>
			<div className = "mt-3 container text-center">
				<p className = "text-center">
					Not a user!, <a href = "/register"><strong>Register</strong></a><br/>
					Take me to <a href = "/"><strong>today's menu </strong></a>
				</p>
			</div>


		</div>
	)
}