import {useState} from "react";

function LoginForm(props){

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, updateError] = useState("");

	const listeners = {
		email: (email) => setEmail(email),
		password: (password) => setPassword(password),
	}

	const updateFields = (event) => {
		listeners[event.target.name](event.target.value);
		updateError("");
	}

	const logIn = () => {
		const data = {
			email: email,
			password: password
		}

		const valid = isEmpty(data);
		if(typeof valid !== "boolean") return updateError(valid.name + " cannot be left empty");

		const options = {
			body: JSON.stringify(data),
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			}
		}


		fetch(window.BASE_URL + "/users/login", options)
		.then((res) => res.json())
		.then((res) => {
			if(res.success === false) updateError(res.message);
		});


	}

	return (
		<form action=""  method="post">
	        <div className="flex" style = {{"display": "flex"}}>
	            <div><h3 >Login</h3></div>
	            <h5>(Staffs/Students)</h5>
	        </div>
	        <div><h6 style = {{"color": "red"}}><i>{error}</i></h6></div>
	        <div className="form-control">
	            <input type="email" name="email" value = {email} id="email" onInput = {(event) => updateFields(event)} placeholder = "Email"/>
	        </div>
	        <div className="form-control grid">
	            <input type="password" name="password" value = {password} id="password" placeholder = "******" onInput = {(event) => updateFields(event)}/>
	            <div className="show-password">
	                <span className="fa fa-eye"></span>
	            </div>
	        </div>
	        
	        <span>
	            <a href="/forot-password">
	                <h6>Forgot Password</h6>
	            </a>
	        </span>
	        <div className="button-container">
	            <button type="button" className = "flex" onClick = {() => logIn()}>
	                <span>Login</span>
	                <div className = "center-adjuster"><span className="fa fa-caret-right"></span></div>
	            </button>
	        </div>
	    </form>
	)
}


function isEmpty(data){
	for(const index in data){
		if(data[index].trim() === ""){
			return {
				name: index,
				isEmpty: true
			}
		}
	}
	return false;
}


export default LoginForm;