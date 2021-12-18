import {useState } from "react";

export default function  AdminHeader (props) {


	const [isToggled, setIsToggled] = useState(false)

	const signOutAdmin = () => {
		const config = {
			method: "DELETE",
			credentials: "include",
		}
		const url = window.BASE_URL+ "/admin/logout";
		fetch(url, config)
		.then(res => res.json())
		.then((res) => {
			if(res.success){
				window.location = "/admin/login"
			}else{
				window.location = "/admin/login"
			}
		})
	}




	const toggleAdminSideNav = () => {
		const sideBar = document.querySelector(".admin-side-nav");

		if(isToggled === false){
			sideBar.classList.remove("admin-side-nav-hide")
			setIsToggled(true)
		}else {
			sideBar.classList.add("admin-side-nav-hide")
			setIsToggled(false)
		}
	}



	return (
		<div className = "d-flex justify-content-between pr-3 pl-3" >
			<div className = "d-flex align-items: center"><span>Admin Portal</span></div>
			<div className = "btn-group">
				<div className = "dropdown">
					<span className = "fa fa-user"></span>
					<span className = "dropdown-toggle" data-toggle = "dropdown"></span>
					<div className = "dropdown-content">
						<div className = "dropdown-menu">
							<div style = {{"cursor": "pointer"}} className = "dropdown-item" onClick = {signOutAdmin}><span className = "fa fa-sign-out"></span>Log Out</div>
						</div>
					</div>
				</div>
				<div className = "admin-nav-toggler align-items-center"><span className = "pl-3 fa fa-align-right" onClick = {toggleAdminSideNav}></span></div>
			</div>
		</div>
	)
}