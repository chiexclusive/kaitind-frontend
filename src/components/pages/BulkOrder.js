//Components
import Title from "./../../subComponents/Title";
import Header from "./../../subComponents/Header";
import {DeliveredToModal} from "./../../subComponents/Modals"
import SideNav from "./../../subComponents/SideNav";
import Footer from "./../../subComponents/Footer";
import BulkOrderForm from "./../../subComponents/BulkOrderForm";
import Carousel from "./../../subComponents/Carousel";


//Utilities
import {useState} from "react";


function BulkOrder () {


	const [sideBarToggled, setSideBarToggled] = useState(false);

    return (
    	<div>
	        <Title text = "KAITIND RESTAURANT | MAKE A BULK ORDER" />
	        <Header toggleSideBar = {(isToggled) => setSideBarToggled(isToggled)}  isOpen = {sideBarToggled}/>
	        <Carousel />
	        <div className = "wrapper">
		        <SideNav isOpen = {sideBarToggled} toggleSideBar = {(isToggled) => setSideBarToggled(isToggled)}/>
		        <BulkOrderForm />

	        </div>
	    	<Footer />
	        <DeliveredToModal />
        </div>
    );
}

export default BulkOrder; //BulkOrder Contents