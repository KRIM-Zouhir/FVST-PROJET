import React, { useState } from "react";
import {Link} from "react-router-dom";
import  './styles/signup.css';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Sign up attempt with:", { email, password });
    // Add sign-up logic here
  };

  return (
    <div>

        <header className="Header">
            <div className="navigation-container">

            {/*  <nav className="Nav">
                <a href="#home" className="HOME">Home</a>
                <a href="#about" className="ABOUT">About</a>
                <a href="#contact" className="CONTACT">Contact</a>
            </nav>*/}


            <nav className="Nav">
                <Link to="/home" className="HOME">Home</Link>
                <Link to="/about" className="ABOUT">About</Link>
                <Link to="/contact" className="CONTACT">Contact</Link>
            </nav>

            <Link to="/home" className="Logo">FVST</Link>

            <div className="BTN">
            <Link to="/login" >
                <button className="LOGIN">Log In</button>
            </Link>

            <Link to="/signup" >
                <button className="SIGN_IN">Sign Up</button>
                </Link>
            </div>
            </div>
    </header>


    <div className="SignUpPage">

      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>First Name</label>
        <input
        type="text"
        placeholder="Enter your first name"
        value={firstname}
        onChange={(e) => setFirstName(e.target.value)}
        />

        <label>Last Name</label>
        <input
        type="text"
        placeholder="Enter your last name"
        value={lastname}
        onChange={(e) => setLastName(e.target.value)}
        />

        <label>Username</label>
        <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        />

        <label>Email:</label>
      
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      
      
        <label>Password:</label>
      
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      
      
        <label>Confirm Password:</label>
      
        <input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      
        <button type="submit">Sign Up</button>
      </form>
    </div>
    </div>

  );
};

export default SignUp;
