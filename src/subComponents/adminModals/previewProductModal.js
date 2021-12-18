


export default function AdminPreviewProductModal (props) {


	const data = JSON.parse(props.toPreview)
	if(Object.keys(data).length !== 0){
		return (
			<div className = "modal" id = "preview-product-modal">
					<div className = "modal-dialog">
						<div className = "modal-content">
							<div className = "modal-header">
								<strong>Preview Product</strong>
								<span className = "close" data-dismiss = "modal">&times;</span>
							</div>
							<div className = "modal-body">
								<div className = "admin-preview-image-container">
									<img src = {window.BASE_URL+"/storage/images/products/"+data.foodImage} alt = ""/>
								</div>
								<div className = "text-left admin-preview-content-container m-3">
							
									<div className = "row w-100 mt-3">
										<strong className = "col-6">Category: </strong>
										<small className = "col-6">{data.foodGroup}</small>
									</div>
									<div className = "row w-100 mt-3">
										<strong className = "col-6"> Product Name: </strong>
										<small className = "col-6">{data.foodName}</small>
									</div>
									<div className = "row w-100 mt-3">
										<strong className = "col-6">Type: </strong>
										<small className = "col-6">{data.foodType}</small>
									</div>
									<div className = "row w-100 mt-3">
										<strong className = "col-6">Calories:</strong>
										<small className = "col-6">{(data.calories === "")?"": data.calories+ " cal"}</small>
									</div>
									<div className = "row w-100 mt-3">
										<strong className = "col-6">Amount: </strong>
										<small className = "col-6"><span className="fa fa-rupee"></span> {data.amount} </small>
									</div>
									<div className = "row w-100 mt-3">
										<strong className = "col-6">% Discount</strong>
										<small className = "col-6">{(data.percentageDiscount === "")?"": data.percentageDiscount+ "%"}</small>
									</div>
									<div className = "row w-100 mt-3">
										<strong className = "col-6">On Sale</strong>
										<small className = "col-6">{(data.isOpen)? "Yes": "No"}</small>
									</div>
									<div className = "row w-100 mt-3">
										<strong className = "col-6">Date</strong>
										<small className = "col-6">{window.formatDate(data.dateCreated)}</small>
									</div>



								</div>
							</div>
							<div className = "modal-footer">
								<button className = "btn btn-secondary" data-dismiss = "modal"><span className = "fa fa-edit"></span>Edit</button>
								<button className = "btn btn-danger" data-dismiss = "modal"><span className = "fa fa-trash"></span>Delete</button>
								<button className = "btn btn-primary" data-dismiss = "modal">Ok</button>
							</div>
						</div>
					</div>
				</div>

		)
	}else{
		return (
			<div className = "modal" id = "preview-product-modal">
					<div className = "modal-dialog">
						<div className = "modal-content">
							<div className = "modal-header">
								<strong>Preview Products</strong>
								<span className = "close" data-dismiss = "modal">&times;</span>
							</div>
							<div className = "modal-body">
							<strong>Nothing left to see here</strong>
							</div>
							<div className = "modal-footer">
								<button className = "btn btn-primary" data-dismiss = "modal">Ok</button>
							</div>
						</div>
					</div>
				</div>

		)
	}
}