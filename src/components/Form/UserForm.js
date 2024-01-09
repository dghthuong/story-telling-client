// import React, {
//   useState,
//   useEffect,
//   useImperativeHandle,
//   forwardRef,
// } from "react";
// import { Form, Input, Button, Select } from "antd";

// const UserForm = forwardRef(({ initialUserData, onSubmit }, ref) => {
//   const [form] = Form.useForm();
//   const [formData, setFormData] = useState(
//     initialUserData || { email: "", name: "", role: "user" }
//   );

//   useEffect(() => {
//     // Cập nhật formData khi initialUserData thay đổi
//     if (initialUserData) {
//       setFormData({
//         email: initialUserData.email || '',
//         name: initialUserData.name || '',
//         role: initialUserData.role || 'user',
//         // Thêm các trường khác nếu cần
//       });
//     }
//   }, [initialUserData]);
  

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleSubmit = () => {
//     onSubmit(formData);
//   };

//   // useImperativeHandle(ref, () => ({
//   //   submit: handleSubmit,
//   // }));
//   useImperativeHandle(ref, () => ({
//     submit: () => form.submit(), // Gọi form.submit() thay vì handleSubmit
//   }));

//   return (
//     <Form layout="vertical" form={form} onFinish={handleSubmit}>
//       <Form.Item label="Email" rule={[{ required: true, message: 'Vui lòng nhập email của bạn!' }]} >
//         <Input name="email" value={formData.email} onChange={handleChange} />
//       </Form.Item>
//     {/* <Form.Item
//         label="Email"
//         // name = "email"
//         rules={[{ required: true, message: "Vui lòng nhập email của bạn!" }]}
//       >
//         <Input name="email" value={formData.email} onChange={handleChange} />
//       </Form.Item> */}

//       <Form.Item label="Mật khẩu">
//         <Input name="password" value={formData.password} onChange={handleChange} />
//       </Form.Item>
//       <Form.Item label="Tên">
//         <Input name="name" value={formData.name} onChange={handleChange} />
//       </Form.Item>
//       <Form.Item label="Vai trò">
//         <Select
//           name="role"
//           value={formData.role}
//           onChange={(value) => setFormData({ ...formData, role: value })}
//         >
//           <Select.Option value="user">User</Select.Option>
//           <Select.Option value="admin">Admin</Select.Option>
//           {/* Add other roles as necessary */}
//         </Select>
//       </Form.Item>
//     </Form>
//     // <Form layout="vertical" form={form} onFinish={handleSubmit}>
//     //   <Form.Item
//     //     label="Email"
//     //     name="email"
//     //     rules={[{ required: true, message: "Vui lòng nhập email của bạn!" }]}
//     //   >
//     //     <Input name="email" value={formData.email} onChange={handleChange} />
//     //   </Form.Item>

//     //   <Form.Item
//     //     label="Mật khẩu"
//     //     name="password"
//     //     rules={[{ required: true, message: "Vui lòng nhập mật khẩu của bạn!" }]}
//     //   >
//     //     <Input.Password
//     //       name="password"
//     //       value={formData.password}
//     //       onChange={handleChange}
//     //     />
//     //   </Form.Item>

//     //   <Form.Item
//     //     label="Tên"
//     //     name="name"
//     //     rules={[{ required: true, message: "Vui lòng nhập tên của bạn!" }]}
//     //   >
//     //     <Input name="name" value={formData.name} onChange={handleChange} />
//     //   </Form.Item>

//     //   <Form.Item
//     //     label="Vai trò"
//     //     name="role"
//     //     rules={[{ required: true, message: "Vui lòng chọn vai trò của bạn!" }]}
//     //   >
//     //     <Select
//     //       value={formData.role}
//     //       onChange={(value) => setFormData({ ...formData, role: value })}
//     //     >
//     //       <Select.Option value="user">User</Select.Option>
//     //       <Select.Option value="admin">Admin</Select.Option>
//     //       {/* Add other roles as necessary */}
//     //     </Select>
//     //   </Form.Item>
//     // </Form>
//   );
// });

// export default UserForm;


import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Form, Input, Button, Select, message } from "antd";

const UserForm = forwardRef(({ initialUserData, onSubmit, isEditing }, ref) => {
  const [form] = Form.useForm();

  // Sử dụng useEffect để đặt lại các trường của form khi initialUserData thay đổi
  useEffect(() => {
    if (isEditing && initialUserData) {
      // Đang trong trạng thái chỉnh sửa, cập nhật form với dữ liệu sẵn có
      form.setFieldsValue({
        email: initialUserData.email,
        name: initialUserData.name,
        role: initialUserData.role,
        // Thêm các trường khác nếu cần
      });
    } else {
      // Đang thêm mới, đặt tất cả các trường là trống
      form.resetFields();
    }
  }, [form, initialUserData, isEditing]);

  const handleSubmit = (values) => {
    if (isEditing) {
      onSubmit({ ...initialUserData, ...values });
    } else {
      // Đảm bảo rằng tất cả các trường đều không trống khi thêm mới
      if (!values.email || !values.name || !values.role) {
        message.error("Please fill all the fields.");
        return;
      }
      onSubmit(values);
    }
  };

  // useImperativeHandle(ref, () => ({
  //   submit: () => form.submit(),
  // }));
  useImperativeHandle(ref, () => ({
    submit: () => form.submit(),
    resetForm: () => form.resetFields(), // Thêm phương thức này để reset form từ bên ngoài
  }));
  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleSubmit}
      initialValues={{
        email: '',
        name: '',
        role: 'user',
        // Set other fields to default values if necessary
      }}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: !isEditing, message: "Vui lòng nhập email của bạn!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[{ required: !isEditing, message: "Vui lòng nhập mật khẩu của bạn!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Tên"
        name="name"
        rules={[{ required: !isEditing, message: "Vui lòng nhập tên của bạn!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Vai trò"
        name="role"
        rules={[{ required: !isEditing, message: "Vui lòng chọn vai trò của bạn!" }]}
      >
        <Select>
          <Select.Option value="user">User</Select.Option>
          <Select.Option value="admin">Admin</Select.Option>
          {/* Add other roles as necessary */}
        </Select>
      </Form.Item>
    </Form>
  );
});

export default UserForm;
