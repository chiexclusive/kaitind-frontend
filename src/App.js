//Styles
import "./assets/styles/App.css";

//Utilities
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {useEffect} from "react";
import ValidPages from"./utilities/ValidPages"

//Pages
import Home from "./components/pages/Home";
import Contacts from "./components/pages/Contacts";
import BulkOrder from "./components/pages/BulkOrder";
import About from "./components/pages/About";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Page404 from "./components/pages/Page404";
import AdminLogin from "./components/pages/AdminLogin";
import ManageWebsite from "./components/pages/ManageWebsite";
import Cart from "./components/pages/Cart";
import BillingAddress from "./components/pages/BillingAddress";
import MyOrders from "./components/pages/MyOrders";
import MyOrdersDetails from "./components/pages/MyOrdersDetails.js";
import TrackOrder from "./components/pages/TrackOrder.js";


//Main App
function App() {


  useEffect(() => {


    //Store page history
    const validPages = ValidPages();
    let prevPages = [];
    if(JSON.parse(localStorage.getItem("pagesVisited"))){
      prevPages = JSON.parse(localStorage.getItem("pagesVisited"));
      if(validPages.find(path => path === window.location.pathname) !== (undefined && null) && prevPages[prevPages.length - 1] !== window.location.pathname){
        localStorage.setItem("pagesVisited", JSON.stringify([...JSON.parse(localStorage.getItem("pagesVisited")), window.location.pathname]));
      }
    }
  })


  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path = "/" exact component = {Home}/>
          <Route path = "/contacts" component = {Contacts} />
          <Route path = "/bulkorder" component = {BulkOrder} />
          <Route path = "/about" component = {About} />
          <Route path = "/login" component = {Login} />
          <Route path = "/register" component = {Register} />
          <Route path = "/admin/login" exact component = {AdminLogin} />
          <Route path = "/admin/manage" exact component = {ManageWebsite} />
          <Route path = "/admin/orders" exact component = {ManageWebsite} />
          <Route path = "/admin/slideshow" exact component = {ManageWebsite} />
          <Route path = "/admin/discounts" exact component = {ManageWebsite} />
          <Route path = "/cart" exact component = {Cart} />
          <Route path = "/billing-address" exact component = {BillingAddress} />
          <Route path = "/my-orders" exact component = {MyOrders} />
          <Route path = "/my-orders/details" component = {MyOrdersDetails} />
          <Route path = "/my-orders/track" component = {TrackOrder} />
          <Route component = {Page404} />
        </Switch>
      </Router>
    </div>
  );
}


export default App;
