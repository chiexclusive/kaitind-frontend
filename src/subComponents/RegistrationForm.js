import {useState, useEffect} from "react";

export default function RegistrationForm () {

	const [FirstName, setFirstName] = useState("");
	const [LastName, setLastName] = useState("");
	const [Email, setEmail] = useState("");
	const [Phone, setPhone] = useState("");
	const [Password, setPassword] = useState("");


	//Button state
	const [buttonState, setButtonState] = useState(false);


	const actions = {
		FirstName: setFirstName,
		LastName: setLastName,
		Email: setEmail,
		Phone: setPhone,
		Password: setPassword,
	}


	const setData = (event) => {
		actions[event.target.name](event.target.value);
	}





	const registerUser = () => {
		setButtonState(true)
		const validationResult = validateField()
		if(validationResult.isEmpty){
			setButtonState(false)
			log(validationResult.message, false);
			return;
		}

		const config = {
			body: JSON.stringify({
				FirstName, LastName, Email, Phone, Password
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			}
		}
		const url = window.BASE_URL + "/users/register"
		fetch(url, config)
		.then(res => res.json())
		.then(res => {
			if(res.success){
				log("Registration Successfully. Wait while we redirect you", true);
				setTimeout(function(){
					window.location = "/login"
				}, 1000)
			}else log(res.message, false);
			setButtonState(false)
		})
		.catch(() => {
			setButtonState(false)
		})
	}



	const validateField = () => {
		const testFields = {
			"First Name": FirstName,
			"Last Name": LastName,
			"Email": Email,
			"Phone": Phone,
			"Password": Password
		}


		for(let field in testFields){
			if(testFields[field].toString().trim() === "") return {isEmpty: true, message: `${field} cannot be left empty`}
		}


		return {isEmpty: false}
	}



	const log = (...args) => {
		const logContainer = document.querySelector(".user-registration-log")
		if(args.length === 1 && args[0] === false) return logContainer.innerHTML = "";


		logContainer.innerHTML = `
			<div class = "text-left ${(args[1] === true) ? "alert alert-success alert-dismissible": "alert alert-danger alert-dismissible"}"">
       			<strong>${(args[1] === true) ? "Success!" : "Error !"}</strong>
       			<span>${args[0]}</span>
       			<span class = "close" data-dismiss = "alert"> &times;</span>
       		</div>
		`;
	}



	useEffect(() => {
		const targetButton = document.querySelector(".register-button")
		if(buttonState === true) targetButton.setAttribute("disabled", true);
		else targetButton.removeAttribute("disabled");
	}, [buttonState])




	return (
		<div style = {{"background" : "#f2f0f0"}} className = "w-100 h-100 py-3 d-flex justify-content-center align-items-center flex-column w-100">
			<div className = "bg-white contact-form-card col-sm-12 col-md-6">
				<div style = {{"marginBottom": "20px"}}  className = "contact-header-text d-flex justify-content-center flex-column">
					<div style = {{"marginBottom": "20px"}}><a href = "/"><h3><strong className = "text-orange">Kaitind</strong></h3></a></div>
					<div><h4 className = "text-muted">Register Here</h4></div>
				</div>

				<div className="input-group mb-3">
	              <div className="input-group-prepend">
	                <span style = {{"width": "50px"}} className="text-center input-group-text">
	                	<span className = "fa fa-user"></span>
	                </span>
	              </div>
	              <input type="text" className="form-control input" placeholder="FIRST NAME" name = "FirstName" onChange = {setData} value = {FirstName}/>
	            </div>
	            <div className="input-group mb-3">
	              <div className="input-group-prepend">
	                <span style = {{"width": "50px"}} className="text-center input-group-text">
	                	<span className = "fa fa-user"></span>
	                </span>
	              </div>
	              <input type="text" className="form-control input" placeholder="LAST NAME" name = "LastName" onChange = {setData} value = {LastName} />
	            </div>
				<div className="input-group mb-3">
	              <div className="input-group-prepend">
	                <span style = {{"width": "50px"}} className="text-center input-group-text">@</span>
	              </div>
	              <input type="email" className="form-control input" placeholder="EMAIL" name = "Email" onChange = {setData} value = {Email}/>
	            </div>
	            <div className="input-group mb-3">
	              <div className="input-group-prepend">
	                <span style = {{"width": "50px"}} className="text-center input-group-text">
	                	<span className = "fa fa-phone"></span>
	                </span>
	              </div>
	              <input type="email" className="form-control input" placeholder="PHONE NO." name = "Phone" onChange = {setData} value = {Phone}/>
	            </div>
	           	<div className="input-group mb-3">
	              <div className="input-group-prepend">
	                <span style = {{"width": "50px"}} className="text-center input-group-text">
	                	<span className = "fa fa-key"></span>
	                </span>
	              </div>
	              <input type="password" className="form-control input" placeholder="*******" name = "Password" onChange = {setData} value = {Password}/>
	            </div>
	           	<div className = "d-flex justify-content-start"><button className = "input mt-3 px-3 btn btn-orange register-button" onClick = {registerUser}>{(buttonState === false) ? "Register": "Registering..."}</button></div>
	           	<div className = "mt-3 user-registration-log w-100">
	           		
	           	</div>
			</div>


			<div style = {{"marginTop" : "50px"}} className = "d-flex justify-content-center align-items-center container">
					<span className = "contactHorizontalLine"></span>
					<strong className = "d-block">Or</strong>
					<span className = "contactHorizontalLine"></span>
			</div>
			<div className = "mt-3 container text-center">
				<p className = "text-center">
					Not a guest!, <a href = "/login"><strong>Log in</strong></a><br/>
					Take me to <a href = "/"><strong>today's menu </strong></a>
				</p>
			</div>


		</div>
	)
}