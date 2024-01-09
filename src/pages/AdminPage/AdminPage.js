import React, { useState, useContext } from "react";
import { Layout, Menu, theme } from "antd";
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ManageUsers from "./ManageUsers";
import ManageStories from "./ManageStories";
import ManageGenre from "./ManageGenre";
import AdminInfo from "./AdminInfo"

const { Header, Sider, Content, Button } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [keySelect, setKeySelect] = useState("1");

  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);

  console.log(">> user: ", user);

  const handleLogout = () => {
    logout();
    navigate("/");
    Swal.fire({
      title: "Đăng xuất thành công!",
      text: "Hẹn gặp lại!",
      icon: "success",
      confirmButtonText: "Xác nhận",
    });
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuSelect = ({ key }) => {
    setKeySelect(key);
  };

  const renderContent = () => {
    switch (keySelect) {
      case "1":
        return <ManageUsers />;
      case "2":
        return <ManageStories />;
      case "4":
        return <ManageGenre/>;
      default:
        return <div>Default Content</div>;
    }
  };

  return (
    <Layout>
      <Sider
        collapsedWidth="400px"
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          onSelect={handleMenuSelect}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "Quản lý người dùng",
            },
            {
              key: "2",
              icon: <VideoCameraOutlined />,
              label: "Quản lý câu chuyện",
            },
            // {
            //   key: "3",
            //   icon: <UploadOutlined />,
            //   label: "Account",
            // },
            {
              key: "4",
              icon: <UploadOutlined />,
              label: "Quản lý thể loại",
            },
            {
              key: "5",
              icon: <LogoutOutlined />,
              label: "Đăng xuất",
              onClick: handleLogout,
            },
          ]}
        />
      </Sider>

      <Layout>
        <Content
          style={{
            margin: "28px 30px",
            padding: 50,
            minHeight: 1440,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
