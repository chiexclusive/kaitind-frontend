
import ViewOrderModal from "./adminModals/viewOrderModal.js";


//Dependencies
import {useState, useEffect} from "react"


function ManageOrderArea () {


	const [orders, setOrders] = useState(JSON.stringify([]));
	const [viewOrder, setViewOrder] = useState(JSON.stringify({

	}))



	useEffect(() => {
		const url = window.BASE_URL+"/admin/orders";
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
				if("redirect" in result) window.location = result.redirect
			}
		})
		.catch(() => {

		})
	}, [])


	const handleViewOrder = (event) => {
		const targetId = event.target.getAttribute("data-id");
		JSON.parse(orders).forEach((item, index) => {
			if(item._id === targetId) setViewOrder(JSON.stringify(item));
		})
	}


	const filterByTrackingId = (event) => {
		const query = event.target.value.toString().trim().toLowerCase();
		const allOrderElem = document.querySelectorAll(".order-item")
		allOrderElem.forEach((elem, index) => {
			elem.classList.add("hide")
			const id = elem.getAttribute("data-id").toString().trim().toLowerCase()
			if(id.indexOf(query) >= 0) elem.classList.remove("hide")
		})
	}


	return (
			<div style = {{"minHeight": "70vh", "backgroundColor": "rgb(240 240 240)"}}>
		
				<div className  = "breadcrumb">
					<span className = "breadcrumb-item"><a href = "/"><span className = "fa fa-home"></span>Home</a></span>
					<span className = "breadcrumb-item">Manage Orders</span>
				</div>
				<div className = "card">
					<ul className = "list-group">
						<input type ="text" placeholder = "Search by Tracking ID" className = "form-control" onChange = {filterByTrackingId}/>
						

						{
							JSON.parse(orders).map((item, index) => {
								return (
									<li key = {index} data-id = {item._id} className = "list-group-item d-flex justify-content-between p-3 order-item">
					        			<div style = {{"textAlign": "left", "lineHeight":"0.3"}}>
					        				<h5>{item._id}</h5>
					        				<span className = "text-muted">{window.formatDate(item.dateCreated)}</span>
					        			</div>
					        			<div>
					        				<button className = "track-order" data-toggle = "modal" data-target = "#view-order-modal" data-id = {item._id} onClick = {handleViewOrder}>View Order</button>
					        			</div>
					        		</li>
								)
							})
						}

					</ul>
				</div>

				<ViewOrderModal data = {JSON.parse(viewOrder)} setData = {setViewOrder}/>
			</div>
	)
}

export default ManageOrderArea
