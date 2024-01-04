import React, { useContext, useState } from "react";
import "./LoginPage.css"; // Make sure to create a corresponding CSS file to style your components
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { UserContext } from "../../context/UserContext";

const LoginPage = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const {loginContext} = useContext(UserContext)
  const handleSignIn = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8000/api/signin", {email,password})
      .then((result) => {
        console.log(result);
        loginContext(result.data.user._id,email, result.data.token, result.data.user.role); 
        Swal.fire({
          title: "Login Successfully!",
          text: "Do you want to continue",
          icon: "success",
          confirmButtonText: "Done",
        });
        navigate("/");
      })
      .catch((err) => {
        console.log(err)
        Swal.fire({
          title: "Login Failed!",
          text: "Login failed. Please try again.",
          icon: "error",
          confirmButtonText: "Done",
        });
        navigate("/login");
      });
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h1 className="title">SIGN IN</h1>
        <form className="login-form" onSubmit={handleSignIn}>
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
            Sign In
          </button>
          <div className="signup-link">
            Don't have account? <a href="/register">Sign Up</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
