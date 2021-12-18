//Components
import Title from "./../../subComponents/Title";
import Header from "./../../subComponents/Header";
import {DeliveredToModal} from "./../../subComponents/Modals"
import SideNav from "./../../subComponents/SideNav";
import Footer from "./../../subComponents/Footer";
import ContactForm from "./../../subComponents/ContactForm";
import Carousel from "./../../subComponents/Carousel";


//Utilities
import {useState} from "react";


function Contacts () {


	const [sideBarToggled, setSideBarToggled] = useState(false);


    return (
    	<div>
	        <Title text = "CONTACT US | KAITIND RESTAURANT" />
	        <Header toggleSideBar = {(isToggled) => setSideBarToggled(isToggled)}  isOpen = {sideBarToggled}/>
	        <Carousel />
	        <div className = "wrapper">
		        <SideNav isOpen = {sideBarToggled} toggleSideBar = {(isToggled) => setSideBarToggled(isToggled)}/>
		        <ContactForm />

	        </div>
	    	<Footer />
	        <DeliveredToModal />
        </div>
    );
}

export default Contacts; //Contacts Contents