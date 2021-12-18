//Components
import Title from "./../../subComponents/Title";
import Header from "./../../subComponents/Header";
import {DeliveredToModal, SuccessModal} from "./../../subComponents/Modals"
import SideNav from "./../../subComponents/SideNav";
import Footer from "./../../subComponents/Footer";
import DiscountBanner from "./../../subComponents/DiscountBanner";



//Utilities
import {useState, useEffect} from "react";



function MyOrdersDetails () {

	//states
	const [sideBarToggled, setSideBarToggled] = useState(false);
	const [cartItems,] = useState((localStorage.getItem("marketCart")) ? localStorage.getItem("marketCart"): JSON.stringify([]));
	const [order, setOrder] = useState(JSON.stringify({}));
	const [swalSuccessData, setSwalSuccessData] = useState(JSON.stringify({headerMessage: "", bodyMessage: ""}));
	const [swalToggled, setSwalToggled] = useState(false);
	
	


	const id = window.location.search.split("?id=")[1];
	if(id.toString().trim() === "") window.location = "/";


	useEffect(() => {
		const url = window.BASE_URL+"/users/orders/details?id="+id;
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
				setOrder(JSON.stringify(result.data))
			}
			else{
				if("redirect" in result) window.location = result.redirect;
			}

		})
		.catch(() => {

		})
	}, [id])




	const cancelOrder  = () => {
		let log = document.querySelector(".cancel-order-log");
		log.innerHTML = ""
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
					bodyMessage: `We will cancel this order with Tracking ID: ${order._id} as soon as we receive your request.`
				}))
				setSwalToggled(true)
				//Alert the user with sucess
			}
			else{
				if("redirect" in result) window.location = result.redirect;
				else{
					log.innerHTML = `<i class = "text-danger" style = "font-size: 12px"}}>${result.message}</i>`
				}
			}

		})
		.catch(() => {

		})
	}



	




    return (
    	<div>
	        <Title text = "Order Details | KAITIND RESTAURANT" />
	        <Header cartItems = {JSON.parse(cartItems)} toggleSideBar = {(isToggled) => setSideBarToggled(isToggled)}  isOpen = {sideBarToggled}/>
	        <DiscountBanner />
	        <div className = "wrapper">
		        <SideNav isOpen = {sideBarToggled} toggleSideBar = {(isToggled) => setSideBarToggled(isToggled)}/>
		        <div className = "cart p-3 w-100 bg-grey d-flex align-items-center justify-content-center">
		        	<div className = "card w-50">
			        	<div className = "text-center">
			        		<h3 className = "pr-3"><strong>Order Details<span className = "ml-3 fa fa-cutlery cart-icon-heading"></span></strong></h3>
			        	</div>
			        	<ul className = "list-group">
			        		<h6 className = "pl-3"><small className = "text-muted">Tracking ID</small></h6>
			        		<h5 className = "pl-3">{("_id" in JSON.parse(order)) ? JSON.parse(order)._id : ""}</h5>
			        		<h6 className = "pl-3"><small className = "text-muted">Billing Address</small></h6>
			        		<h5 className = "pl-3">{("billingAddress" in JSON.parse(order)) ? JSON.parse(order).billingAddress : ""}</h5>
			        		<h6 className = "pl-3"><small className = "text-muted">Order Date</small></h6>
			        		<h5 className = "pl-3">{("dateCreated" in JSON.parse(order)) ? window.formatDate(JSON.parse(order).dateCreated) : ""}</h5>

			        		

			        		{
			        			("orders" in JSON.parse(order)) ? JSON.parse(JSON.parse(order).orders).map((item, index) => {
			        				return (
			        					<li key = {index} className = "list-group-item">
						        			<div className = "d-flex flex-column">
						        			<div><small className = "text-muted">{item.data.foodGroup}</small></div>
						        				<strong><span className= {item.data.foodType + "product-header cart-adjust"}></span><span>{item.data.foodName}</span></strong>
						        			</div>
						        			<div className = "d-flex justify-content-between">
						        				<small>Qty: {item.qty}</small>
						        				<div>
						        					<span className = "fa fa-rupee"></span>
						        					<strong>{item.data.amount}</strong>
						        				</div>
						        			</div>
						        		</li>
			        				)
			        			}): (<div></div>)
			        		}
			        	

			    		
			        	</ul>


			        	<div className = "p-3 bg-white d-flex justify-content-between">
	        				<div>
	        					<strong className = "text-muted">Total Price</strong>
	        				</div>
	        				<div>
	        					<span className = "fa fa-rupee"></span>
	        					<strong>{("total" in JSON.parse(order)) ? JSON.parse(order).total: ""}</strong>
	        				</div>
	        			</div>
	        			<div className = "p-3 bg-white d-flex justify-content-between">
	        				<div>
	        					<strong className = "text-muted">Taxes and Charges (7%)</strong>
	        				</div>
	        				<div>
	        					<span className = "fa fa-rupee"></span>
	        					<strong>{("charges" in JSON.parse(order)) ? parseFloat(JSON.parse(order).charges).toFixed(2) : ""}</strong>
	        				</div>
	        			</div>


	        			<div className = "p-3 bg-white d-flex justify-content-between">
	        				<div>
	        					<strong className = "text-muted">Discount {("coupon" in JSON.parse(order)) ? JSON.parse(JSON.parse(order).coupon).coupon + " ("+JSON.parse(JSON.parse(order).coupon).discount+"%) " : ""}</strong>
	        				</div>
	        				<div>
	        					<span className = "fa fa-rupee"></span>
	        					<strong>{("coupon" in JSON.parse(order)) ? ((JSON.parse(JSON.parse(order).coupon).discount/100 * (parseFloat(JSON.parse(order).charges).toFixed(2) + parseInt(JSON.parse(order).total))).toFixed(2)): " "}</strong>
	        				</div>
	        			</div>

	        	

	        			<div style = {{"fontSize": "25px"}} className = "p-3 bg-white d-flex justify-content-between">
	        				<div>
	        					<strong>Payable</strong>
	        				</div>
	        				<div>
	        					<span className = "fa fa-rupee"></span>
	        					<strong>{("grandTotal" in JSON.parse(order)) ? JSON.parse(order).grandTotal : ""}</strong>
	        				</div>
	        			</div>

	        			<div style = {{"fontSize": "25px"}} className = "p-3 bg-white">
	        				<div className = "cancel-order-log">
	        					
	        				</div>
	        				<div>
	        					<a href = {"/my-orders/track?id="+ JSON.parse(order)._id}><button className = "btn btn-primary">Track Order</button></a>
	        				
	        						{
			        					(JSON.parse(order).cancelled === true || JSON.parse(order).status === "delivered")? (<span style =  {{"fontSize": ".7em", "fontWeight": "bolder", "marginLeft": "10px"}}>{((JSON.parse(order).cancelled === true) ? " Order Cancelled": (JSON.parse(order).status === "delivered") ? "Order Delivered": "")}</span>): (<button className = "ml-3 btn btn-danger" onClick = {cancelOrder}>Cancel Order</button>)
			        				}
	        					
	        				</div>
	        			</div>
	        			
			        	
			        	
			        
		        	</div>
		        </div>
		       
	        </div>
	    	<Footer />
	        <DeliveredToModal />
	        <SuccessModal setData = {setSwalSuccessData} setSwalToggled = {setSwalToggled} swalToggled = {swalToggled} data = {JSON.parse(swalSuccessData)} />
        </div>
    );
}

export default MyOrdersDetails; //My orders details contents