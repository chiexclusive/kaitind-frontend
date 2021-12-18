import AdminNewProductModal from "./adminModals/newProductModal.js";
import AdminEditProductModal from "./adminModals/editProductModal.js";
import AdminPreviewProductModal from "./adminModals/previewProductModal.js";


//Dependencies
import {useState, useEffect} from "react"


function ManageProductArea () {

	

	const [products, setProducts] = useState(JSON.stringify([]));
	const [baseSearchProducts, setBaseSearchProducts] = useState(JSON.stringify([]));
	const [previewOne, setPreviewOne] = useState(JSON.stringify({}));
	const [editOne, setEditOne] = useState(JSON.stringify({}));
	const [deleteList, setDeleteList] = useState(JSON.stringify([]));
	const [searchQuery, setSearchQuery] = useState("");



	const toggleNewModal = (event) => {
		const element = event.target;
		event.target.click();
	}




	const updateProducts = (product) => {
		const testProducts = JSON.parse(products);
		testProducts.unshift(product)
		setProducts(JSON.stringify(testProducts));
		setBaseSearchProducts(JSON.stringify(testProducts))
	}



	const handlePreviewOne = (event) => {
		const targetId = (event.target.getAttribute("class") === "fa fa-eye")? event.target.parentElement.getAttribute("data-id"): event.target.getAttribute("data-id");
		const data = JSON.parse(products)
		const targetData = data.find(product => product._id === targetId);
		if(targetData !== (undefined || null)) setPreviewOne(JSON.stringify(targetData))
	}



	const handleEditOne = (event) => {
		const targetId = (event.target.getAttribute("class") === "fa fa-edit")? event.target.parentElement.getAttribute("data-id"): event.target.getAttribute("data-id");
		const data = JSON.parse(products)
		const targetData = data.find(product => product._id === targetId);
		if(targetData !== (undefined || null)) setEditOne(JSON.stringify(targetData))
	}






	useEffect(() => {
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





	const updateSpecificProduct = (data, id) => {
		let testProducts = JSON.parse(products)
		JSON.parse(products).forEach((item, index) => {
			if(item._id === id ){
				for(let field in item){
					if(field !== "dateCreated" && field !== "_id"){
						if(field in data){
							testProducts[index][field] = data[field];
							setProducts(JSON.stringify(testProducts));
							setBaseSearchProducts(JSON.stringify(testProducts))
						}
					}
				}
			}
		})
	}




	const deleteSpecificProduct = (id) => {
		const testProducts = JSON.parse(products)
		JSON.parse(products).forEach((item, index) => {
			if(item._id === id ){
				testProducts.splice(index, 1);
				setProducts(JSON.stringify(testProducts));
				setBaseSearchProducts(JSON.stringify(testProducts))
			}
		})
	}







	const searchItem = () => {
		const products = document.querySelectorAll(".products");
	
		products.forEach((item, index) => {
			if(item.getAttribute("data-product").toString().toLowerCase().indexOf(searchQuery.toString().toLowerCase()) > -1){
				item.classList.remove("hide")
			}else{
				item.classList.add("hide")
			}
		})
	}




	const deleteFoodItems = () => {
		if(JSON.parse(deleteList).length > 0){
			const config = {
				method: "DELETE",
				credentials: "include",
				body: JSON.stringify({list: JSON.parse(deleteList)}),
				headers:{
					"Content-Type": "application/json"
				}
			}
			const url = window.BASE_URL+ "/admin/products";
			fetch(url, config)
			.then(res => res.json())
			.then((res) => {
				if(res.success){
					res.message.forEach((item, index) => {
						deleteSpecificProduct(item._id)
					})
					setDeleteList(JSON.stringify([]))
				}
			})
			.catch(() => {
				
			})
		}
	}








	const addToDeleteList = (event) => {
		const id = event.target.getAttribute("data-id");
		const testList = JSON.parse(deleteList)
		if(event.target.checked){
			testList.push(id)
			setDeleteList(JSON.stringify(testList))
		}else{
			testList.splice([testList.indexOf(id)])
			setDeleteList(JSON.stringify(testList))
			
		}
	}



	useEffect(() => {
		searchItem();
	}, [searchQuery])



	return (
			<div>
		
				<div className  = "breadcrumb">
					<span className = "breadcrumb-item"><a href = "/"><span className = "fa fa-home"></span>Home</a></span>
					<span className = "breadcrumb-item">Manage Products</span>
				</div>
				<div className = "float-right">
						<div className = "btn-group">
							<button data-toggle ="modal" data-target = "#new-product-modal" type = "button" className = "btn btn-success">
							<span className = "fa fa-plus"></span> New</button>

							<button type = "button" className = {(JSON.parse(deleteList).length == 0)?'disabled btn btn-success': 'btn btn-success'}   onClick = {deleteFoodItems}>
							<span className = "fa fa-trash"></span> Delete</button>
	
						</div>
				</div>
				<div className = "admin-search-product mb-3 float-left">
					<div className = "btn-group">
						<input placeholder = "Search by product name..." className = "form-control" type = "text" value = {searchQuery} onChange = {(event) => {setSearchQuery(event.target.value)}}/>
					</div>
				</div>
				<div className = "manage-products table-responsive">
					<table className = "w-100 table  table-hover">
						<thead className = "table-dark">
							<tr>
								<th></th>
								<th>CATEGORY</th>
								<th>PRODUCT</th>
								<th>TYPE</th>
								<th>CALORIES</th>
								<th>AMOUNT</th>
								<th>DATE CREATED</th>
								<th>ACTIONS</th>
							</tr>
						</thead>
						<tbody>
							
								{
									JSON.parse(products).map((product) => {
										
										return (
											<tr className = "products" key = {product._id} data-product = {product.foodName}>
												<td><input data-id = {product._id} type = "checkbox" onChange = {addToDeleteList}/></td>
												<td>{product.foodGroup}</td>
												<td>{product.foodName}</td>
												<td>{product.foodType}</td>
												<td>{product.calories}</td>
												<td>{product.amount}</td>
												<td>{window.formatDate(product.dateCreated)}</td>
												<td className = "btn-group">
													<button data-id = {product._id}  title = "preview" className = "btn btn-inverse-success" data-toggle = "modal" data-target = "#preview-product-modal" onClick = {handlePreviewOne}>
														<span className = "fa fa-eye"></span>
													</button>
													<button  data-id = {product._id} title = "preview" className = "btn btn-inverse-danger" data-toggle = "modal" data-target = "#edit-product-modal" onClick = {handleEditOne}>
														<span className = "fa fa-edit"></span>
													</button>
												</td>
											</tr>
										)
									})
								}
							
						</tbody>
					</table>
				</div>



				<AdminNewProductModal updateProducts = {updateProducts}/>
				<AdminEditProductModal updateSpecificProduct = {updateSpecificProduct} toEdit = {editOne}/>
				<AdminPreviewProductModal  toPreview = {previewOne}/>


			</div>
	)
}

export default ManageProductArea

