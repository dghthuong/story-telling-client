import React, { useContext, useState } from "react";
import "./LoginPage.css"; // Make sure to create a corresponding CSS file to style your components
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { UserContext } from "../../context/UserContext";


const API_URL = process.env.REACT_APP_API_URL;

const LoginPage = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const {loginContext} = useContext(UserContext)
  const handleSignIn = (event) => {
    event.preventDefault();
    axios
      .post(`${API_URL}/api/signin`, {email,password})
      .then((result) => {
        console.log(result);
        loginContext(result.data.user._id,email, result.data.token, result.data.user.role); 
        Swal.fire({
          title: "Đăng nhập thành công!",
          text: "Thao tác sẽ được tiếp tục",
          icon: "success",
          confirmButtonText: "Xác nhận",
        });
        navigate("/");
      })
      .catch((err) => {
        console.log(err)
        Swal.fire({
          title: "Đăng nhập thất bại!",
          text: "Đăng nhập thất bại, vui lòng thử lại.",
          icon: "error",
          confirmButtonText: "Xác nhận",
        });
        navigate("/login");
      });
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h1 className="title">ĐĂNG NHẬP</h1>
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
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="form-options">
            <label>
              <input type="checkbox" label=""/>  Lưu thông tin
            </label>
            {/* <a href="/forgot-password">Forgot Password</a> */}
          </div>
          <button type="submit" className="sign-in-button">
            Đăng nhập
          </button>
          <div className="signup-link">
            Không có tài khoản? <a href="/register">Đăng ký</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
