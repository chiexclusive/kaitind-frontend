import {useState} from "react";
import {acceptImage} from "./../../utilities/modalUtils.js"

export default function AdminNewProductModal (props) {


	const [file,] = useState("");
	const [imageSrc, setImageSrc] = useState("");

	//Form data
	const [data, setData] = useState("");
	const [buttonText, setButtonText] = useState("Add Product");



	const [foodGroup, setFoodGroup] = useState("");
	const [foodGroupCaption, setFoodGroupCaption] = useState("");
	const [foodName, setFoodName] = useState("");
	const [foodType, setFoodType] = useState("");
	const [calories, setCalories] = useState("");
	const [amount, setAmount] = useState("");
	const [percentageDiscount, setPercentageDiscount] = useState("");
	const [isCustomizable, setIsCustomizable] = useState(false);
	const [isBestOffer, setIsBestOffer] = useState(false);
	const [tags, setTags] = useState("");



	//Actions for the state
	const actions = {
		foodGroup: setFoodGroup,
		foodGroupCaption: setFoodGroupCaption,
		foodName: setFoodName,
		foodType: setFoodType,
		calories: setCalories,
		amount: setAmount,
		percentageDiscount: setPercentageDiscount,
		tags: setTags,
		isCustomizable: setIsCustomizable,
		isBestOffer: setIsBestOffer
	}



	const getData = (event) => {
		actions[event.target.name](event.target.value);
		setData({
			foodGroup,
			foodGroupCaption,
			foodName,
			foodType,
			calories,
			amount,
			percentageDiscount,
			tags,
			isOpen: true,
			isCustomizable,
			isBestOffer
		});

	}




	//Handle add product
	const addProduct = () => {
		toggleButtonProcessingState(true);
		clearAlert();
		const validation = validateField();
		if(!validation.isComplete) {logAlert(validation.errorMessage, false); toggleButtonProcessingState(false)}
		else{
			
			//Send request
			const formData = new FormData();
			formData.append("productImage", file); //Add image to form data
			for(var field in  data) formData.append(field, data[field]);
			formData.append("file", file)
			const config = {
				method: "POST",
				credentials: "include",
				body: formData
			}
			const url = window.BASE_URL+ "/admin/products";
			fetch(url, config)
			.then(res => res.json())
			.then((res) => {
				if(res.success === true){
					logAlert("Product created", res.success);
					props.updateProducts(res.message);
					clearForm();
					setTimeout(() => {
					 clearAlert();
					}, 4000)
				}else{
					logAlert(res.message, res.success);
				}
				toggleButtonProcessingState(false);
			})
			.catch(() => {
				toggleButtonProcessingState(false);
			})
			
		}
	}





	const logAlert = (mesg, isSuccess) => {

		//Add alert box
		document.querySelector(".logFromCreateNewProduct").innerHTML = `
			<div class = "${(isSuccess === true)?"alert-success":"alert-danger"} alert alert-dismissible">
				<strong>${(isSuccess === true)?"Success!":"Error!"}</strong> 
				<span>${mesg}</span>
				<span class = "close" data-dismiss = "alert">&times;</span>
			</div>
		`
	}




	const clearAlert = () => {
		document.querySelector(".logFromCreateNewProduct").innerHTML = "";
	}




	const clearForm = () => {
		for(var action in actions){
			if(action !== "isCustomizable" && action !== "isBestOffer")
			actions[action]("");
		}
		setImageSrc("");
		setData("")
	}



	const validateField = () => {
		const notRequired = ["tags", "percentageDiscount", "calories", "isOpen"]
		if(Object.keys(data).length === 0) return {isComplete: false, errorMessage: "Some fields are empty"}
		for(var field in  data){
			if(data[field].toString().trim() === "" || (notRequired.find(entry => entry === field)) === undefined || (notRequired.find(entry => entry === field)) === null) return {isComplete: false, errorMessage: `${field} cannot be left empty`}
		}

		if(file === "") return {isComplete: false, errorMessage: "Product requires an image"}


		return {isComplete: true}
	}







	const toggleButtonProcessingState = (isProcessing) => {
		const button = document.getElementById("submitProductButton");
		if(isProcessing){
			setButtonText("Adding...")
			button.setAttribute("disabled", true)
		}else{
			setButtonText("Add Product")
			button.removeAttribute("disabled");
		}

	}





	const handleImage = (event, setSrc, setFile) => {
		acceptImage(event, setSrc, setFile)

	}




	return (
		<div className = "modal" id = "new-product-modal">
				<div className = "modal-dialog">
					<div className = "modal-content">
						<div className = "modal-header">
							<strong>New Product</strong>
							<span className = "close" data-dismiss = "modal">&times;</span>
						</div>
						<div className = "text-left modal-body">
							<div className = "m-3">
								<div className = "add-product-image-container">
								<img alt = "" src = {imageSrc} onLoad = {(event) => {event.target.style.display = "block"}} onError = {(event) => {event.target.style.display = "none"}}/>
									<label className = "fa fa-camera" htmlFor = "add-product-image">
										<input id = "add-product-image" className = "hidden" type = "file" accept = "image/jpg image/jpeg image/png image/gif" onChange = {handleImage} />
									</label>	
								</div>
								<div className = "form-group">
									<label htmlFor = "category">Group:</label>
									<input type = "text" list = "category-data" className = "form-control" name = "foodGroup" onChange = {getData} value = {foodGroup}/>
									<datalist id = "category-data">
										<option value = "First category" />
									</datalist>
								</div>
								<div className = "form-group">
									<label htmlFor = "categoryCaption">Group Caption:</label>
									<input type = "text" list = "category-caption-data" className = "form-control" name = "foodGroupCaption" onChange = {getData} value = {foodGroupCaption}/>
									<datalist id = "category-caption-data">
										<option value = "First Caption" />
									</datalist>
								</div>
								<div className = "form-group">
									<label htmlFor =  "category">Product Name:</label>
									<input type = "text" list = "category-data" className = "form-control" name = "foodName" onChange = {getData} value = {foodName}/>
									<datalist id = "category-data">
										<option value = "First Name" />
									</datalist>
								</div>

								<div className = "form-group">
									<label htmlFor = "category">Type:</label>
									<select type = "text" className = "form-control" name = "foodType" onChange = {getData} defaultValue = {foodType}>
										<option value = "Fat" >None</option>
										<option value = "Vegetable">Vegetable</option>
										<option value = "Fat" >Fat</option>
										<option value = "Both">Both</option>
									</select>
								</div>

								<div className = "form-group">
									<label htmlFor =  "category">Calories:</label>
									<input type = "number"  className = "form-control" name = "calories" onChange = {getData} value = {calories}/>
								</div>
								<div className = "form-group">
									<label htmlFor =  "category">Amount:</label>
									<input type = "number" className = "form-control" name = "amount" onChange = {getData} value = {amount}/>
								</div>
								<div className = "form-group">
									<label htmlFor =  "category">Discount:</label>
									<input type = "number" className = "form-control" name = "percentageDiscount" onChange = {getData} value = {percentageDiscount}/>
								</div>
								<div className = "form-group">
									<label htmlFor =  "category">Tags:</label>
									<input type = "text" className = "form-control" name = "tags" onChange = {getData} value = {tags}/>
									<small>Tags should be delimited with ","</small>
								</div>

								<div className = "form-group">
									<label htmlFor = "category">Customizable</label>
									<select type = "text" className = "form-control" name = "isCustomizable" onChange = {getData} defaultValue = {isCustomizable}>
										<option value = {true}  >Yes</option>
										<option value = {false} >No</option>
									</select>
								</div>


								<div className = "form-group">
									<label htmlFor = "category">Best Offer:</label>
									<select type = "text" className = "form-control" name = "isBestOffer" onChange = {getData} defaultValue = {isBestOffer}>
										<option value = {true}  >Yes</option>
										<option value = {false} >No</option>
									</select>
								</div>



							</div>
							<div className = "logFromCreateNewProduct">
								
							</div>
						</div>
						<div className = "modal-footer">
							<button id = "submitProductButton" className = "btn btn-primary" onClick = {addProduct}><span className = "fa fa-plus"></span> <span className = "button-text">{buttonText}</span></button>
							<button  className = "btn btn-danger" data-dismiss = "modal">Done</button>
						</div>
					</div>
				</div>
			</div>
	)
}

