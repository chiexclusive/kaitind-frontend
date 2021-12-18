//Components
import Title from "./../../subComponents/Title";
import Header from "./../../subComponents/Header";
import {DeliveredToModal} from "./../../subComponents/Modals"
import SideNav from "./../../subComponents/SideNav";
import Footer from "./../../subComponents/Footer";


//Utilities
import {useState, useEffect} from "react";


function Contacts () {

	useEffect(() => {

	}, [])

	const [sideBarToggled, setSideBarToggled] = useState(false);

    return (
    	<div>
	        <Title text = "ABOUT KAITIND RESTAURANT" />
	        <Header toggleSideBar = {(isToggled) => setSideBarToggled(isToggled)}  isOpen = {sideBarToggled}/>
	        <div style = {{"minHeight": "100vh"}} className = "wrapper">
		        <SideNav isOpen = {sideBarToggled} toggleSideBar = {(isToggled) => setSideBarToggled(isToggled)}/>
		        <div className = "p-3">
		        	<h5><strong>About Us</strong></h5>
		        </div>
	        </div>
	    	<Footer />
	        <DeliveredToModal />
        </div>
    );
}

export default Contacts; //Contacts Contents