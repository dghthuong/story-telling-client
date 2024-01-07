import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { UserContext } from "../../context/UserContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import UserRoutes from "../../routes/UserRoutes";
import { UserOutlined, ProfileOutlined , HeartTwoTone} from "@ant-design/icons";
import axios from 'axios' 



const API_URL = process.env.REACT_APP_API_URL; 

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);
  const userId = localStorage.getItem("id")
  const [userInfo , setUserInfo] = useState([]); 
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/${userId}`);
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };
    fetchData();
  },[]);
  
  const handleLogout = () => {
    logout();
    navigate("/");
    Swal.fire({
      title: "Sign Out Successfully!",
      text: "See you soon!",
      icon: "success",
      confirmButtonText: "Done",
    });
  };
  return (
    <>
      <nav className="navbar">
        <div className="logo"  >STORY TELLING</div>
        <div className="menu">
          {user && user.auth === true ? (
            <>
              <NavLink to="/" activeClassName="active" className="nav-link">
                Trang chủ
              </NavLink>

              <NavLink
                to="/story"
                activeClassName="active"
                className="nav-link"
              >
                Kho truyện 
              </NavLink>
              {user.role === "user" && (
                <NavLink
                  to="/user/playlist"
                  activeClassName="active"
                  className="nav-link"
                >
                  Danh sách phát
                </NavLink>
              )}
            </>
          ) : (
            <>
              <NavLink to="/" activeClassName="active" className="nav-link">
                Home
              </NavLink>

              <NavLink
                to="/story"
                activeClassName="active"
                className="nav-link"
              >
                Story
              </NavLink>
            </>
          )}
        </div>
        <div className="auth">
          {user && user.auth === true ? (
            <>
              <span>{userInfo.name}</span>
              {user.role === "admin" && (
                <>
                  <NavLink
                    to="/admin/dashboard"
                    activeClassName="active"
                    className="login-btn"
                  >
                    <UserOutlined />
                  </NavLink>
                </>
              )}

              {user.role === "user" && (
                <>
                  <NavLink
                    to="/user/wishlist"
                    activeClassName="active"
                    className="wishlist-btn"
                  >
                    <HeartTwoTone twoToneColor="#ff0000" />
                  </NavLink>

                  <NavLink
                    to="/user/dashboard"
                    activeClassName="active"
                    className="login-btn"
                  >
                    <UserOutlined />
                  </NavLink>
                </>
              )}
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                activeClassName="active"
                className="login-btn"
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                activeClassName="active"
                className="register-btn"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
