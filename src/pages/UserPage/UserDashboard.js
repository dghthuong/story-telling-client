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
import AudioRecorder from "./Voice";
import AudioList from "./ManageVoice";
import UserInfomation from "./UserInfomation";

const { Header, Sider, Content, Button } = Layout;

const UserPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [keySelect, setKeySelect] = useState("1");

  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);

  console.log(">> user: ", user);

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

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuSelect = ({ key }) => {
    setKeySelect(key);
  };

  const renderContent = () => {
    switch (keySelect) {
      case "1":
        return (
        <>
        <UserInfomation/>
        </>
        );
      case "2":
        return (
          <>
            <AudioRecorder />
          </>
        );
      case "3":
        return (<>
        <AudioList/>
        </>)
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
              label: "Account",
            },
            // {
            //   key: "2",
            //   icon: <VideoCameraOutlined />,
            //   label: "Voice",
            // },
            {
              key: "3",
              icon: <UploadOutlined />,
              label: "Manage Voice",
            },
            {
              key: "4",
              icon: <LogoutOutlined />,
              label: "Log out",
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

export default UserPage;
