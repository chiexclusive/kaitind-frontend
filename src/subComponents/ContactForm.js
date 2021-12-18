
import {useState, useEffect} from "react";


export default function ContactForm () {





	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [subject, setSubject] = useState("");



	//Button state
	const [buttonState, setButtonState]= useState(false);



	const actions = {
		email: setEmail,
		message: setMessage,
		subject: setSubject
	}

	const setData = (event) => {
		actions[event.target.name](event.target.value);
	}



	const processContact = () => {
		setButtonState(true)
		logAlert(false);

		if(email.toString().trim() === "") return (() => {setButtonState(false); logAlert("Email is required", false)})()
		if(message.toString().trim() === "") return (() => {setButtonState(false); logAlert("Message is required", false)})()
		if(subject.toString().trim() === "") return (() => {setButtonState(false); logAlert("Subject is required", false)})()



		const url = window.BASE_URL + "/contacts";
		const config = {
			credentials: "include",
			method: "POST",
			body: JSON.stringify({email, message, subject}),
			headers: {
				"Content-Type": "application/json"
			}
		}
		fetch(url, config)
		.then(res => res.json())
		.then(res => {
			if(res.success){
				logAlert("Contact Successfully Sent. Please wait while we respond. ", true);
				setTimeout(() => {
					logAlert(false)
				}, 4000)
				setButtonState(false);
				setEmail("");
				setMessage("");
				setSubject("")
			}else logAlert(res.message, false)
			setButtonState(false)
		})
		.catch(() => setButtonState(false))
	
	}






	useEffect(() => {
		const button = document.querySelector(".submit-contact")
		if(buttonState === true) button.setAttribute("disabled", true)
		else button.removeAttribute("disabled")
	}, [buttonState]);



	const logAlert = (...args) => {
		const elem = document.querySelector(".contact-log")
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
				<div className = "contact-header-text d-flex justify-content-between">
					<h4 className = "text-muted">Contact Us</h4>
					<h6 className = "contact-error-log text-danger"></h6>
				</div>

				<div className="input-group mb-3">
	              <div className="input-group-prepend">
	                <span class="input-group-text">@</span>
	              </div>
	              <input type="email" className="form-control input" placeholder="Email" name = "email" value = {email} onChange = {setData}/>
	            </div>
	            <div class="input-group mb-3">
	              <input type="text" className="form-control input" placeholder="Subject..." name = "subject" value = {subject} onChange = {setData}/>
	            </div>
	           	<textarea className = "form-control input" rows ="10" placeholder = "Message..." name = "message" value = {message} onChange = {setData}></textarea>
	           	<button className = "input mt-3 btn btn-success submit-contact" onClick = {processContact}>{buttonState === true? "Sending...": "Send Message"}</button>
	           	<div className = "mt-3 contact-log w-100">
	           		
	           	</div>
			</div>


			<div style = {{"marginTop" : "50px"}} className = "d-flex justify-content-center align-items-center container">
					<span className = "contactHorizontalLine"></span>
					<strong className = "d-block">Or</strong>
					<span className = "contactHorizontalLine"></span>
			</div>
			<div className = "mt-3 container text-center">
				<p className = "text-center">
					Send us an Email at <a href = "https://www.gmail.com">kaitind@gmail.com</a><br/>
					We will reach you as soon as possible.
				</p>
			</div>

			
		</div>
	)
}