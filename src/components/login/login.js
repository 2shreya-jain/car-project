import React from 'react';
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useState } from 'react';
import logo from '../../logo.svg';
import './login.scss';

const baseURL = "http://localhost:5000/api/";

const Login = props => {
    const history = useHistory()
    const [email, setEmail] = useState('');
    const [pwd, setPassword] = useState('');
    const [uname, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const callLogin = () => {
        axios
          .post(baseURL+'login', {name:email, pwd:pwd}
          )
          .then((response) => {
            if(response.status===200){
                sessionStorage.setItem('userDetails',JSON.stringify(response.data));
                history.push("/home"); 
            }
          });
      }
    
      const callRegister = () => {
        axios
          .post(baseURL+'register', {name:uname, pwd:pwd,email : email, mobile : mobile}
          )
          .then((response) => {
            if(response.status===200){
                sessionStorage.setItem('userDetails',JSON.stringify(response.data));
                history.push("/home"); 
            }
          });
      }

      const [isLogin,updateStatus] = useState(true);
    return (
	<div className="login-container">
	<div className="container">
    <div className="header">
        <div className="header-image">
            <div className="header-image-particle header-image-particle-1"></div>
            <div className="header-image-particle header-image-particle-2"></div>
            <div className="header-image-particle header-image-particle-3"></div>
            <object type="image/svg+xml" data={logo} className="login-logo"></object>


        </div>

        <h1 className="header-title text-center">
            Welcome to Secure Parking!
        </h1>

        <p className="text text-center">
            Keep your data safe
        </p>
    </div>
    {isLogin && (
    <form>
        <div className="input app-input">
            <input type="text" name="email" id="email" placeholder="Email" value={email} onInput={e => setEmail(e.target.value)} />
        </div>

        <div className="input app-input">
            <input type="password" name="password" id="password" placeholder="Password" value={pwd} onInput={e => setPassword(e.target.value)}/>
        </div>

        <button type="button" className="button app-login-button" onClick={callLogin}>
            Login
        </button>
    </form>
    )}

{!isLogin && (
    <form>
        <div className="input app-input">
            <input type="text" name="name" id="name" placeholder="Name" value={uname} onInput={e => setName(e.target.value)} />
        </div>

        <div className="input app-input">
            <input type="text" name="Mobile" id="Mobile" placeholder="Mobile" value={mobile} onInput={e => setMobile(e.target.value)} />
        </div>

        <div className="input app-input">
            <input type="text" name="Email" id="Email" placeholder="Email" value={email} onInput={e => setEmail(e.target.value)} />
        </div>


        <div className="input app-input">
            <input type="password" name="password" id="password" placeholder="Password" value={pwd} onInput={e => setPassword(e.target.value)}/>
        </div>

        <button type="button" className="button app-login-button" onClick={callRegister}>
            Register
        </button>
    </form>
    )}

    <div className="text-center">
        <a href="/" className="text link">Forgot password?</a>
    </div>

    <div className="footer">
        <p className="text text-center">
            Don't have an account?
            <p className="text link" onClick={()=>{updateStatus(false)}}>Register!</p>
        </p>
    </div>
</div>
</div>
)
};



export default Login;
