import {useState, useEffect} from "react";



export default function ViewOrderModal (props) {

	const [status, setStatus] = useState("");
	const [processing, setProcessing] = useState(false);
	const [cancelled, setCancelled] = useState(false);
	const [cancelProcessing, setCancelProcessing] = useState(false);

	//Modify value of order status
	useEffect(() => {
		const select = document.querySelector(".order-status");
		if(select !== null && select !== undefined){
			select.value = props.data.status;
			
		}
		setStatus(props.data.status)
		setCancelled(props.data.cancelled)
	}, [props.data])


	useEffect(() => {
		const button = document.querySelector(".status-update-button");
		if(button !== null && button !== undefined){
			if(processing === true) button.setAttribute("disabled", true)
			else  button.removeAttribute("disabled")
		}
	}, [processing])



	useEffect(() => {
		const button = document.querySelector(".cancel-order");
		if(button !== null && button !== undefined){
			if(processing === true) button.setAttribute("disabled", true)
			else  button.removeAttribute("disabled")
		}
	}, [cancelProcessing, processing])


	//Update status logic
	useEffect(() => {
		let html = ""
		const updateSection=   document.querySelector(".update-status-container");
		const cancelSection = document.querySelector(".cancel-order-container");
		if(status === "delivered"){
			updateSection.style.display = "none"
			cancelSection.style.display = "none"
		}


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
				html =  "";
				break;



		}
		

		document.querySelector(".order-status-graph").innerHTML = html;

	}, [status, cancelled])



	const updateStatus = () => {
		setProcessing(true)
		logAlert(false, "status")
		const url = window.BASE_URL+"/admin/orders/status?id="+props.data._id+"&status="+document.querySelector(".order-status").value;
		const config = {
			headers: {
				"Content-Type" : "application/json",
			},
			method: "PUT",
			credentials: "include"
		}


		fetch(url, config)
		.then(res => res.json())
		.then(result => {
			if(result.success){
				setStatus(document.querySelector(".order-status").value)
				logAlert("Status Updated Successfully", true, "status")
				setTimeout(() => logAlert(false, "status"), 3000)
				setProcessing(false);
			}else{
				logAlert(result.message, false , "status")
				setProcessing(false)
			}
		})
		.catch(() => {
			setProcessing(false)
		})
	}



	const cancelOrder = () => {
		setCancelProcessing(true);
		logAlert(false, "cancel")
		const url = window.BASE_URL+"/admin/orders/cancel?id="+props.data._id;
		const config = {
			headers: {
				"Content-Type" : "application/json",
			},
			method: "PUT",
			credentials: "include"
		}


		fetch(url, config)
		.then(res => res.json())
		.then(result => {
			if(result.success){
				setCancelled(true)
				logAlert("Order cancelled", true, "cancel")
				setTimeout(() => logAlert(false, "cancel"), 3000)
				setCancelProcessing(false);
			}else{
				logAlert(result.message, false, "cancel")
				setCancelProcessing(false)
			}
		})
		.catch(() => {
			setCancelProcessing(false)
		})
	}


	const cleanUp = (event) => {
		if(event.target === document.querySelector(".view-order-modal") || event.target === document.querySelector(".close-view-order-button")){
			props.setData(JSON.stringify({}))
			const updateSection=   document.querySelector(".update-status-container");
			const cancelSection = document.querySelector(".cancel-order-container");
			updateSection.style.display = "block"
			cancelSection.style.display = "block"

		}
	}




	const logAlert = (...args) => {
		let elem = document.querySelector(".status-update-log")
		if(args.length === 2 && args[0] === false){
			if(args[1] === "status")  elem = document.querySelector(".status-update-log")
			else elem =  document.querySelector(".cancel-order-log")
			elem.innerHTML = "";
			return;
		}

		if(args[2] === "status")  elem = document.querySelector(".status-update-log")
		else elem =  document.querySelector(".cancel-order-log")
		elem.innerHTML = `
			<div class = "text-left alert alert-dismissible ${(args[1] === true )? 'alert-success': 'alert-danger'}">
       			<strong>${(args[1] === true )? 'Success !': 'Error !'}</strong>
       			<span>${args[0]}</span>
       			<span class = "close" data-dismiss = "alert">&times;</span>
       		</div>
		`;
	}


	return (
		<div className = "modal" id = "view-order-modal" onClick = {cleanUp}>
			<div className = "modal-dialog">
				<div className = "modal-content">
					<div className = "modal-header">
						<strong>Order Details</strong>
						<span className = "close" data-dismiss = "modal">&times;</span>
					</div>
					<div className = "text-left modal-body">
						<ul className = "list-group">
	        				<h5>Client Info</h5>
							<h6 className = "pl-3"><small className = "text-muted">Full Name</small></h6>
			        		<h5 className = "pl-3">{("FirstName" in props.data && "LastName" in props.data) ? (props.data.FirstName + " "+ props.data.LastName) : ""}</h5>
			        		<h6 className = "pl-3"><small className = "text-muted">Email</small></h6>
			        		<h5 className = "pl-3">{("Email" in props.data) ? props.data.Email : ""}</h5>
			        		<h6 className = "pl-3"><small className = "text-muted">Phone</small></h6>
			        		<h5 className = "pl-3">{("Phone" in props.data) ? props.data.Phone: ""}</h5>
			        		<hr className = "w-100"/>
			        		<h6 className = "pl-3"><small className = "text-muted">Tracking ID</small></h6>
			        		<h5 className = "pl-3">{("_id" in props.data) ? props.data._id : ""}</h5>
			        		<h6 className = "pl-3"><small className = "text-muted">Billing Address</small></h6>
			        		<h5 className = "pl-3">{("billingAddress" in props.data) ? props.data.billingAddress : ""}</h5>
			        		<h6 className = "pl-3"><small className = "text-muted">Order Date</small></h6>
			        		<h5 className = "pl-3">{("dateCreated" in props.data) ? window.formatDate(props.data.dateCreated) : ""}</h5>


			        		<hr className = "w-100"/>
	        				<h5>Order List</h5>



	        				{
			        			("orders" in props.data) ? JSON.parse(props.data.orders).map((item, index) => {
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
	        					<strong>{("total" in props.data) ? props.data.total: ""}</strong>
	        				</div>
	        			</div>
	        			<div className = "p-3 bg-white d-flex justify-content-between">
	        				<div>
	        					<strong className = "text-muted">Taxes and Charges (7%)</strong>
	        				</div>
	        				<div>
	        					<span className = "fa fa-rupee"></span>
	        					<strong>{("charges" in props.data) ? parseFloat(props.data.charges).toFixed(2) : ""}</strong>
	        				</div>
	        			</div>

	        			<div className = "p-3 bg-white d-flex justify-content-between">
	        				<div>
	        					<strong className = "text-muted">Discount {("coupon" in props.data) ? JSON.parse(props.data.coupon).coupon + " ("+JSON.parse(props.data.coupon).discount+"%) " : ""}</strong>
	        				</div>
	        				<div>
	        					<span className = "fa fa-rupee"></span>
	        					<strong>{("coupon" in props.data)? ((JSON.parse(props.data.coupon).discount/100 * (parseFloat(props.data.charges).toFixed(2) + parseInt(props.data.total))).toFixed(2)): ""}</strong>
	        				</div>
	        			</div>

	        			<div style = {{"fontSize": "25px"}} className = "p-3 bg-white d-flex justify-content-between">
	        				<div>
	        					<strong>Payable</strong>
	        				</div>
	        				<div>
	        					<span className = "fa fa-rupee"></span>
	        					<strong>{("grandTotal" in props.data) ? props.data.grandTotal: ""}</strong>
	        				</div>
	        			</div>
	        			<hr/>
	        			<h5>Order Status</h5>
	        			<div className = "p-3 order-status-graph">
			        		
			        	</div>
			        	<div className = "update-status-container">
		        			<select className = "order-status form-control">
								<option value = "received">Received</option>
								<option value = "processing">Processing</option>
								<option value = "ready">Ready</option>
								<option value = "contacting">Contacting</option>
								<option value = "delivered">Delivered</option>
							</select>
							
							<button className = "mt-3 btn btn-primary status-update-button" onClick = {updateStatus}>{(processing === true) ? "Updating...":"Update Status"}</button>
						</div>
						<div className = "w-100 status-update-log"></div>
						<hr/>
						<div className = "w-100 cancel-order-container">
		        			<h4>Cancel Order</h4>
		        			<button className = "btn btn-danger btn-fluid cancel-order" onClick = {cancelOrder}>{(cancelProcessing === true )? "Cancelling...": "Cancel Order"}</button>
		        			<div className = "cancel-order-log"></div>
	        			</div>
					</div>
					<div className = "modal-footer">
						<button className = "btn btn-danger close-view-order-button" data-dismiss = "modal" onClick = {cleanUp}>Ok</button>
					</div>
				</div>
			</div>
		</div>
	)
}