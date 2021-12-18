
//utilities
import {useEffect, useState} from "react";


function MarketArea (props) {

	//Expose this location to fetch image
	window.imageLocation = window.BASE_URL+"/storage/images/products/";



	//States
	const [products, setProducts] = useState(JSON.stringify([]))
	const [categories, setCategories] = useState(JSON.stringify([]));
	const [categoryCaption, setCategoryCaption] = useState(JSON.stringify({}));






	//Variables
	var addSubtractButtons = document.querySelectorAll(".add-subtract-item");




	useEffect(() => {

		//Variables
		var stickySubButtons = document.getElementById("sticky-bar").getElementsByTagName("span");
		stickySubButtons = Array.from(stickySubButtons);
		addSubtractButtons = document.querySelectorAll(".add-subtract-item");




		//**Handle addition of shadow to the bar when body sticks to the top of the screen
		const stickyBar = document.getElementById("market-area").getElementsByClassName("sticky-bar")[0];
		window.onscroll = function(){
			const stickyBarTop = stickyBar.getBoundingClientRect().top;

			if(stickyBarTop <= 46){
				stickyBar.classList.add("shadow");
			}else{
				stickyBar.classList.remove("shadow")
			}
		}




		//Observe every food groups to add a class to the handler and make it visible
		const HTMLCollectionsToObserve = document.getElementsByClassName("market-product-section")

		const options = {

		}

		const intersecting = {
			element: "",
			isIntersecting: false
		}

		const callBack = (entries, observer) => {
			entries.forEach((entry, index) => {
				let dataId = entry.target.getAttribute("id");


				if(entry.isIntersecting && intersecting.isIntersecting === false){
					clearStickyBarSelection();
					setStickyBarSelection(dataId);
					intersecting.element = entry.target;
					intersecting.isIntersecting = true;
				}



				if(!entry.isIntersecting && entry.target === intersecting.element){   
					intersecting.element = "";
					intersecting.isIntersecting = false;
					stopObservation(observer);
					startObservation();
				}
			})
		}

		const observer = new IntersectionObserver(callBack, options);
		const startObservation = () => {
			[...HTMLCollectionsToObserve].forEach((foodCategory, index) => {
				observer.observe(foodCategory);
			})
		}


		const stopObservation = (observer) => {
			[...HTMLCollectionsToObserve].forEach((foodCategory, index) => {
				observer.unobserve(foodCategory);
			})
		}

		startObservation();



		//Clear sticky bar section called in the intersection observer
		const clearStickyBarSelection = () => {
			stickySubButtons.map(btn => btn.classList.remove("food-category-selected")); //Remove the class
		}


		//Add the selection class to the right element when triggered bu the observer
		const setStickyBarSelection = (dataId) => {
			stickySubButtons.map((btn) => {
				if(btn.getAttribute("data-id") === dataId){
					btn.classList.add("food-category-selected");
				
					if(window.matchMedia("(max-width: 992px)").matches){
						const scrollableElem = document.querySelector("#sticky-bar").getElementsByClassName("list-group")[0];
						const buttonLeft = btn.getBoundingClientRect().left;
						let scrollRight = scrollableElem.scrollWidth - scrollableElem.scrollLeft;
						scrollRight = (Math.sign(scrollRight) === -1)? (scrollRight * 1) : scrollRight;

						if(Math.sign(buttonLeft) === -1){
							scrollableElem.scrollLeft = scrollableElem.scrollWidth + buttonLeft - scrollRight
						}else{
							scrollableElem.scrollLeft = scrollableElem.scrollWidth - (scrollRight - buttonLeft);
						}
					}
				}
			})
		
		}


		
		


	}, [])





	useEffect(() => {

		//Get data
		const config = {
			method: "GET",
			credentials: "include",
		}
		const url = window.BASE_URL+ "/admin/products";
		fetch(url, config)
		.then(res => res.json())
		.then((res) => {
			if(res.success === true && res.data.length !== 0) setProducts(JSON.stringify(res.data));
			

		})

	}, [])



	useEffect(() => {
		console.log("Products", JSON.parse(products));

		const newProducts = JSON.parse(products)
		const testCategories = [];
		const testCategoryCaption = JSON.parse(categoryCaption);
		newProducts.forEach((item, index) => {
			if(testCategories.indexOf(item.foodGroup) < 0){
				testCategories.push(item.foodGroup);
				testCategoryCaption[item.foodGroup] = (item.foodGroupCaption !== undefined)? item.foodGroupCaption : "";
			}
		})
		setCategoryCaption(JSON.stringify(testCategoryCaption));
		setCategories(JSON.stringify(testCategories));

	}, [products])




	useEffect(() => {
		addSubtractButtons = document.querySelectorAll(".add-subtract-item");
		//Modify button
		if(props.cartItems.length !== 0) {
			setTimeout(function() {
				props.cartItems.forEach((item, index) => {
					modifyButtonsBasedOnCart(props.cartItems, item, true, true);
				})
			});
		}
	})





	//Handle adding items to cart
	const addCartItem = (event, isAdd) => {
		const elem = event.target;
		const id = elem.getAttribute("data-id");
		let newCartItems = props.cartItems;
		
		

		if(isAdd){
			props.addCartItem(id);
			newCartItems = [...newCartItems, id];
		}
		else{
			props.removeCartItem(id);
			newCartItems.pop(id);
		}


		modifyButtonsBasedOnCart(newCartItems, id, isAdd, false);
		
	}



	const modifyButtonsBasedOnCart = (newCartItems, id, isAdd, isReload) => {

		if(isAdd){
			addSubtractButtons.forEach((button) => {
				if(button.getAttribute("data-id") === id){
					button.classList.remove("hide");
					button.previousSibling.classList.add("hide");
				}
			})
		}



		const eachList = [];
		newCartItems.forEach((item, index) => {
			if(id === item){
				eachList.push(item)
			}
		})



		addSubtractButtons.forEach((button) => {
			if(button.getAttribute("data-id") === id){
				if(isReload) button.children[1].textContent = eachList.length;
				else button.children[1].textContent = eachList.length;
			}
		})

		if(!isAdd && eachList.length === 0) addSubtractButtons.forEach((button) => {
			if(button.getAttribute("data-id") === id){
				button.classList.add("hide");
				button.previousSibling.classList.remove("hide");
			}
		})
	}








	const indicateSelected = (event) => {
		const allSpan = document.getElementById("sticky-bar").querySelectorAll("span");
		allSpan.forEach((elem, index) => {
			elem.classList.remove("food-category-selected")
		})
		event.target.classList.add("food-category-selected")
	}





	return (
		<div id = "market-area" className = "mt-3 market-area container-fluid">
			<div>
		        <header className = "d-flex align-items-center">
		        	<h5><strong>CATEGORIES</strong></h5>
		        	<div className = "d-flex">
		        		<span className = "no-border">VEG</span>
		        		<span className = "no-border">
		        			PRICE
		        			<span className = "fa fa-navicon"></span>
		        		</span>
		        		<span>
		        			<span className = "fa fa-filter"></span>
		        			FILTERS
		        		</span>
		        	</div>
		        </header>
	        </div>

	        <section>
	        	<div id = "sticky-bar" className = "sticky-bar line-horizontal">
	        		<ul className = "list-group w-100" >

	        			{
	        				JSON.parse(categories).map((category, categoryIndex) => {
	        					return (
	        						<li key = {category} className = "list-group-item text-truncate">
				        				<a href = {"/#"+category}><span data-id = {category} onClick = {indicateSelected}>{category}</span></a>
				        			</li>
	        					)
	        				})
	        			}

	        		</ul>
	        	</div>





	        	<div className = "market-products">




	        		{


	        			JSON.parse(categories).map((category, categoryIndex) => {
	        				return (
	        					<section key = {category} id = {category} className = "market-product-section">
					        		<div className = "w-100">
					        			<div>
					        				<h2>
						        				<strong>{category}</strong>
						        			</h2>
						        			<p>{JSON.parse(categoryCaption)[category]}</p>
						        			<br/>
						        			<div className = "row">

							        			{
							        				
						        					JSON.parse(products).map((item, index) => {
						        			
		        										if(category === item.foodGroup && item.isOpen === true){


		        											return (

																<div key = {index} className = "products col-xs-6 col-sm-6 col-md-4 col-lg-4 col-xl-3 col-6">
			        												<span className= {item.foodType + " product-header"}>{item.foodType}</span>
											        				<div className = {(item.isBestOffer === true)?"best-offer":"best-offer hide"}>
															            <div className="left-shape"></div>
															            		<span>Best Offers</span>
															            <div className="right-shape"></div>
															        </div>
					        										<div className = "img-container">
					        											<img alt = "" src = {window.imageLocation + item.foodImage} onError = {(event) => event.target.style.display = "none"} onLoad = {(event) => event.target.style.display = "block"} />
					        										</div>
					        										{
					        											item.tags.split(",").map((tag, ) => {
					        												return (
					        													<span key = {tag} style = {{"marginRight": "3px"}} className= "badge badge-dark">{tag}</span>
					        												)
					        											})
					        										}
					        										
												        			<h5 className="mt-3 product-name">
												        				<span className= {item.foodType + " product-header product-header-sm"}></span>
												        				{item.foodName}
												        			</h5>
							           								<div className = "d-flex justify-content-between">
							           									<h4>
							           										{(item.percentageDiscount !== "" && item.percentageDiscount !== 0)? (<small><del className = "text-muted mr-3">{item.amount}</del></small>): (<div></div>)}
								           									<strong>
								           										<span className = "fa fa-rupee"></span>
								           										{(item.percentageDiscount !== "" && item.percentageDiscount !== 0)? (item.amount -((item.percentageDiscount/100) * item.amount)): item.amount}
								           									</strong>
							           									</h4>
           															</div>
           															<div className = "d-block float-right">
						           										<button className = "btn add-product-to-cart" data-id = {item._id} onClick = {(event) => {addCartItem(event, true)}}>ADD</button>
						           										<div data-id = {item._id} className = "hide btn-group add-subtract-item">
						           											<button  data-id = {item._id} className = "btn btn-orange"  onClick = {(event) => {addCartItem(event, true)}}> + </button>
						           											<button className = "btn">1</button>
						           											<button  data-id = {item._id} className = "btn btn-orange"  onClick = {(event) => {addCartItem(event, false)}}> - </button>
						           										</div>
						           										{(item.isCustomizable)? (<div className = "text-center"><h6 className = "text-center"><small>Customizable</small></h6></div>): (<span></span>)}
						           									</div>
					           									</div>
		        											)
		        										}
		        									})
							        				
							        			}
						        			</div>
						        		</div>
						        	</div>
						        </section>
	        				)
	        			})


	        		}


	        	</div>
	        </section>
	    </div>
	)
}

export default MarketArea;