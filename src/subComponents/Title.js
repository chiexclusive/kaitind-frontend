
//Utilities
import Helmet from "react-helmet"

function Title (props) {
	return (
		<Helmet>
	        <title>{props.text}</title>
	    </Helmet> 
	);
}

export default Title; //Export title