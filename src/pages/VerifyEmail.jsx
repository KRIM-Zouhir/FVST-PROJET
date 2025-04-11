import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // Send the token to the backend for verification
      api
        .get(`/api/auth/verify-email?token=${token}`)
        .then((response) => {
          setMessage("Email verified successfully! You can now log in.");
          // Redirect to the login page after a short delay
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        })
        .catch((err) => {
          console.error("Error verifying email:", err);
          setMessage("Error verifying email. Please try again.");
        });
    } else {
      setMessage("Invalid verification link.");
    }
  }, [searchParams, navigate]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;