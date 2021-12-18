//Dependencies
import {useEffect, useState} from "react";
import isAuthenticated from "./../../utilities/isAuthenticated"
import AdminLoginForm from "./../../subComponents/adminLoginForm"


export default function AdminLogin() {

	const [auth, setIsAuthenticated] = useState(false)

	useEffect(() => {
		async function fetchData () {

			//check if the admin is logged in 
			try{
				const isAuth = await isAuthenticated("admin");
				if(isAuth) window.location = "/admin/manage"; 
				setIsAuthenticated(isAuth);
			}catch{
				setIsAuthenticated(false)
			}

		}

		fetchData();

	}, [])



	useEffect(() => {

	}, [auth])


	if(auth) return (<div></div>)
	else{

		return (
			
			<div>
				<AdminLoginForm />
			</div>
			
		)

	}

}