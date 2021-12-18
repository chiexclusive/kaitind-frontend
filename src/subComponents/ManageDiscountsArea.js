

import {useEffect, useState} from "react";


function ManageDiscountsArea (){

	const [coupon, setCoupon] = useState("")
	const [discount, setDiscount] = useState("")
	const [expires, setExpires] = useState("")
	const [buttonState, setButtonState] = useState(false)


	const [discounts, setDiscounts] = useState(JSON.stringify([]))


	const drag = (event) => {
		const data = event.dataTransfer.setData("id", event.target.id)
	}


	const drop = (event) => {
		const id = event.dataTransfer.getData("id")
		const elem = document.getElementById(id).children[1].cloneNode(true);
		const target = document.querySelector(".discount-selected");
		target.innerHTML = "";
		target.appendChild(elem)
		target.classList.remove("hide")
		event.target.classList.remove("discount-active")
		registerSelection(id);
	}

	const mouseOut = (event) => {
		event.target.classList.remove("discount-active")
	}

	const dragOver = (event) => {
		event.preventDefault();
		event.target.classList.add("discount-active")
	}




	const registerSelection = (id) => {
		const url = window.BASE_URL + "/admin/discounts?id="+id;
		const config = {
			credentials: "include",
			method: "PUT",
		}
		fetch(url, config)
		.then(res => res.json())
		.then(res => {
			if(res.success){
				const newDiscounts = JSON.parse(discounts);
				JSON.parse(discounts).forEach((item, index) => {
					item.inUse = false;
					if(item._id === id) item.inUse = true
				})
				setDiscounts(JSON.stringify(newDiscounts))
			}
		})
		.catch(() => setButtonState(false))
	}




	const deleteDiscounts = (event) => {
		const id = event.target.getAttribute("data-id")
		const url = window.BASE_URL + "/admin/discounts?id="+id;
		const config = {
			credentials: "include",
			method: "DELETE",
		}
		fetch(url, config)
		.then(res => res.json())
		.then(res => {
			if(res.success){
				const newDiscounts = JSON.parse(discounts);
				JSON.parse(discounts).forEach((item, index) => {
					if(item._id === id) newDiscounts.splice(index, 1)
				})
				setDiscounts(JSON.stringify(newDiscounts))
			}
		})
		.catch(() => setButtonState(false))
	}



	const generateCoupon = () => {
		const prefix = "kaitind"
		const num = Math.floor(Math.random() * 10000)
		setCoupon(prefix + num)
	}



	const createDiscount = () => {
		logAlert(false)
		setButtonState(true)
		const url = window.BASE_URL + "/admin/discounts";
		const config = {
			credentials: "include",
			method: "POST",
			body: JSON.stringify({coupon, discount, expires}),
			headers: {
				"Content-Type": "application/json"
			}
		}
		fetch(url, config)
		.then(res => res.json())
		.then(res => {
			if(res.success){
				logAlert("Discount Added Successfully. ", true);
				setTimeout(() => {
					logAlert(false)
				}, 4000)
				setCoupon("");
				setExpires("");
				setDiscount("");
				const newDiscounts = JSON.parse(discounts);
				newDiscounts.unshift(res.data)
				setDiscounts(JSON.stringify(newDiscounts))
			}else logAlert(res.message, false)
			setButtonState(false)
		})
		.catch(() => setButtonState(false))
	}




	const logAlert = (...args) => {
		const elem = document.querySelector(".discounts-log")
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
		const elem = document.querySelector(".create-discount")
		if(buttonState === true) elem.setAttribute("disabled", true)
		else elem.removeAttribute("disabled")
	})



	useEffect(() => {
		const url = window.BASE_URL + "/admin/discounts/fetch";
		const config = {
			credentials: "include",
			method: "GET",
		}
		fetch(url, config)
		.then(res => res.json())
		.then(res => {
			if(res.success){
				setDiscounts(JSON.stringify(res.data))
			}
		})
		.catch(() => setButtonState(false))
	}, [])




	const computeExpires = (date, expires) => {
		const created = new Date(date)
		const now = new Date()

		const diff = (Date.parse(now) - Date.parse(created))/1000;

		const left = (diff + expires) / 3600


		if(Math.sign(left) === -1) return "Expired";
		else{

			if(left < 1) return "Expires in less that 1Hr"
			else return "Expires in about "+ Math.floor(left)+ "Hr"
		}
	}




	const filterDiscounts =  (event) => {
		const query = event.target.value.toString().trim().toLowerCase();
		const allDiscountElem = document.querySelectorAll(".discount-item")
		allDiscountElem.forEach((elem, index) => {
			elem.classList.add("hide")
			const id = elem.getAttribute("data-coupon").toString().trim().toLowerCase()
			if(id.indexOf(query) >= 0) elem.classList.remove("hide")
		})
	}




	useEffect(() => {
		let html = "";

		JSON.parse(discounts).forEach((item, index) => {
			if(item.inUse === true && !hasExpired(item.dateCreated, item.expires)){
				html = `
					<strong>${item.coupon} <strong style = {{"fontSize": "24px"}}>${item.discount}% discount</strong></strong>
				`

				document.querySelector(".discount-selected").innerHTML = html;
				document.querySelector(".discount-selected").classList.remove("hide")
			}
		})


	}, [discounts])



	const hasExpired = (date, expires) => {
		const created = new Date(date)
		const now = new Date()

		const diff = (Date.parse(now) - Date.parse(created))/1000;

		const left = (diff + expires) / 3600

		if(Math.sign(left) == -1) return true;
		else return false;
	}






	return (
		<div className = "container ManageDiscountsArea">
			<div className  = "breadcrumb">
				<span className = "breadcrumb-item"><a href = "/"><span className = "fa fa-home"></span>Home</a></span>
				<span className = "breadcrumb-item">Manage Discounts</span>
			</div>
			<div className = "row">

				<div className = "col-sm-6 col-xs-12 btn-group mt-3">
					<button className = "btn btn-primary" onClick = {generateCoupon}>Generate</button>
					<input placeholder = "Type Coupon" type = "text" className = "form-control" value = {coupon} onChange = {(event) => setCoupon(event.target.value)}/>
				</div>
				<div className = "col-sm-6 col-xs-12 d-flex mt-3">
					<input placeholder = "% Discount" type = "text" className = "form-control" value = {discount} onChange = {(event) => setDiscount(event.target.value)} />
				</div>
				<div className = "col-sm-6 col-xs-12 d-flex mt-3">
					<input placeholder = "Expires (Hours)" type = "number" className = "form-control"  value = {expires} onChange = {(event) => setExpires(event.target.value)}/>
				</div>
				<div className = "col-sm-12 col-xs-12 mt-3">
					<button className = "btn btn-primary btn-fluid create-discount" onClick = {createDiscount}>{buttonState === true ? "Creating...": "Create Discount"}</button>
				</div>
				<div className = "mt-3 discounts-log w-100"></div>
			</div>

			<hr />
			<h5>Selected:</h5>
			<div style = {{"background": "orange", "borderRadius": "10px"}} className = "hide p-3 col-12 discount-selected">
	
			</div>

			<div className = "webselect mt-3" onDrop = {drop} onDragOver = {dragOver}>
				Drag and Drop to Select
			</div>

			<div>
				<input type = "text" className = "form-control" placeholder = "Filter by coupons" onChange = {filterDiscounts}/>
			</div>

			<div className = "row">

				{
					JSON.parse(discounts).map((item, index) => {
						return (
							<div data-coupon = {item.coupon}  key = {index} id = {item._id} style = {{"background": "orange", "borderRadius": "10px", "cursor": "grab", "userSelect": "none"}} className = "discount-item m-3 col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2" draggable = "true" onDragStart = {drag}>
								<span data-id = {item._id} className = "close" onClick = {deleteDiscounts}>&times;</span>
								<strong>{item.coupon} <strong style = {{"fontSize": "24px"}}>{item.discount}%</strong></strong>
								<div style = {{"fontSize": "12px", "marginTop": "-5px"}}>{computeExpires(item.dateCreated, item.expires)}</div>
							</div>
						)
					})
				}

				


			</div>
		</div>
	)
}



export default ManageDiscountsArea;