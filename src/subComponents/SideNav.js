//Utilities
import {useEffect, useState} from "react";
import isAuthenticated from "./../utilities/isAuthenticated"


export default function SideNav (props) {


    const [userData, setUserData] = useState(JSON.stringify({}))


	//Handle close of side bar using &times;
	const handleClose =  (e) => {
		props.toggleSideBar(false)
	}

    //Auhentication state
    const [auth, setAuth] = useState(false)



    useEffect(() => {
        const name = window.location.pathname.split("/")[1]
        const listGroupItems = [...document.getElementById("sidebar").getElementsByClassName("list-group-item")];
        listGroupItems.forEach(listGroupItem => {
            listGroupItem.classList.remove("active");
            if(listGroupItem.getAttribute("data-page") === name) listGroupItem.classList.add("active")
        })

    }, [auth])



    //Fetch user data
    useEffect(() => {
        const url = window.BASE_URL + "/users/get-user";
        const config = {
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
        fetch(url, config)
        .then(res => res.json())
        .then(res => {
            if(res.success){
                setUserData(JSON.stringify(res.data))
            }
        })
        .catch(() => {})
    }, [])



    useEffect(() => {
        async function fetchData () {

            //check if the admin is logged in 
            try{
                const isAuth = await isAuthenticated("users");
                setAuth(isAuth);
            }catch{
                setAuth(false)
            }

        }

        fetchData();
    })



    const logOut = () => {
        const url = window.BASE_URL + "/users/logout";
        const config = {
            credentials: "include",
            method: "put",
            headers: {
                "Content-Type": "application/json"
            }
        }
        fetch(url, config)
        .then(res => res.json())
        .then(res => {
            window.location.reload();
        })
        .catch(() => {})
    }


	return (
		    <nav id="sidebar" className = {(props.isOpen === true)? "active":""}>
                <div className="sidebar-header m-3">
                    <span className = "close mr-3" onClick = {(e) => handleClose(e)}>&times;</span>
                </div>
                {
                    (auth === true) ?
                        (<div style = {{"padding": "20px"}} className = "dropdown">
                            <h4>Welcome!</h4>
                            <span className = "fa fa-user"></span><span>{JSON.parse(userData).FirstName}</span>
                            <span style = {{"marginLeft": "10px"}} className = "dropdown-toggle" data-toggle = "dropdown"></span>
                            <div className = "dropdown-content">
                                <div className = "dropdown-menu">
                                    <div style = {{"cursor": "pointer"}} className = "dropdown-item" onClick = {logOut}><span className = "fa fa-sign-out"></span>Log Out</div>
                                </div>
                            </div>
                        </div>) : (<div></div>)
                }
                
                <ul className = "mt-3 w-100 text-left list-group">
                    { 
                        (auth === false) ?
                                            (<section className = "p-3 login-section">
                                                <p className = "text-muted"><small>You are not logged in. <span className = "badge badge-dark"><span className = "fa fa-user"></span></span><br/> You are seen as a guest user.</small></p>
                                                <a href = "/login">
                                                    <button className = "login-button btn auth-inverse-orange">
                                                        <span className = "fa fa-key mr-3"> </span>
                                                        <span>Login</span>
                                                    </button>
                                                </a>


                                                <a href = "/register">
                                                    <button className = "register-button btn auth-inverse-orange">
                                                        <span className = "fa fa-address-card mr-3"> </span>
                                                        <span>Register</span>
                                                    </button>
                                                </a>


                                            </section>
                                            ) 
                                            : 
                                            (<div></div>)
                    }
                	<a href = "/#market-area" onClick = {(e) => handleClose(e)}><li data-page = "" className = "list-group-item active">Today's Menu</li></a>
                    <a href = "/bulkorder" onClick = {(e) => handleClose(e)}><li data-page = "bulkorder"className = "list-group-item">Bulk Order</li></a>
                    {(auth === true) ? (<a href = "/billing-address" onClick = {(e) => handleClose(e)}><li data-page = "billing-address"className = "list-group-item">Billing Address</li></a>): (<div></div>)}
                    {(auth === true) ? (<a href = "/my-orders" onClick = {(e) => handleClose(e)}><li data-page = "my-orders" className = "list-group-item">My Orders</li></a>): (<div></div>)}
                    <a href = "/contacts" onClick = {(e) => handleClose(e)}><li data-page = "contacts" className = "list-group-item">Contact Us</li></a>
                    <a href = "/about" onClick = {(e) => handleClose(e)}><li data-page = "about" className = "list-group-item">About Us</li></a>
                </ul>
                
            </nav>

	);
}