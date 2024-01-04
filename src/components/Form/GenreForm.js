import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";

const GenreForm = ({ genre, onSave }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (genre) {
      form.setFieldsValue(genre);
    } else {
      form.resetFields();
    }
  }, [genre, form]);

  const handleSubmit = (values) => {
    onSave(values);
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        name="name"
        label="Genre Name"
        rules={[{ required: true, message: 'Please input the genre name' }]}
      >
        <Input placeholder="Enter genre name" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save Genre
        </Button>
      </Form.Item>
    </Form>
  );
};

export default GenreForm;
