import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';

const API_URL = process.env.REACT_APP_API_URL;

const ResetPassword = () => {
  const { token } = useParams();
  const [form] = Form.useForm();
  const [messageText, setMessageText] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      const values = await form.validateFields();

      if (values.newPassword !== values.confirmPassword) {
        message.error('Passwords do not match');
        return;
      }

      const response = await fetch(`${API_URL}/api/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword: values.newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessageText(data.message);
        navigate('/login');
        message.success(data.message);
      } else {
        setMessageText(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Thay đổi mật khẩu</h2>
      <Form form={form} layout="vertical" >
        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[
            { required: true, message: 'Nhập mật khẩu để thay đổi' },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Xác nhận mật khẩu' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('Mật khẩu xác nhận không trùng khớp!');
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" block onClick={handleResetPassword}>
            Xác nhận
          </Button>
        </Form.Item>
      </Form>
      {messageText && <p style={{ textAlign: 'center', color: 'red' }}>{messageText}</p>}
    </div>
  );
};

export default ResetPassword;
