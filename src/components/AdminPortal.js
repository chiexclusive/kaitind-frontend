/**
*
* //////////////////////
* Admin Portal component
* //////////////////////
*
*/

//Dependencies
import {useState, useEffect} from "react";
import AdminLogin from "./AdminLogin";
import AdminTemplate from "./AdminTemplate"

function AdminPortal () {
	//Logged in state of the admin
	const [loggedIn, setLoggedIn] = useState(false);
	//Confirm user logged in status from server
	useEffect(() => {
		fetch(`${window.BASE_URL}/admin/isLoggedin`)
		.then((response) => response.json())
		.then((response) => {
			if(response.success === true) setLoggedIn(true);
			else setLoggedIn(false);
		});
	}, []);


	if(loggedIn) return <AdminTemplate/>
	return <AdminLogin/>
}





export default AdminPortal