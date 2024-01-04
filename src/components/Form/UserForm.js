import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Form, Input, Button, Select } from "antd";

const UserForm = forwardRef(({ initialUserData, onSubmit }, ref) => {
  const [formData, setFormData] = useState(
    initialUserData || { email: "", name: "", role: "user" }
  );

  useEffect(() => {
    setFormData(initialUserData || { email: "", name: "", role: "user" });
  }, [initialUserData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
  }));

  return (
    <Form>
      <Form.Item label="Email">
        <Input name="email" value={formData.email} onChange={handleChange} />
      </Form.Item>

      <Form.Item label="Password">
        <Input name="password" value={formData.password} onChange={handleChange} />
      </Form.Item>
      <Form.Item label="Name">
        <Input name="name" value={formData.name} onChange={handleChange} />
      </Form.Item>
      <Form.Item label="Role">
        <Select
          name="role"
          value={formData.role}
          onChange={(value) => setFormData({ ...formData, role: value })}
        >
          <Select.Option value="user">User</Select.Option>
          <Select.Option value="admin">Admin</Select.Option>
          {/* Add other roles as necessary */}
        </Select>
      </Form.Item>
    </Form>
  );
});

export default UserForm;
