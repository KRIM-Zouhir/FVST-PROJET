import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "../App.js"; // Home page component

const AppRoutes = () => {
  console.log("AppRoutes rendered");
  return (
    <Routes>
      <Route path="/home" element={<Home />} /> {/* Default home page */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};

export default AppRoutes;
