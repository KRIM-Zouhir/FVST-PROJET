import React from 'react';
import { Link } from "react-router-dom";
import './styles/header.css'; // Create a separate CSS file for the header

const Header = () => {
return (
    <header className="Header">
        <div className="navigation-container">
        <nav className="Nav">
            <Link to="/home" className="HOME">Home</Link>
            <Link to="/about" className="ABOUT">About</Link>
            <Link to="/contact" className="CONTACT">Contact</Link>
        </nav>

        <Link to="/home" className="Logo">FVST</Link>

        <div className="BTN">
            <Link to="/login">
                <button className="LOGIN">Log In</button>
            </Link>
            <Link to="/signup">
                <button className="SIGN_IN">Sign Up</button>
            </Link>
        </div>
        </div>
    </header>
    );
};

export default Header;
