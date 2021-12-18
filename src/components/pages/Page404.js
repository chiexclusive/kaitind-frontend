//Components
import Title from "./../../subComponents/Title";



function Page404 () {



	//implement go to previous pagae
	const gotoPreviousPage = () => {
		let previousPage = "";
		if(JSON.parse(localStorage.getItem("pagesVisited"))){
			let  previousPages = JSON.parse(localStorage.getItem("pagesVisited"));
			previousPage= previousPages[previousPages.length - 1 ]
		}else previousPage = "/"

		window.location = previousPage;
	}


    return (
    	<div>
	        <Title text = "404 | NOT FOUND" />
	        
	        <div className="page-404-container">
            <div className="row">
                <div className="col-md-12">
                    <div className="text-center error-pages">
                        <h1 className="error-title text-white"> 404</h1>
                        <h2 className="error-sub-title text-white">404 not found</h2>

                        <p className="error-message text-white text-uppercase">Sorry, an error has occured, Requested page not found!</p>
                        
                        <div className="mt-4">
                          <a href="/" className="btn btn-info btn-round shadow-info m-1">Go To Home </a>
                          <span className="btn btn-info btn-round m-1" onClick = {() => gotoPreviousPage()}>Previous Page </span>
                        </div>

                        <div className="mt-4 container">
                            <p className="text-white">Copyright © 2021 KAITING RESTAURANT | All rights reserved.</p>
                        </div>
                           <hr className="w-50 border-light-2" />
                        <div className="mt-2">
                            <span className="btn-social btn-social-circle btn-facebook waves-effect waves-light m-1"><i className="fa fa-facebook"></i></span>
                            <span  className="btn-social btn-social-circle btn-google-plus waves-effect waves-light m-1"><i className="fa fa-google-plus"></i></span>
                            <span className="btn-social btn-social-circle btn-behance waves-effect waves-light m-1"><i className="fa fa-behance"></i></span>
                            <span className="btn-social btn-social-circle btn-dribbble waves-effect waves-light m-1"><i className="fa fa-dribbble"></i></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

export default Page404; //404 contents