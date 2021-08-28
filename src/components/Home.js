import React from "react";
import {ReactComponent as AnimatedSVG} from "./../assets/images/AnimatedSVG.svg";
import LoginForm from "./subComponents/LoginForm";


function Home () {
    return (
    	<div>
		    <header className="header flex">
		        <div className="container">
		            <h2>My_School</h2>
		            <nav>
		                <ul>
		                    <li><a href="home.html">Home</a></li>
		                    <li><a href="home.html">Events</a></li>
		                    <li><a href="home.html">News</a></li>
		                    <li><a href="home.html">Portal</a></li>
		                    <li><a href="home.html">Gallery</a></li>
		                    <li><a href="home.html">Contact</a></li>
		                    <li><a href="home.html">About</a></li>
		                    <li><a href="home.html">Faq</a></li>
		                </ul>
		            </nav>
		        </div>
		    </header>


		    <div className="showcase">
		        <div className="container grid">
		            <div className="showcase-text">
		                <h1>My School</h1>
		                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestiae dignissimos itaque aspernatur dolorem. Nulla ut, exercitationem porro ipsum molestias dignissimos.</p>
		                <a href="/enroll" className="enroll-now">Enroll Now</a>
		            </div>
		            <div className="showcase-card grid">
		                <div className="svg-container">
		                    <AnimatedSVG/>
		                </div>
		                <div className="card">
		                    <LoginForm />
		                </div>
		            </div>
		        </div>
		    </div>
    	</div>
    );
}

export default Home;