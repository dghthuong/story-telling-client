import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import { UserContext } from "../../context/UserContext";



function HomePage() {
  const token = localStorage.getItem("token");
  const {user} = useContext(UserContext); 
  return (
    <>
      <div className="homepage">
        <header className="header">
          <h1>KỂ CHUYỆN BẰNG GIỌNG NÓI CỦA BẠN</h1>
          {!token && user.auth === true &&(
            <Link to="/register" className="register-now-btn">
              ĐĂNG KÝ NGAY
            </Link>
          )}

            <Link to="/story" className="register-now-btn">
              KHÁM PHÁ 
            </Link>
        </header>
      </div>
    </>
  );
}

export default HomePage;
