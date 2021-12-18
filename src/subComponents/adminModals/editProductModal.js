import {useState, useEffect} from "react";
import {acceptImage} from "./../../utilities/modalUtils.js"



export default function AdminEditProductModal (props) {



	const [file, setFile] = useState("");
	const [imageEditSrc, setImageEditSrc] = useState("");


	//Form data
	const [data, setData] = useState({});
	const [buttonText, setButtonText] = useState("Save Changes");


	const [foodGroup, setFoodGroup] = useState("");
	const [foodName, setFoodName] = useState("");
	const [foodType, setFoodType] = useState("");
	const [calories, setCalories] = useState("");
	const [amount, setAmount] = useState("");
	const [percentageDiscount, setPercentageDiscount] = useState("");
	const [tags, setTags] = useState("");
	const [isOpen, setIsOpen] = useState("");




	useEffect(() => {
		const toEdit = JSON.parse(props.toEdit)
		setFoodGroup(toEdit.foodGroup)
		setFoodName(toEdit.foodName);
		setFoodType(toEdit.foodType);
		setCalories(toEdit.calories);
		setAmount(toEdit.amount);
		setPercentageDiscount(toEdit.percentageDiscount);
		setTags(toEdit.tags);
		setIsOpen(toEdit.isOpen);
		setImageEditSrc(window.BASE_URL+"/storage/images/products/"+toEdit.foodImage);
		setData({})
	}, [props.toEdit])




	//Actions for the state
	const actions = {
		foodGroup: setFoodGroup,
		foodName: setFoodName,
		foodType: setFoodType,
		calories: setCalories,
		amount: setAmount,
		percentageDiscount: setPercentageDiscount,
		tags: setTags,
		isOpen: setIsOpen
	}




	const getData = (event) => {
		actions[event.target.name](event.target.value);
		const toSetData = data;
		toSetData[event.target.name] = event.target.value
		setData(toSetData);
	}




	const editProduct = () => {

		if(changes().hasChanged){
			toggleButtonProcessingState(true);
			const formData = new FormData();
			if(file !== "") formData.append("productImage", file)
			if(Object.keys(data) !== 0){
				for(let field in data) formData.append(field, data[field]);
			}
			const config = {
				method: "PUT",
				credentials: "include",
				body: formData
			}
			const id = JSON.parse(props.toEdit)._id
			const url = window.BASE_URL+ "/admin/products?id="+ id;
			fetch(url, config)
			.then(res => res.json())
			.then((res) => {
				if(res.success === true){
					logAlert("Saved Successfully", res.success);
					props.updateSpecificProduct(res.message, id);
					setTimeout(() => {
						 clearAlert();
					}, 4000)
					document.querySelector("#done").click();
				}else{
					if("redirect" in res) window.location = res.redirect;
					else logAlert(res.message, res.success);
				}
				toggleButtonProcessingState(false);
			})
			.catch(() => {

				toggleButtonProcessingState(false);
			})


		}else logAlert("No changes was made", false)
	}





	const changes = () => {
		let toEdit = {}

		for(var field in data){
			if(data[field] !== JSON.parse(props.toEdit)[field]) toEdit[field] = data[field];
		}

		if(Object.keys(data).length === 0 && file === "") return {hasChanged: false};


		
		//Continue
		return {hasChanged: true}
	}





	const logAlert = (mesg, isSuccess) => {

		//Add alert box
		document.querySelector(".logFromEditNewProduct").innerHTML = `
			<div class = "${(isSuccess === true)?"alert-success":"alert-danger"} alert alert-dismissible">
				<strong>${(isSuccess === true)?"Success!":"Error!"}</strong> 
				<span>${mesg}</span>
				<span class = "close" data-dismiss = "alert">&times;</span>
			</div>
		`
	}





	const toggleButtonProcessingState = (isProcessing) => {
		const button = document.getElementById("editProductButton");
		if(isProcessing){
			setButtonText("Saving...")
			button.setAttribute("disabled", true)
		}else{
			setButtonText("Save Changes")
			button.removeAttribute("disabled");
		}

	}





	const clearAlert = () => {
		document.querySelector(".logFromEditNewProduct").innerHTML = "";
	}



	const reinstateFormUtils = (event) => {
		if(event.target === document.querySelector("#edit-product-modal") 
			|| event.target === document.querySelector("#done")
			|| event.target === document.querySelector("#cloae-edit-modal")){
			setImageEditSrc("")
			clearAlert();
			setFile("");
		}
	}



	return (
		<div className = "modal" id = "edit-product-modal" onClick = {reinstateFormUtils}>
				<div className = "modal-dialog">
					<div className = "modal-content">
						<div className = "modal-header">
							<strong>Edit Product</strong>
							<span id = "close-edit-modal" className = "close" data-dismiss = "modal" onClick = {reinstateFormUtils}>&times;</span>
						</div>
						<div className = "text-left modal-body">
							<div className = "m-3">
								<div className = "add-product-image-container">
								<img alt = "" id = "edit-image-preview" src = {imageEditSrc} onLoad = {(event) => {event.target.style.display = "block"}} onError = {(event) => {event.target.style.display = "none"}}/>
									<label className = "fa fa-camera" htmlFor = "add-product-image">
										<input id = "add-product-image" className = "hidden" type = "file" accept = "image/jpg image/jpeg image/png image/gif" onChange = {(event) => {acceptImage(event, setImageEditSrc, setFile)}}/>
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
									<label htmlFor =  "category">Product Name:</label>
									<input type = "text" list = "category-data" className = "form-control" name = "foodName" onChange = {getData} value = {foodName}/>
									<datalist id = "category-data">
										<option value = "First Name" />
									</datalist>
								</div>
								<div className = "form-group">
									<label htmlFor =  "category">Type: </label>
									<input type = "text" list = "category-data" className = "form-control" name = "foodType" onChange = {getData} value = {foodType}/>
									<datalist id = "category-data">
										<option value = "First category" />
									</datalist>
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
									<label htmlFor = "category">Is Open:</label>
									<select type = "text" list = "category-data" className = "form-control" name = "isOpen" onChange = {getData} defaultValue = {isOpen}>
										<option value = {true}  >Yes</option>
										<option value = {false} >No</option>
									</select>
							
								</div>

							</div>
							<div className = "logFromEditNewProduct">
								
							</div>
						</div>
						<div className = "modal-footer">
							<button id = "editProductButton" className = "btn btn-primary" onClick = {editProduct}> <span className = "button-text">{buttonText}</span></button>
							<button id = "done" className = "btn btn-danger" data-dismiss = "modal" onClick = {reinstateFormUtils}>Done</button>
						</div>
					</div>
				</div>
			</div>
	)
}