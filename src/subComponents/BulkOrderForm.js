
import {useState, useEffect} from "react";


export default function BulkOrderForm () {



	const [email, setEmail] = useState("");
	const [query, setQuery] = useState("");
	const [fullName, setFullName] = useState("");
	const [phone, setPhone] = useState("");



	//Button state
	const [buttonState, setButtonState]= useState(false);



	const actions = {
		email: setEmail,
		query: setQuery,
		fullName: setFullName,
		phone: setPhone
	}

	const setData = (event) => {
		actions[event.target.name](event.target.value);
	}



	const processContact = () => {
		setButtonState(true)
		logAlert(false);

		if(email.toString().trim() === "") return (() => {setButtonState(false); logAlert("Email is required", false)})()
		if(fullName.toString().trim() === "") return (() => {setButtonState(false); logAlert("Full Name is required", false)})()
		if(query.toString().trim() === "") return (() => {setButtonState(false); logAlert("Order Query is required", false)})()
		if(phone.toString().trim() === "") return (() => {setButtonState(false); logAlert("Phone Number is required", false)})()
		if(Math.sign(phone) === -1) return (() => {setButtonState(false); logAlert("Invalid phone Number", false)})()




		const url = window.BASE_URL + "/contacts/bulk-order";
		const config = {
			credentials: "include",
			method: "POST",
			body: JSON.stringify({email, name: fullName, query, phone}),
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
				setQuery("");
				setFullName("");
				setPhone("");
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
					<h4 className = "text-muted">Bulk Order Request</h4>
					<strong className = "contact-error-log text-danger"></strong>
				</div>

				<div className="input-group mb-3">
	              <div className="input-group-prepend">
	                <span className="input-group-text">@</span>
	              </div>
	              <input type="email" className="form-control input" placeholder="Email" name = "email" value = {email} onChange = {setData}/>
	            </div>

	            <div className="input-group mb-3">
	              <div className="input-group-prepend">
	                <span className="input-group-text"><span className = "fa fa-phone"></span></span>
	              </div>
	              <input type="number" className="form-control input" placeholder="Phone Number" name = "phone" value = {phone} onChange = {setData}/>
	            </div>

	            <div className="input-group mb-3">
	              <div className="input-group-prepend">
	                <span className="input-group-text"><span className = "fa fa-user"></span></span>
	              </div>
	              <input type="email" className="form-control input" placeholder="Full Name" name = "fullName" value = {fullName} onChange = {setData}/>
	            </div>

	           	<textarea className = "form-control input" rows ="10" placeholder = "Order Query..." name = "query" value = {query} onChange = {setData}></textarea>
	           	<button className = "input mt-3 btn btn-success submit-contact" onClick = {processContact}>{buttonState === true? "Processing...": "Process Order"}</button>
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