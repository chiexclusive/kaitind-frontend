//Components
import Title from "./../../subComponents/Title";
import Header from "./../../subComponents/Header";
import {DeliveredToModal,} from "./../../subComponents/Modals"
import SideNav from "./../../subComponents/SideNav";
import Footer from "./../../subComponents/Footer";



//Utilities
import {useState, useEffect} from "react";



function TrackOrder () {

	//states
	const [sideBarToggled, setSideBarToggled] = useState(false);
	const [cartItems, ] = useState((localStorage.getItem("marketCart")) ? localStorage.getItem("marketCart"): JSON.stringify([]));
	const [status, setStatus] = useState("");
	const [cancelled, setCancelled] = useState(false);
	
	

	const id = window.location.search.split("?id=")[1]


	useEffect(() => {
		const url = window.BASE_URL+"/users/orders/track?id="+id;
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
				setStatus(result.data.status);
				setCancelled(result.data.cancelled)
			}
		})
		.catch(() => {

		})
	}, [id])




	useEffect(() => {
		let html = "";
		switch(status){
			case "received":
				html = `
						<div class = "p-3" "order-status-graph">
			        		<h3 class = "text-success">Order Received<span class = "fa fa-check"></span></h3>
			        		${(cancelled === true) ? "<h3 class = 'text-danger'>Order Cancelled<span class = 'fa fa-check'></span></h3>": ""}
			        		<h6 class = "text-muted">Process</h6>
			        		<h6 class = "text-muted">Ready</h6>
			        		<h6 class = "text-muted">Contact</h6>
			        		<h6 class = "text-muted">Deliver</h6>
			        	</div>
				`
				break;


			case "processing":
				html = `
			        		<h3 class = "text-success">Order Received<span class = "fa fa-check"></span></h3>
			        		<h5 class = "text-primary">Processing...</h5>
			        		${(cancelled === true) ? "<h3 class = 'text-danger'>Order Cancelled<span class = 'fa fa-check'></span></h3>": ""}
			        		<h6 class = "text-muted">Ready</h6>
			        		<h6 class = "text-muted">Contact</h6>
			        		<h6 class = "text-muted">Deliver</h6>
				`
			    break; 


			case "ready":
				html = `
			        		<h3 class = "text-success">Order Received<span class = "fa fa-check"></span></h3>
			        		<h3 class = "text-success">Order Processed<span class = "fa fa-check"></span></h3>
			        		<h3 class = "text-success">Order Ready<span class = "fa fa-check"></span></h3>
			        		${(cancelled === true) ? "<h3 class = 'text-danger'>Order Cancelled<span class = 'fa fa-check'></span></h3>": ""}
			        		<h6 class = "text-muted">Contact</h6>
			        		<h6 class = "text-muted">Deliver</h6>
				`
			    break; 

			case "contacting":
				html = `
			        		<h3 class = "text-success">Order Received<span class = "fa fa-check"></span></h3>
			        		<h3 class = "text-success">Order Processed<span class = "fa fa-check"></span></h3>
			        		<h3 class = "text-success">Order Ready<span class = "fa fa-check"></span></h3>
			        		<h5 class = "text-primary">Contacting...</h5>
			        		${(cancelled === true) ? "<h3 class = 'text-danger'>Order Cancelled<span class = 'fa fa-check'></span></h3>": ""}
			        		<h6 class = "text-muted">Deliver</h6>

				`
			    break;

			case "delivered":
				html = `
			        		<h3 class = "text-success">Order Received<span class = "fa fa-check"></span></h3>
			        		<h3 class = "text-success">Order Processed<span class = "fa fa-check"></span></h3>
			        		<h3 class = "text-success">Order Ready<span class = "fa fa-check"></span></h3>
			        		<h3 class = "text-success">Client Contacted<span class = "fa fa-check"></span></h3>
			        		<h3 class = "text-success">Order Delivered<span class = "fa fa-check"></span></h3>
				`
			    break; 
			default: 
				break;



		}
		

		document.querySelector(".track-content").innerHTML = html;

	}, [status, cancelled])





	




    return (
    	<div>
	        <Title text = "Track Order | KAITIND RESTAURANT" />
	        <Header cartItems = {JSON.parse(cartItems)} toggleSideBar = {(isToggled) => setSideBarToggled(isToggled)}  isOpen = {sideBarToggled}/>
	        <div className = "d-flex justify-content-center bg-web-color text-white"><strong>Use code FRESH40 and Get 40% Off</strong></div>
	        <div className = "wrapper">
		        <SideNav isOpen = {sideBarToggled} toggleSideBar = {(isToggled) => setSideBarToggled(isToggled)}/>
		        <div className = "cart p-3 w-100 bg-grey d-flex align-items-center justify-content-center">
		        	<div className = "card w-50">
			        	<div className = "text-center">
			        		<h3 className = "pr-3"><strong>Order Details<span className = "fa fa-cutlery cart-icon-heading"></span></strong></h3>
			        	</div>
			        	<ul className = "list-group">
			        		<h6 className = "pl-3"><small className = "text-muted">Tracking ID</small></h6>
			        		<h5 className = "pl-3">{id}</h5>
			        	</ul>

			        	<div className = "track-content"></div>
			        	
			        </div>  		


			        		
		        </div>
		       
	        </div>
	    	<Footer />
	        <DeliveredToModal />
        </div>
    );
}

export default TrackOrder; //Trak orders contents