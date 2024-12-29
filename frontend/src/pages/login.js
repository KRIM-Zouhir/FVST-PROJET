import React, { useState } from "react";
import {Link} from "react-router-dom";
import  './styles/login.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt with:", { username, password });
    // Add logic to handle authentication here
  };

  return (
    
    <div className="LoginPage">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>

        <label>Username:</label>
        <input
          type="text"
          className="username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />


        <label>Password:</label>
        <input
          type="password"
          className="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="Links">
        <Link to="/signup" className="Links2">Create an account?</Link>
        <Link to="/" className="Links1">Forgot Password?</Link>
        
        </div>

        <button type="submit">Login</button>
        
      </form>

      
    </div>
    

  );
};

export default Login;
