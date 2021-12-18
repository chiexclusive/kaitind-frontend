//Dependencies
import {useEffect, useState} from "react";
import isAuthenticated from "./../../utilities/isAuthenticated";
import ManageProductArea from "./../../subComponents/ManageProductArea"
import AdminNavigation from "./../../subComponents/AdminNavigation";
import ManageSlideShowArea from "./../../subComponents/ManageSlideShowArea";
import ManageOrderArea from "./../../subComponents/ManageOrderArea";
import ManageDiscountsArea from "./../../subComponents/ManageDiscountsArea";
import AdminHeader from "./../../subComponents/AdminHeader"


export default function ManageWebsite() {

	const [auth, setIsAuthenticated] = useState(false)
	const pageResource = window.location.pathname.split("/admin/")[1];


	useEffect(() => {

		async function fetchData () {

			//check if the admin is logged in 
			try{
				const isAuth = await isAuthenticated("admin");
				if(isAuth === false) window.location = "/admin/login";
				setIsAuthenticated(isAuth);
			}catch{
				setIsAuthenticated(false)
			}
		}


		fetchData();

	}, [auth])



	if(auth === false) return (<div></div>);

	else{
		switch(pageResource){
			case "manage": 
				return (
					<div className = "w-100 manage-website" >
						<AdminNavigation select = {pageResource}/>
						<section className = "d-inline-block">
							<AdminHeader/>
							<ManageProductArea />
						</section>
					</div>
				)
			case "orders": 
				return (
					<div className = "w-100 manage-website" >
						<AdminNavigation select = {pageResource}/>
						<section className = "d-inline-block">
							<AdminHeader/>
							<ManageOrderArea/>
						</section>
					</div>
				)
			case "slideshow":
				return (
					<div className = "w-100 manage-website" >
						<AdminNavigation select = {pageResource}/>
						<section className = "d-inline-block">
							<AdminHeader/>
							<ManageSlideShowArea />
						</section>
					</div>
				)
			case "discounts":
				return (
					<div className = "w-100 manage-website" >
						<AdminNavigation select = {pageResource}/>
						<section className = "d-inline-block">
							<AdminHeader/>
							<ManageDiscountsArea />
						</section>
					</div>
				)
			default: 
				return <div></div>
		}
	}


	

}