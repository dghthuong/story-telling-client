import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { UserContext } from "../../context/UserContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import UserRoutes from "../../routes/UserRoutes";
import {
  UserOutlined,
  ProfileOutlined,
  HeartTwoTone,
  HeartFilled,
} from "@ant-design/icons";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);
  const userId = localStorage.getItem("id");
  const name = localStorage.getItem("name"); 
  const [userInfo, setUserInfo] = useState([]);

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
  });


  return (
    <>
      <nav className="navbar">
        <div className="logo">STORY TELLING</div>
        <div className="menu">
          {user && user.auth === true ? (
            <>
              <NavLink to="/" activeClassName="active" className="navbar-link">
                Trang chủ
              </NavLink>

              <NavLink
                to="/story"
                activeClassName="active"
                className="navbar-link"
              >
                Kho truyện
              </NavLink>
              {user.role === "user" && (
                <NavLink
                  to={`/user/playlist/${userId}`}
                  activeClassName="active"
                  className="navbar-link"
                >
                  Danh sách phát
                </NavLink>
              )}
            </>
          ) : (
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
            </>
          )}
        </div>
        <div className="auth">
          {user && user.auth === true ? (
            <>
              <spanm className ="navbar-link">{userInfo.name}</spanm>
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
                    <HeartFilled style={{ color: "#ff0000" }} />
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
                Đăng nhập
              </NavLink>

              <NavLink
                to="/register"
                activeClassName="active"
                className="register-btn"
              >
                Đăng ký
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
