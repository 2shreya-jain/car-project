import React from 'react';
import './home.scss';
import Navbar from '../navbar'
import { useHistory } from "react-router-dom";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
  } from "react-router-dom";
import Booking from '../booking';

const Home = props => {
	const history = useHistory()
	const navigate = (type) =>{
		history.push(`/home/${type}`);
	}
return <div>
		<Navbar/>
		<div className="card">
			<div className="text">
				<p>Finding Parking is Easy Now</p>
				<button onClick={()=>{navigate('add-location')}}>Add your Space</button>
				<button onClick={()=>{navigate('book')}}>Find Parking</button>
			</div>
			<div className="gif">
				<img src="https://cdn.dribbble.com/users/1287580/screenshots/5410442/dribbble_2.gif" />
			</div>
		</div>
	</div>
	
};


export default Home;
