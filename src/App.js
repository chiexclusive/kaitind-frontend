
import "./assets/styles/styles.css";
import "./assets/styles/animation.css";
import "./assets/styles/font-awesome/css/font-awesome.min.css";
import "./assets/styles/utilities.css";
import MainContents from "./components/MainContents";
import {useEffect, useState} from "react"; //Require useEffect

const BASE_URL = window.BASE_URL = "http://localhost:8000";
const APP_NAME = window.APP_NAME = "My School";

//Main App
function App() {
  
  const [page, setPageName] = useState("blank");

  //Determine page to load based on url
  useEffect(()=> {
    fetch(BASE_URL+ "/", {method: "GET"})
    .then((response) => response.json(response))
    .then((result) => setPageName(result.page));
  })

  //Pass the page state to  {Main Contents}
  return (
    <div className="App">
      <MainContents page = {page}/>
    </div>
  );
}


export default App;
