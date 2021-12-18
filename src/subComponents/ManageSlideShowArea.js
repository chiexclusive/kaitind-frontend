
import {useState, useEffect} from "react";

export default function ManageSlideShowArea () {

	const [images, setImages] = useState(JSON.stringify([]));

	const [imagesToSend, setImagesToSend] = useState([]);

	const [processing, setProcessing] = useState(false);


	const getImages = (event) => {

		let files = [];
		
		for(var file in event.target.files){
			if(file !== "length" && file !== "item") files.push(event.target.files[file])
		}

		setImagesToSend(files);
	}


	useEffect(() => {
		const elem = document.querySelector(".add-image-button")
		if(processing) elem.setAttribute("disabled", true);
		else elem.removeAttribute("disabled")
	}, [processing]);



	useEffect(() => {
		const config = {
			method: "GET",
			credentials: "include",
		}
		const url = window.BASE_URL+ "/admin/slideshow";
		fetch(url, config)
		.then(res => res.json())
		.then((res) => {

			if(res.success === true){
				setImages(JSON.stringify([...res.data]));
			}
		})
		.catch(() => {
			})
	}, [])


	const addImages  = () => {
		logAlert(false);
		if(imagesToSend.length < 0) return (logAlert("No image selected", false));

		setProcessing(true)

		//Send request
		const formData = new FormData();

		imagesToSend.forEach((item, index) => {
			formData.append("image "+ (parseInt(index) + 1), item); //Add image to form data
		})
		

		const config = {
			method: "POST",
			credentials: "include",
			body: formData
		}
		const url = window.BASE_URL+ "/admin/slideshow";
		fetch(url, config)
		.then(res => res.json())
		.then((res) => {
			if(res.success === true){
				res.data.forEach((item, index) => {
					let elem = document.querySelector(".slide-images-parent");
					let html = `
						<div style = "padding: 10px" class = "col-xs-12 col-sm-6 col-xl-4" >
							<div style = "background: #d5d6d7; padding-bottom:60%; position:relative; overflow: hidden; border-radius:20px" class = "admin-slideshow-image-container w-100" >
								<img style = "left: 0px" src = ${window.BASE_URL + item.src} onload = "this.style.display = 'block'" onerror = "(event) => this.style.display = 'none'"/>
								<div class = "each-image-control row"> 
								    <span style = "font-weight:bolder" class = "text-dark d-flex justify-content-between">Name: ${item.name}</span>
									<button data-id = ${item._id} class = "btn btn-danger" onclick = "deleteImage">Delete</button>
								</div>
							</div>
						</div>
					`

					html = document.createRange().createContextualFragment(html);
					if(elem.childNodes[0]) elem.insertBefore(html, elem.childNodes[0])
					else elem.appendChild(html)


				})
				let message = (imagesToSend.length === 1)? "1 Image Added Successfully.": images.imagesToSend.length+ " Images Added Successfully."
				logAlert(message, res.success);
				setTimeout(() => {
					logAlert(false);
				}, 4000)
			}else{
				logAlert(res.message, res.success);
			}
			setProcessing(false);
		})
		.catch(() => {
			setProcessing(false);
		})
	}





	const deleteImage  = (event) => {

		const id = event.target.getAttribute("data-id")


		
		const config = {
			method: "DELETE",
			credentials: "include",
		}
		const url = window.BASE_URL+ "/admin/slideshow?id="+id;
		fetch(url, config)
		.then(res => res.json())
		.then((res) => {
			event.target.parentElement.parentElement.parentElement.remove();
		})
		.catch(() => {

		})
	}






	const logAlert = (...args) => {
		const elem = document.querySelector(".add-images-log");
		if(args[0] === false) elem.innerHTML = ""
		else{
			const isSuccess = args[1]
			const mesg = args[0]
			//Add alert box
			elem.innerHTML = `
				<div class = "${(isSuccess === true)?"alert-success":"alert-danger"} alert alert-dismissible">
					<strong>${(isSuccess === true)?"Success!":"Error!"}</strong> 
					<span>${mesg}</span>
					<span class = "close" data-dismiss = "alert">&times;</span>
				</div>
			`
		}
	}



	return (
		<div className = "container ManageDiscountsArea">
			<div className  = "breadcrumb">
				<span className = "breadcrumb-item"><a href = "/"><span className = "fa fa-home"></span>Home</a></span>
				<span className = "breadcrumb-item">Manage Slide Show</span>
			</div>
					
			<div className = "row" >
				<input type = "file" className = "form-control" accept = "image/jpg, image/jpeg, image/png" multiple = "multiple" onChange = {getImages}/>
				<button className = "btn btn-primary m-3 add-image-button" onClick = {addImages}>{processing === true ? "Adding...": "Add Image"}</button>
			</div>
			<div className = "add-images-log"></div>
			<hr />
			<div className = "row slide-images-parent" style = {{"padding": "10px"}}>
				

				{
					JSON.parse(images).map((item, index) => {
						return (
							<div style = {{"padding": "10px"}} className = "col-xs-12 col-sm-6 col-xl-4" >
								<div style = {{"background": "#d5d6d7", "paddingBottom": "60%", "position": "relative", "overflow": "hidden", "borderRadius": "20px"}} className = "admin-slideshow-image-container w-100" >
									<img src = {window.BASE_URL + item.src} onLoad = {(event) => {event.target.style.display = "block"}} onError = {(event) => event.target.style.display = "none"}/>
									<div className = "each-image-control row"> 
									    <span style = {{"fontWeight":"bolder"}} className = "text-dark d-flex justify-content-between">Name: {item.name}</span>
										<button data-id = {item._id} className = "btn btn-danger" onClick = {deleteImage}>Delete</button>
									</div>
								</div>
							</div>
						)
					})
				}

				








			</div>
		</div>
	)
}