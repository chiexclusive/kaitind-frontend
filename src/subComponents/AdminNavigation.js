
import {useEffect } from "react";

export default function AdminNavigation (props) {


	useEffect(() => {
		document.querySelector(".nav-"+props.select).classList.add("admin-nav-selected")
	}, [props.select])

	return (
		<section className = "admin-side-nav-hide admin-side-nav list-none container d-inline-block">
			<ul>
				<a href = "/admin/manage"><li className = "nav-manage">Products</li></a>
				<a href = "/admin/orders"><li className = "nav-orders">Orders</li></a>
				<a href = "/admin/slideshow"><li className = "nav-slideshow">Slide Show</li></a>
				<a href = "/admin/discounts"><li className = "nav-discounts">Discounts</li></a>
			</ul>
		</section>
	)
}