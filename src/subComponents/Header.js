//Utilities
import {/*useState,*/ useEffect} from "react";

export default function Header (props) {


	//rotate icon when clicked
	let handleRotateIcon =  (event) => {
		if(props.isOpen === false){ 
			props.toggleSideBar(true)	
		}else {
			props.toggleSideBar(false)
		}
	}


	//check to hide badge
	const checkToHideBadge = (elem) => {
		var cartItems = [];
		if("cartItems" in  props){
			cartItems = props.cartItems
		}else{
			cartItems = (JSON.parse(localStorage.getItem("marketCart"))) ? [...JSON.parse(localStorage.getItem("marketCart"))] : [];
		}


		if(cartItems.length < 1){
			elem.classList.add("hide");
		}else{
			elem.classList.remove("hide");
		}
	}
		


	useEffect(() => {
		const elem = document.querySelector(".sidebar-toggle");
		if(props.isOpen === false) elem.style.transform  = "rotate(0deg)";
		else elem.style.transform = "rotate(-180deg)";


		//toggle badge if there is item of the cart
		checkToHideBadge(document.querySelector(".cart-badge"));
	})


	return (
		<nav className="sticky-top navbar navbar-expand-lg navbar-light bg-light">
		  <div className="d-flex align-items-center navbar-brand">
		  	<a href = "/"><h3><strong>Kaitind</strong></h3></a>
		  	<span  style = {{"marginLeft": "10px"}} className = "hidden-sm fa fa-chevron-down sidebar-toggle" onClick = {(event) => handleRotateIcon(event)}></span>
		  </div>

		 
		  <div className = "hidden-470px">
		  	<span className = "text-muted"><strong>Delivered to: </strong></span>
		  	<span className = "cursor-pointer d-inline-flex" data-toggle = "modal" data-target = "#delivered-to-modal">
			  	<span style = {{"width":"100px"}} className = "text-page-primary text-truncate"> Koramangala, Bengalid</span>
			  	<span className = "mx-3 text-muted fa fa-chevron-down"></span>
		  	</span>
		  </div>

		  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
		    <span className="navbar-toggler-icon"></span>
		  </button>


	

		  <div className="collapse navbar-collapse" id="navbarSupportedContent">

		    <ul className="m-auto navbar-nav mr-auto">
		     
		      <li className="nav-item">
		        <a className="nav-link" href="#">
		        	<span className = "fa fa-trophy mr-3 "></span>
		        	<span className = "hidden-icon-nav">Offer</span>
		        </a>
		      </li>
		      <li className="nav-item">
		        <a className="nav-link" href="#">
		        	<span className = "fa fa-compass mr-3"></span>
		        	<span className = "hidden-icon-nav">Help Center</span>
		        </a>
		      </li>
	
		      <li className="nav-item">
		        <a className="nav-link" href="/cart">
		        	<span className = "fa fa-shopping-cart mr-3"></span>
		        	<span className = "hide cart-badge badge btn-orange" onChange = {(event) => checkToHideBadge(event.target)}>{("cartItems" in props) ? props.cartItems.length:  (JSON.parse(localStorage.getItem("marketCart"))) ? [... JSON.parse(localStorage.getItem("marketCart"))].length : 0}</span>
		        	<span className = "hidden-icon-nav">Cart</span>

		        </a>
		      </li>

		    </ul>
		    <form className="form-inline my-2 my-lg-0">
		      <input className="form-control mr-sm-2 search-input" type="search" placeholder="Search" aria-label="Search" />
		      <button className="btn btn-outline-primary search-button my-2 my-sm-0" type="submit">Search</button>
		    </form>
		  </div>

		</nav>
	)
}