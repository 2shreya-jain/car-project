import React, { useState } from 'react';
import './navbar.scss';
import { Menu } from 'antd';
import logo from '../../logo.svg';
import axios from "axios";
import { List, Typography, Divider } from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
  } from "react-router-dom";
  
  import { Modal, Button } from 'antd'

const { SubMenu } = Menu;
const baseURL = "http://localhost:5000/api/";

class Navbar extends React.Component {
	state = {
	  current: 'home',
	  visible : false,
	  data : [],
	  bdata : []
	};
  
	handleClick = e => {
	  console.log('click ', e);
	  this.setState({ current: e.key });
	};
	
	getuserad = () => {
		let id = ''+JSON.parse(sessionStorage.getItem('userDetails')).id;
		axios
        .post(baseURL+'getuserad', {id}
        )
        .then((response) => {
          if(response.status===200){
			let data = [];
			response.data.data.map((x)=>{
			let y = []; 
			x.map((z)=>{
				if(z){
					y = [...y,...z];
				}
			})
			console.log(x);
			let obj = {
				"id": y[0], 
				"name": y[1], 
				"area": y[2], 
				"time": y[3], 
				"price": y[4], 
				"address": y[5],
				"latitude": y[6], 
				"longitude": y[7], 
				"city": y[8], 
				"country": y[9], 
				"user_id": y[10],
				'bookinguser' : y[18],
				'bookingmobile' : y[19],
				'st' : y[14],
				'et' : y[15]
			  };
			  console.log(obj)
			  data.push(obj);
		});
		this.setState({data : data});
         
          }
        });
	}
	getuserbooking = () => {
		let id = ''+JSON.parse(sessionStorage.getItem('userDetails')).id;
		axios
        .post(baseURL+'getuserbooking', {id}
        )
        .then((response) => {
          if(response.status===200){
		this.setState({bdata : response.data.data});	
		}

        });
	}
	componentDidMount() {
		this.getuserad()
		this.getuserbooking()
	}
	render() {
	  const { current,visible,data,bdata } = this.state;
	 
	  return (
		  <div className="navbar">
			  <div className="logo">
			  <object type="image/svg+xml" data={logo} className="login-logo-nav"></object>
			  </div>
		<Menu onClick={this.handleClick} selectedKeys={[current]} mode="horizontal">
		<Menu.Item key="home">
		  	<Link to="/home">Home</Link>
		  </Menu.Item>
		  <Menu.Item key="book">
		  	<Link to="/home/book">Book Now</Link>
		  </Menu.Item>
		  <Menu.Item key="add">
		  <Link to="/home/add-location">Add Your Parking</Link>
		  </Menu.Item>
		  <Menu.Item key="activities">
		  <p onClick={() => this.setState({visible:true})}>Activities</p>
		  </Menu.Item>
		  <Menu.Item key="logout">
		  <Link to="/">Logout</Link>
		  </Menu.Item>
		</Menu>
		<Modal
        title="Your Activites"
        centered
        visible={visible}
        onOk={() => this.setState({visible : false})}
        onCancel={() => this.setState({visible : false})}
        width={'100%'}
		height={'100%'}
      >
      <div className="data-list">

		  <div className="left-pane">
			  <p>Your Booking</p>

			  <List
	  width={'100%'}
      dataSource={data}
      renderItem={item => (
        <List.Item>
			<div className="list">
				<p><span>Name: </span>{item.name}</p>
				<p><span>Address: </span>{item.address}</p>
				<p><span>Price: </span>{item.price}</p>
				<p><span>Area:</span>{item.area}</p>
				<p><span>Availibility : </span>{item.time}</p>
				{item.bookinguser && (<span className="booking">
				<h4>Booking Details</h4>
				<p><span>Name: </span>{item.bookinguser}</p>
				<p><span>Mobile: </span>{item.bookingmobile}</p>
				<p><span>Start Time: </span>{item.st}</p>
				<p><span>End Time: </span>{item.et}</p>
				</span>)}
			</div>
			 
        </List.Item>
      )}
    />
		  </div>

		  <div className="right-pane">
			  <p>Your Ads</p>
			  <List
	  width={'100%'}
      dataSource={bdata}
      renderItem={item => (
        <List.Item>
			<div className="list">
				<p><span>Name: </span>{item.name}</p>
				<p><span>Address: </span>{item.address}</p>
				<p><span>Price: </span>{item.price}</p>
				<p><span>Area: </span>{item.area}</p>
				<p><span>Availibility: </span>{item.time}</p>
				<p><span>Service Time: </span>{item.start} - {item.end}</p>
				<p><span>User Name: </span>{item.uname}</p>
				<p><span>User Mobile: </span>{item.umobile}</p>
				<p><span><a href={`http://www.google.com/maps/place/${item.lat},${item.lng}`} target="_blank">Map Link</a></span></p>
			</div>
			 
        </List.Item>
      )}
    />
		  </div>
	  </div>
      </Modal>
		</div>
	  );
	}
  }

export default Navbar;
