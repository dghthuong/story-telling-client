import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Input, Button, Form, Typography, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import "./css/UserInfomation.css"; // Ensure you have corresponding CSS for styling

const { Text } = Typography;

const API_URL = process.env.REACT_APP_API_URL;

const UserInformation = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/${userId}`);
        setUserInfo(response.data);
        form.setFieldsValue(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchData();
  }, [userId, form]);

  const onFinish = async (values) => {
    try {
      await axios.put(`${API_URL}/api/update-user/${userId}`, values);
      setEditMode(false);
      setUserInfo(values);
      message.success("Cập nhật thông tin user thành công !");
    } catch (error) {
      message.error("Lỗi cập nhật thông tin!");
    }
  };

  return (
    <div className="user-information-container">
      <h1 style={{ marginLeft: "70px" }}>Thông tin người dùng</h1>
      <div style={{ textAlign: "left", marginLeft: "70px" }}></div>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className="custom-form"
      >
        <Row justify="left" gutter={25}>
          <Col span={8}>
            <Form.Item label="Tên" name="name">
              <Input
                className={!editMode ? "input-disabled" : ""}
                disabled={!editMode}
                value={userInfo.name}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Email" name="email">
              <Input
                className={!editMode ? "input-disabled" : ""}
                disabled={!editMode}
                value={userInfo.email}
              />
            </Form.Item>
          </Col>
          {!editMode && (
            <Button
              type="primary"
              onClick={() => setEditMode(true)}
              style={{
                marginBottom: "20px",
                marginLeft: "20px",
                marginTop: "34px",
                height: "48px",
              }}
            >
              <EditOutlined />
            </Button>
          )}
        </Row>

        <div style={{ display: "flex", justifyContent: "center" }}>
          {editMode && (
            <>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  marginLeft: "180px",
                  height: "40px",
                  marginTop: "20px",
                }}
              >
                Cập nhật
              </Button>
              <Button
                style={{
                  marginLeft: "20px", 
                  height: "40px",
                  marginTop: "20px",
                }}
                onClick={() => setEditMode(false)}
              >
                Huỷ
              </Button>
            </>
          )}
        </div>
      </Form>
    </div>
  );
};

export default UserInformation;
