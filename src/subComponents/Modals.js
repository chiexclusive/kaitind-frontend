



export function DeliveredToModal () {


	const handleFieldFocused = (event, isFocus) => {
		const target = event.target.parentElement;
		if(isFocus)	target.classList.toggle("copy-input-focus-state");
		else target.classList.remove("copy-input-focus-state");
	}

	return (
		<div className = "modal" id = "delivered-to-modal" tabIndex = "-1" role = "dialog">
			<div className = "modal-dialog">
				<div className = "modal-content">
					<div className = "modal-header">
						<h5 style = {{"display": "inline-block", "minWidth": "10px"}} className = "modal-title  truncated ">Enter your delivery location</h5>
						<button type = "button" className = "close" data-dismiss = "modal" aria-label = "close">&times;</button>
					</div>
					<div className = "modal-body">
						<div className = "d-flex justify-content-around row">
							<div className = "col-xs-12">
								<strong className = "btn btn-outline-primary rounded-pill active">Bengaluru</strong>
							</div>
							<div className = "col-xs-12">
								<strong>Mumbai</strong>
							</div>
							<div className = "col-xs-12">
								<strong>New Delhi</strong>
							</div>
							<div className = "col-xs-12">
								<strong>Gurgaon</strong>
							</div>
						</div>

						<div className = "input">
							<div className = "fa fa-search"></div>
							<input type =  "text" placeholder = "Some location" onBlur = {(event) => handleFieldFocused(event, false)} onFocus = {(event) => handleFieldFocused(event, true)}/>
							<div className = "locate-me">Locate Me</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}





export function SuccessModal (props) {


	const closeSwall = (event) => {
		const ref = document.getElementsByClassName("swal-overlay")[0];
		const ref2 = document.getElementsByClassName("swal-button")[0];
		if(event.target === ref || event.target === ref2){
			props.setData(JSON.stringify({headerMessage: "", bodyMessage: ""}));
			props.setSwalToggled(false)
		}
	}



	if(props.swalToggled){
		return (
			<div className = "swal-overlay swal-overlay--show-modal" tabIndex="-1" onClick = {closeSwall}>
				<div className = "swal-modal" role="dialog" aria-modal="true">
				  	<div className = "swal-icon swal-icon--success">
					    <span className = "swal-icon--success__line swal-icon--success__line--long"></span>
					    <span className = "swal-icon--success__line swal-icon--success__line--tip"></span>
				    	<div className = "swal-icon--success__ring"></div>
				    	<div className = "swal-icon--success__hide-corners"></div>
					</div>
					<div className = "swal-title" >{props.data.headerMessage}</div>
						<div className = "swal-text" >{props.data.bodyMessage}</div>
						<div className = "swal-footer">
							<div className = "swal-button-container">

				    		<button className = "swal-button swal-button--confirm" onClick = {closeSwall}>OK</button>

						    <div className = "swal-button__loader">
						      <div></div>
						      <div></div>
						      <div></div>
						    </div>
				  		</div>
				  	</div>
				</div>
			</div>
		)
	}else{
		return <div></div>
	}
}




















