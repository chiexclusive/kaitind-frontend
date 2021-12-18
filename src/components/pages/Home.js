//Components
import Title from "./../../subComponents/Title";
import Header from "./../../subComponents/Header";
import Carousel from  "./../../subComponents/Carousel";
import {DeliveredToModal} from "./../../subComponents/Modals"
import SideNav from "./../../subComponents/SideNav";
import MarketArea from "./../../subComponents/MarketArea";
import Footer from "./../../subComponents/Footer";
import DiscountBanner from "./../../subComponents/DiscountBanner";


//Utilities
import {useState, useEffect} from "react";



function Home () {

	//states
	const [sideBarToggled, setSideBarToggled] = useState(false);
	const [cartItems, setCartItems] = useState((localStorage.getItem("marketCart")) ? JSON.parse(localStorage.getItem("marketCart")): []);




	const addCartItem = (id) => {
		setCartItems([...cartItems, id]);
		document.querySelector(".mobile-cart-indicator").classList.remove("hide");
		storeCartToStorage([...cartItems, id]);
	}


	const removeCartItem = (id) => {
		const testItem = [...cartItems];
		testItem.pop(id);
		setCartItems([...testItem]);
		if(cartItems.length === 1) document.querySelector(".mobile-cart-indicator").classList.add("hide")
		storeCartToStorage([...testItem]);
	}


	const storeCartToStorage = (cartItems) => {
		localStorage.setItem("marketCart", JSON.stringify(cartItems))
	}


	useEffect(() => {
		if(cartItems.length > 0) document.querySelector(".mobile-cart-indicator").classList.remove("hide")

	}, [cartItems.length])



    return (
    	<div>
	        <Title text = "Order food online. Get fresh food from KAITIND RESTAURANT" />
	        <Header cartItems = {cartItems} toggleSideBar = {(isToggled) => setSideBarToggled(isToggled)}  isOpen = {sideBarToggled}/>
	        <Carousel />
	        <DiscountBanner />
	        <div className = "wrapper">
		        <SideNav isOpen = {sideBarToggled} toggleSideBar = {(isToggled) => setSideBarToggled(isToggled)}/>
		        <MarketArea cartItems = {cartItems} addCartItem = {addCartItem} removeCartItem = {removeCartItem}/>
	        </div>
	        <a href = "/cart">
		        <div className = "hide mobile-cart-indicator">
		        	<strong>{cartItems.length} {(cartItems.length > 1)?"items":"item"}</strong> in Cart <br />
		        	<small>VIEW CART</small>
		        </div>
	        </a>
	    	<Footer />
	        <DeliveredToModal />
        </div>
    );
}

export default Home; //Home contents