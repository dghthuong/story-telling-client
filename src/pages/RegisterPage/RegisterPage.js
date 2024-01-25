import React, { useState } from "react";
import "./RegisterPage.css";
// Make sure to create a corresponding CSS file to style your components
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {message} from 'antd'

const API_URL = process.env.REACT_APP_API_URL;

const RegisterPage = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      message.error("Mật khẩu nhập lại không khớp!"); // Hiển thị lỗi nếu mật khẩu không khớp
      return;
    } 
    axios
      .post(`${API_URL}/api/signup`, { email, password })
      .then((result) => {
        console.log(result);
        Swal.fire({
          title: "Đăng ký thành công!",
          text: "Vui lòng đăng nhập",
          icon: "success",
          confirmButtonText: "Xác nhận",
        });
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h1 className="title">ĐĂNG KÝ</h1>
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
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div className="form-options">
            <label>
              <input type="checkbox" /> Lưu thông tin
            </label>
            <a style={{color:'#029FAE' }} href="/forgot-password">Quên mật khẩu?</a>
          </div>
          <button type="submit" className="sign-in-button">
            Đăng ký
          </button>
          <div className="signup-link">
            Đã có tài khoản? <a href="/login">Đăng nhập</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
