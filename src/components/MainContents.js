import Home from "./Home";
import AdminPortal from "./AdminPortal";
import StaffPortal from "./StaffPortal";
import StudentPortal from "./StudentPortal";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"


function MainContents(){
    return(
        <Router>
            <Switch>
                <Route path = "/" exact component = {Home}  />
                <Route path = "/admin" exact component = {AdminPortal} />
            </Switch>
        </Router>
    )
}

export default MainContents;