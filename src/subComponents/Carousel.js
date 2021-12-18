import {useState,} from "react"


export default function  Carousel () {

	const [images, setImages] = useState(JSON.stringify([]));

	const fetchImages = () => {
		const config = {
			method: "GET",
			credentials: "include",
		}
		const url = window.BASE_URL+ "/users/slideshow";
		fetch(url, config)
		.then(res => res.json())
		.then((res) => {
			if(res.success) setImages(JSON.stringify(res.data))
		})
		.catch(() => {
			})
	}

	fetchImages();



	return (
		<div className="bd-example">
			<div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
			  <ol className="carousel-indicators">
			  	{
				  	JSON.parse(images).map((item, index) => {
				  		return (
				  			<li key = {index} data-target="#carouselExampleIndicators" data-slide-to={index} className={index == 0? "active": ""}></li>
				  		)
				  	})
				  }
			    
			  </ol>
			  <div className="carousel-inner">
				  {
				  	JSON.parse(images).map((item, index) => {
				  		return (
				  			<div key = {index} className={index == 0? "active carousel-item": "carousel-item"}>
						      <img className="d-block w-100" src = {window.BASE_URL + item.src} data-holder-rendered="true" />
						    </div>
				  		)
				  	})
				  }
			  </div>
			  <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
			    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
			    <span className="sr-only">Previous</span>
			  </a>
			  <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
			    <span className="carousel-control-next-icon" aria-hidden="true"></span>
			    <span className="sr-only">Next</span>
			  </a>
			</div>
		</div>
	);
}