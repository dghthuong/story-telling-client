import React, { useState } from "react";
import { Input, Button, Form, Row, Col, Typography, message } from "antd";

const API_URL = process.env.REACT_APP_API_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [messageText, setMessageText] = useState("");
  const handleForgotPassword = async () => {
    try {
      const response = await fetch(`${API_URL}/api/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessageText(
          "Thực hiện thay đổi mật khẩu thành công! Kiểm tra Email của bạn"
        );
        message.success(
          "Thực hiện thay đổi mật khẩu thành công! Kiểm tra Email của bạn"
        );
      } else {
        message.error(
          "Tài khoản Email không được sử dụng để đăng ký tài khoản"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Hệ thống đang bận! Vui lòng thử lại sau!");
    }
  };

  return (
    <div>
      <Row justify="center" style={{ minHeight: "100vh" }}>
        <Col xs={20} sm={16} md={10} lg={8} xl={6}>
          <Form layout="vertical" style={{ textAlign: "center" }}>
            <Typography.Title level={2}>Quên mật khẩu</Typography.Title>
            <Form.Item label="Email:">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleForgotPassword}>
                Gửi Email
              </Button>

            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default ForgotPassword;
