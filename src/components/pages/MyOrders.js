//Components
import Title from "./../../subComponents/Title";
import Header from "./../../subComponents/Header";
import {DeliveredToModal, SuccessModal} from "./../../subComponents/Modals"
import SideNav from "./../../subComponents/SideNav";
import Footer from "./../../subComponents/Footer";
import DiscountBanner from "./../../subComponents/DiscountBanner";



//Utilities
import {useState, useEffect} from "react";



function MyOrders () {

	//states
	const [sideBarToggled, setSideBarToggled] = useState(false);
	const [cartItems, ] = useState((localStorage.getItem("marketCart")) ? localStorage.getItem("marketCart"): JSON.stringify([]));
	const [orders, setOrders] = useState(JSON.stringify([]));

	const [swalSuccessData, setSwalSuccessData] = useState(JSON.stringify({headerMessage: "", bodyMessage: ""}));
	const [swalToggled, setSwalToggled] = useState(false);
	//const [cancelDeliveredStatus, setCancelDeliveredStatus] = useState("");

	


	useEffect(() => {
		const url = window.BASE_URL+"/users/orders";
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
			if(result.success && result.data !== null && result.data !== undefined){
				setOrders(JSON.stringify(result.data))
			}
			else{
				if("redirect" in result) window.location = result.redirect;
			}

		})
		.catch(() => {

		})
	}, [])






	const cancelOrder  = (event) => {
		let log = document.querySelector(".cancel-order-log");
		log.innerHTML = ""

		const id = event.target.getAttribute("data-id")
		const url = window.BASE_URL+"/users/orders/cancel?id="+id;
		const config = {
			headers: {
				"Content-Type" : "application/json",
			},
			method: "POST",
			credentials: "include"
		}


		fetch(url, config)
		.then(res => res.json())
		.then(result => {
			if(result.success && result.data !== null && result.data !== undefined){
				setSwalSuccessData(JSON.stringify({
					headerMessage: "Request Sent !",
					bodyMessage: `We will cancel this order with Tracking ID: ${id} as soon as we receive your request.`
				}))
				setSwalToggled(true)
				//Alert the user with sucess
			}
			else{
				if("redirect" in result) window.location = result.redirect;
				else{
					log.innerHTML = `<i style = "margin-left: 10px; font-size: 12px" class = "text-danger">${result.message}</i>`
				}
			}

		})
		.catch(() => {

		})
	}









	




    return (
    	<div>
	        <Title text = "CART| KAITIND RESTAURANT" />
	        <Header cartItems = {JSON.parse(cartItems)} toggleSideBar = {(isToggled) => setSideBarToggled(isToggled)}  isOpen = {sideBarToggled}/>
	        <DiscountBanner />
	        <div className = "wrapper">
		        <SideNav isOpen = {sideBarToggled} toggleSideBar = {(isToggled) => setSideBarToggled(isToggled)}/>
		        <div className = "cart p-3 w-100 bg-grey d-flex align-items-center justify-content-center">
		        	<div className = "card w-50">
			        	<div className = "text-center">
			        		<h3 className = "pr-3"><strong>Orders <span className = "fa fa-cutlery cart-icon-heading"></span></strong></h3>
			        	</div>
			        	<ul className = "list-group">
			        		<div className = "cancel-order-log"></div>
			        		<h6 className = "pl-3"><small className = "text-muted">Tracking ID</small></h6>


			        		{
			        			JSON.parse(orders).map((item, index) => {
			        				return (
										<li className = "my-order-item list-group-item d-flex justify-content-between p-3">
						        			<div style = {{"lineHeight":"0.3"}}>
						        				<a href = {"/my-orders/details?id="+item._id}><h5>{item._id}</h5></a>
						        				<date className = "text-muted">{window.formatDate(item.dateCreated)}</date>
						        			</div>
						        			<div>
						        				{
						        					(item.cancelled === true || item.status === "delivered")? (<span>{((item.cancelled === true) ? "Order Cancelled": (item.status === "delivered") ? "Order Delivered": "")}</span>): (<button data-id = {item._id} className = "cancel-order" onClick = {cancelOrder}>Cancel Order</button>)
						        				}
		
						        				<a href = {"/my-orders/track?id="+item._id}><button data-id = {item._id} className = "track-order">Track Order</button></a>
						        			</div>
						        		</li>
						        	)
			        			})
			        		}


			        		{
			        			(JSON.parse(orders).length === 0)? 
			        			(
			        				<div className = "ml-3">
			        					<h4>No Orders Found. </h4>
			        					<h6>Nothing left to see here. Go <a href = "/">Home</a></h6>
			        				</div>
			        			):(<div></div>)
			        		}
			    		
			        	</ul>
			        	
			        	
			        
		        	</div>
		        </div>
		       
	        </div>
	    	<Footer />
	        <DeliveredToModal />
	       
			 <SuccessModal setData = {setSwalSuccessData} setSwalToggled = {setSwalToggled} swalToggled = {swalToggled} data = {JSON.parse(swalSuccessData)} />
        </div>
    );
}

export default MyOrders; //My orders contents