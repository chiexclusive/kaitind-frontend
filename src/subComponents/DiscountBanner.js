
import {useEffect, useState} from "react"




function DiscountBanner () {

	const [discount, setDiscount] = useState(JSON.stringify({}))


	useEffect(() => {
		const url = window.BASE_URL + "/products/discount";
		const config = {
			credentials: "include",
			method: "GET",
		}
		fetch(url, config)
		.then(res => res.json())
		.then(res => {
			if(res.success){
				if(hasNotExpired(res.data.dateCreated, res.data.expires))
					setDiscount(JSON.stringify(res.data))
			}
		})
		.catch(()  => {

		})
	}, [])



	const hasNotExpired = (date, expires) => {
		const created = new Date(date)
		const now = new Date()

		const diff = (Date.parse(now) - Date.parse(created))/1000;

		const left = (diff + expires) / 3600

		if(Math.sign(left) === -1) return false;
		else return true;
	}



	if(Object.keys(JSON.parse(discount)).length > 0){
		return (
			<div className = "d-flex justify-content-center bg-web-color text-white"><strong>Use code {JSON.parse(discount).coupon} and Get {JSON.parse(discount).discount}% Off</strong></div>
		)
	}else{
		return <div></div>
	}
	
}

export default DiscountBanner