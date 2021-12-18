//Components
import Title from "./../../subComponents/Title";
import Header from "./../../subComponents/Header";
import {DeliveredToModal, SuccessModal} from "./../../subComponents/Modals"
import SideNav from "./../../subComponents/SideNav";
import Footer from "./../../subComponents/Footer";
import DiscountBanner from "./../../subComponents/DiscountBanner";



//Utilities
import {useState, useEffect} from "react";



function Cart () {

	//states
	const [sideBarToggled, setSideBarToggled] = useState(false);
	const [cartItems, setCartItems] = useState((localStorage.getItem("marketCart")) ? localStorage.getItem("marketCart"): JSON.stringify([]));
	const [cartData, setCartData] = useState(JSON.stringify([]));

	const [usersBillingAddress, setUsersBillingAddress] = useState(JSON.stringify([]));
	const [selectedAddress, setSelectedAddress] = useState("");
	const [totalPrice, setTotalPrice] = useState(0);
	const [charges, setCharges] = useState(0);
	const [processing, setProcessing] = useState(false);
	const [swalSuccessData, setSwalSuccessData] = useState(JSON.stringify({headerMessage: "", bodyMessage: ""}));
	const [swalToggled, setSwalToggled] = useState(false);
	const [validCoupon, setValidCoupon] = useState(JSON.stringify({}));
	const [grandTotal, setGrandTotal] = useState(0);
	const [coupon, setCoupon] = useState("");


	//Fetch cart item details in the cart list
	useEffect(() => {
		const list = JSON.stringify(getUnique(JSON.parse(cartItems)))

		if(list.length !== 0){

			const url = window.BASE_URL + "/products";
			const config = {
				credentials: "include",
				method: "POST",
				body: JSON.stringify({list,}),
				headers: {
					"Content-Type": "application/json"
				},
				
			}

			fetch(url, config)
			.then(res => res.json())
			.then(result => {
				if(result.success === true){
					setCartData(JSON.stringify(result.data))
				}
			})
			.catch(() => {

			})

		}
	}, [cartItems])




	const getUnique = (list) => {
		const log = []
		list.forEach((item, index) => {
			if(log.indexOf(item) < 0) log.push(item);
		})

		return log;
	}



	const addCartItem = (event, isAdd) => {
		const elem = event.target;
		const id = elem.getAttribute("data-id");
		const getCartItems = JSON.parse(cartItems)
		

		if(isAdd) getCartItems.push(id)
		else{
			const testId = []
			getCartItems.forEach((item, index) => {
				if(item === id) testId.push(id)
			})

			if(testId.length > 1) getCartItems.splice(getCartItems.lastIndexOf(id), 1);
		}

		setCartItems(JSON.stringify(getCartItems))
		let used = [];

		getCartItems.forEach((eachId, index) => {
			const testId = []
			getCartItems.forEach((id, idIndex) => {
				if(eachId === id && used.indexOf(eachId) < 0) testId.push(id)
			})


			if(eachId === id && used.indexOf(eachId) < 0){

				modifyButtonsBasedOnCart(eachId, testId.length);
				used.push(eachId)
			}

		})
	
	}


	const modifyButtonsBasedOnCart = (id, num) => {
		const targetButtons = document.querySelectorAll(".add-subtract-item");
		targetButtons.forEach((item, index) => {
			if(item.getAttribute("data-id") === id){
				if(num === 1) item.children[2].setAttribute("disabled", true);
				else item.children[2].removeAttribute("disabled");

				item.children[1].innerHTML = num;
			}
		})
	}



	useEffect(() => {
		const getCartItems = JSON.parse(cartItems)
		let  used = [];
		getCartItems.forEach((eachId, index) => {
			const testId = []
			getCartItems.forEach((id, idIndex) => {
				if(eachId === id && used.indexOf(eachId) < 0) testId.push(id)
			})

			if(used.indexOf(eachId) < 0){
				modifyButtonsBasedOnCart(eachId, testId.length);
				used.push(eachId)
			}
		})


	//Store items back to local storage
	localStorage.setItem("marketCart", cartItems)




	//Calculate the price
	let total = 0;

	used = [];
	getCartItems.forEach((eachId, index) => {
		const testId = []
		getCartItems.forEach((id, idIndex) => {
			if(eachId === id && used.indexOf(eachId) < 0) testId.push(id)
		})


		if(used.indexOf(eachId) < 0){
			let nos = testId.length;
			JSON.parse(cartData).forEach((item, index) => {
				if(eachId === item._id ) total = total + (item.amount * nos)
			})

			used.push(eachId)
		}
		
	})

	setTotalPrice(total);
	setCharges((total * (7/100)).toFixed(2));


	}, [cartData, cartItems])




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
				setUsersBillingAddress(JSON.stringify(result.message))
			}
			else{
				if("redirect" in result) window.location = result.redirect;
			}
		})
		.catch(() => {

		})
	}, [])




	const handleRemove = (event) => {
		const targetId = event.target.getAttribute("data-id");
		const testCartItems = JSON.parse(cartItems);

		JSON.parse(cartItems).forEach((eachId, index) => {
			if(targetId === eachId) testCartItems.splice(testCartItems.indexOf(eachId), 1);

		})

			
		setCartItems(JSON.stringify(testCartItems))

		const testData = JSON.parse(cartData)
		testData.forEach((item, index) => {
			if(item._id === targetId) testData.splice(index, 1);
		})

		setCartData(JSON.stringify(testData));
	}



	//Check to disable the checkout button
	useEffect(() => {
		if(JSON.parse(cartItems).length === 0 || processing === true) document.querySelector(".checkout").setAttribute("disabled", true)
		else document.querySelector(".checkout").removeAttribute("disabled");
	})




	const getAllProductsWithQty = () => {
		let result = [];
		let used = [];
		JSON.parse(cartItems).forEach((eachId, index) => {
			const testId = []
			JSON.parse(cartItems).forEach((id, idIndex) => {
				if(eachId === id && used.indexOf(eachId) < 0) testId.push(id)
			})


			if(used.indexOf(eachId) < 0){
				result.push({id: eachId, qty: testId.length})
				used.push(eachId)
			}
			
		})


		return result;
	}




	//Implement chechout
	const checkout = () => {

		const log = document.querySelector(".check-out-log")
		log.innerHTML = "";
		setProcessing(true);

		if(JSON.parse(cartItems).length !== 0){
			const products = getAllProductsWithQty();

			const url = window.BASE_URL+"/products/checkout";
			const config = {
				headers: {
					"Content-Type" : "application/json",
				},
				method: "POST",
				body: JSON.stringify({products, selectedAddress, validCoupon, }),
				credentials: "include"
			}


			fetch(url, config)
			.then(res => res.json())
			.then(result => {
				if(result.success){
					setCartItems(JSON.stringify([]));
					setCartData(JSON.stringify([]));
					setSelectedAddress("");
					setTotalPrice(0);
					setCharges(0);
					setProcessing(false)
					setSwalSuccessData(JSON.stringify({
						headerMessage: "Order Received !",
						bodyMessage: `Your order with Tracking ID: ${result.data._id} has been received. please wait while we contact you.`
					}))
					setSwalToggled(true)
					//Alert the user with sucess
				}
				else{
					if("redirect" in result) window.location = result.redirect;
					else{
						log.innerHTML = result.message;
					}
				}
				setProcessing(false)
			})
			.catch(() => {
				setProcessing(false)
			})
		}
	}





	const useCoupon = (event) => {
		event.target.setAttribute("disabled", true)
		const url = window.BASE_URL + "/products/discount/validate?coupon="+coupon;
		const config = {
			credentials: "include",
			method: "GET",
		}
		fetch(url, config)
		.then(res => res.json())
		.then(res => {
			if(res.success === true){
				setValidCoupon(JSON.stringify(res.data));
				setCoupon("")
			}

			event.target.removeAttribute("disabled")
		})
		.catch(()  => {
			event.target.removeAttribute("disabled")
		})
	}


	useEffect(() => {
		let total = parseInt(totalPrice) + parseInt(charges)
		if(Object.keys(JSON.parse(validCoupon)).length > 0) total = total - (total * JSON.parse(validCoupon).discount/100)
		setGrandTotal(total);
	}, [validCoupon, totalPrice, charges, cartItems, cartData])






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
			        		<h3 className = "pr-3"><strong>Cart <span className = "fa fa-shopping-cart cart-icon-heading"></span></strong></h3>
			        	</div>
			        	<ul className = "list-group">
			        		{
			        			JSON.parse(cartData).map((item , index) => {
			        				return(
				        				<li key = {item._id} className = "list-group-item">
						        			<div className = "d-flex justify-content-between">
						        				<div><span className= {item.foodType + " product-header cart-adjust"}></span><span>{item.foodName}</span></div>
						        				<span data-id = {item._id} className = "cart-remove-button btn-inverse-danger" onClick = {handleRemove}>Remove</span>
						        			</div>
						        			<div><small className = "text-muted">{item.foodGroup}</small></div>
						        			<div className = "d-flex justify-content-between">
						        				<div>
						        					<div data-id = {item._id} className = "btn-group add-subtract-item">
			   											<button data-id = {item._id} className = "btn btn-orange" onClick = {(event) => {addCartItem(event, true)}}> + </button>
			   											<button data-id = {item._id}  className = "btn">1</button>
			   											<button data-id = {item._id} className = "btn btn-orange" onClick = {(event) => {addCartItem(event, false)}}> - </button>
			   										</div>
						        				</div>
						        				<div>
						        					<span className = "fa fa-rupee"></span>
						        					<strong>{item.amount}</strong>
						        				</div>
						        			</div>
						        		</li>
						        	)
			        			})

			        		}

			        		{
			        			(JSON.parse(cartData).length === 0)? 
			        			(
			        				<div className = "ml-3 ">
			        					<h4>No Item Found on CART. </h4>
			        					<h6>Nothing left to see here. Go <a href = "/">Home</a></h6>
			        				</div>
			        			):(<div></div>)
			        		}
			        	</ul>

			        	<div className = "bill-board">
			        		<span>Safety Assured meals and contactless delivery</span>
			        	</div>
			        	<div className = "bill-details">
			        		<h5 className = "p-3 d-inline-block">BILLING ADDRESS</h5>
			        	</div>
			        	<ul className = "list-group">
			        		{
			        			JSON.parse(usersBillingAddress).map((item, index) => {
			        				return (
			        					<li key = {index} className = "list-group-item d-flex">
						        			<div>
						        				<input data-index = {parseInt(index) + 1} name = "billing-address" type = "radio" onChange = {(event) => setSelectedAddress(event.target.getAttribute("data-index"))}/>
						        			</div>
						        			<address className = "ml-3">{item}</address>
						        		</li>
			        				)
			        			})
			        		}
			        	
			        		<li className = "list-group-item d-flex">
			        			<a href = "billing-address"><button className = "btn btn-primary">Add Billing Address</button></a>
			        		</li>
			        	</ul>
			        	<div className = "bill-details">
			        		<h5 className = "p-3 d-inline-block">BILL DETAILS</h5>
			        	</div>
			        	<div className = "p-3 bg-white d-flex justify-content-between">
	        				<div>
	        					<strong className = "text-muted">Total Price</strong>
	        				</div>
	        				<div>
	        					<span className = "fa fa-rupee"></span>
	        					<strong>{totalPrice}</strong>
	        				</div>
	        			</div>
	        			<div className = "p-3 bg-white d-flex justify-content-between">
	        				<div>
	        					<strong className = "text-muted">Taxes and Charges (7%)</strong>
	        				</div>
	        				<div>
	        					<span className = "fa fa-rupee"></span>
	        					<strong>{charges}</strong>
	        				</div>
	        			</div>
	        			{
	        				(JSON.parse(cartItems).length > 0)? 
	        				(
	        					<div>
		        					<div className = "p-3 bg-white">
				        				<p>Use Discount Coupon</p>
				        				<div className = "btn-group">
				        					<input type = "text"className = "form-control" value = {coupon} onChange = {(event) => setCoupon(event.target.value)}/>
				        					<button type = "button" className = "btn btn-inverse-success" onClick = {useCoupon}>Use</button>
				        				</div>
				        			</div>
				        			<div className =  "coupon-container">
				        				{
				        					("coupon" in JSON.parse(validCoupon)) ? 
				        					(<div data-coupon = {JSON.parse(validCoupon).coupon}  id = {JSON.parse(validCoupon)._id} style = {{"background": "orange", "borderRadius": "10px", "userSelect": "none"}} className = "discount-item col-12">
												<span data-id = {JSON.parse(validCoupon)._id} className = "close" onClick = {() => {setValidCoupon(JSON.stringify({}))}}>&times;</span>
												<strong>{JSON.parse(validCoupon).coupon} <strong style = {{"fontSize": "24px"}}>{JSON.parse(validCoupon).discount}%</strong> discount</strong>
											</div>):(<div></div>)
				        				}
				        				
				        			</div>
				        		</div>
	        				): (<div></div>)
	        			}
	        			
	        			<div style = {{"fontSize": "25px"}} className = "p-3 bg-white d-flex justify-content-between">
	        				<div>
	        					<strong>Payable</strong>
	        				</div>
	        				<div>
	        					<span className = "fa fa-rupee"></span>
	        					<strong>{grandTotal}</strong>
	        				</div>
	        			</div>
	        			<b className = "text-danger pl-3"><i className = "check-out-log"></i></b>
	        			<button className = {(JSON.parse(cartItems).length === 0 || processing === true)? "checkout text-center bg-secondary":"checkout text-center"} onClick = {checkout}>{ (processing === false)? ("Checkout "+JSON.parse(cartItems).length+" Item for "+ (grandTotal) + " rupees"): "Processing..."}</button>
		        	</div>
		        </div>
		       
	        </div>
	    	<Footer />
	        <DeliveredToModal />
	        <SuccessModal setData = {setSwalSuccessData} setSwalToggled = {setSwalToggled} swalToggled = {swalToggled} data = {JSON.parse(swalSuccessData)} />
        </div>
    );
}

export default Cart; //Cart contents