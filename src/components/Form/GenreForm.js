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
        label="Tên thể loại"
        rules={[{ required: true, message: 'Tên thể loại là bắt buộc' }]}
      >
        <Input placeholder="Nhập tên thể loại" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Xác nhận
        </Button>
      </Form.Item>
    </Form>
  );
};

export default GenreForm;
