import React, { useState } from "react";
import "./RegisterPage.css"; // Make sure to create a corresponding CSS file to style your components
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = process.env.REACT_APP_API_URL;


const RegisterPage = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = (event) => {
    event.preventDefault();
    axios
      .post(`${API_URL}/api/signup`, { email, password })
      .then((result) => {
        console.log(result);
        Swal.fire({
          title: "Sign Up Successfully!",
          text: "Please Sign In",
          icon: "success",
          confirmButtonText: "Done",
        });
        navigate('/login'); 
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h1 className="title">SIGN UP</h1>
        <form className="login-form" onSubmit={handleSignUp}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="form-options">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            {/* <a href="/forgot-password">Forgot Password</a> */}
          </div>
          <button type="submit" className="sign-in-button">
            Sign Up
          </button>
          <div className="signup-link">
            Having account? <a href="/login">Sign In</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
