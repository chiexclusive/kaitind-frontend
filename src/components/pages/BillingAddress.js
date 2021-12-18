//Components
import Title from "./../../subComponents/Title";
import Header from "./../../subComponents/Header";
import {DeliveredToModal} from "./../../subComponents/Modals"
import SideNav from "./../../subComponents/SideNav";
import Footer from "./../../subComponents/Footer";
import DiscountBanner from "./../../subComponents/DiscountBanner";


//Utilities
import {useState, useEffect} from "react";



function Cart () {

	//states
	const [sideBarToggled, setSideBarToggled] = useState(false);
	const [cartItems,] = useState((JSON.parse(localStorage.getItem("marketCart"))) ? [...JSON.parse(localStorage.getItem("marketCart"))]: []);
	const [processing, setProcessing] = useState(false)
	const [address, setAddress] = useState("");
	const [addresses, setAddresses] = useState(JSON.stringify([]));




	const storeBillingAddressing = () => {
		log(false);
		setProcessing(true)
		const url = window.BASE_URL+"/users/billing-address";
		const config = {
			headers: {
				"Content-Type" : "application/json",
			},
			body: JSON.stringify({address,}),
			method: "POST",
			credentials: "include"
		}
		fetch(url, config)
		.then(res => res.json())
		.then(result => {
			if(result.success){
				log("Address added successfully", true);
				setTimeout(() => {
					log(false)
				}, 3000)
				setAddresses(result.message.billingAddress);
				setAddress("")
			}
			else{
				if("redirect" in result) window.location = result.redirect;
				else log(result.message, false)
			}
			setProcessing(false)
		})
		.catch(() => {
			setProcessing(false)
		})
	}



	const log = (...args) => {
		const elem = document.querySelector(".billing-address-log")
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



	useEffect(() => {
		const elem = document.querySelector(".add-address-button")
		if(processing) elem.setAttribute("disabled", true)
		else elem.removeAttribute("disabled")
	}, [processing])




	useEffect(() => {
		const elem = document.querySelector(".add-address-button")
		if(address !== "") elem.removeAttribute("disabled")
		else elem.setAttribute("disabled", true)
	}, [address])



	//Fetch all the billing address to this user
	useEffect(() => {
		const url = window.BASE_URL+"/users/billing-address";
		const config = {
			headers: {
				"Content-Type" : "application/json",
			},
			method: "GET",
			credentials: "include"
		}
		fetch(url, config)
		.then(res => res.json())
		.then(result => {
			if(result.success){
				setAddresses(JSON.stringify(result.message))
			}
			else{
				if("redirect" in result) window.location = result.redirect;
			}
		})
		.catch(() => {

		})
	},[])





	const deleteAddress = (event) => {
		const index = event.target.getAttribute("data-index");
		const url = window.BASE_URL + "/users/billing-address?index=" + index;
		const config = {
			method: "DELETE",
			credentials: "include"
		}

		fetch(url, config)
		.then((res) => res.json())
		.then(result => {
			if(result.success === true){
				const newAddresses = JSON.parse(addresses)
				newAddresses.splice(index, 1);
				setAddresses(JSON.stringify(newAddresses));
			}
		})
	}



    return (
    	<div>
	        <Title text = "Order food online. Get fresh food from KAITIND RESTAURANT" />
	        <Header cartItems = {cartItems} toggleSideBar = {(isToggled) => setSideBarToggled(isToggled)}  isOpen = {sideBarToggled}/>
	        <DiscountBanner />
	        <div style = {{"minHeight": "100vh"}} className = "wrapper">
		        <SideNav isOpen = {sideBarToggled} toggleSideBar = {(isToggled) => setSideBarToggled(isToggled)}/>
		        <div className = "cart p-3 w-100 bg-grey d-flex align-items-center justify-content-center">
		        	<div style = {{"width": "60%"}} className = "card">
			        	<div className = "text-center">
			        		<h3 className = "pr-3"><strong>Billing Address <span className = "fa fa-address cart-icon-heading"></span></strong></h3>
			        	</div>
			        	<hr />
			        	<div className = "container">
			        		<textarea placeholder = "My Billing Address..." className = "form-control" rows = "8" value = {address} onChange = {(event) => {setAddress(event.target.value)}}>Bill Address...</textarea>
			        		<button className = "add-address-button mt-3 btn btn-primary" onClick = {storeBillingAddressing}>{(processing === true) ? "Adding...": "Add Address"}</button>
			        		<div className = "billing-address-log mt-3"></div>
			        	</div>
			        	<hr />
			        	<div className = "p-3">
			        		<h5>Address List </h5>
			        		<ul className = "list-group">
			        			{
			        				JSON.parse(addresses).map((address, index) => {
			        					return (
				        					<li key = {index} className = "list-group-item">
						        				<addr>{address}</addr>
						        				<div className = "mt-3">
						        					<button data-index = {index} className = "ml-3 btn btn-inverse-danger" onClick =  {deleteAddress}><span data-index = {index} className = "fa fa-trash"></span> Delete</button>
						        				</div>
						        			</li>
						        		)
			        				})
			        			}
			        		
			        			
			        		</ul>
			        	</div>
	        			
		        	</div>
		        </div>
		       
	        </div>
	    	<Footer />
	        <DeliveredToModal />
        </div>
    );
}

export default Cart; //Cart contents