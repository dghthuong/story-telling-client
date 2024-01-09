import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  getAllUsers,
  deactivateUser,
  createUser,
  updateUser,
  activateUser,
} from "./AdminAPI";
import {
  PlusSquareOutlined,
  LockOutlined,
  EditOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { Button, Table, Modal, message } from "antd";
import UserForm from "../../components/Form/UserForm";
import "./css/ManageUsers.css";

const ManageUsers = () => {
  const formRef = useRef(null);
  const [users, setUsers] = useState([]);
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const renderAction = (user) => {
    return (
      <>
        {user.status === "Kích hoạt" ? (
          <Button
            onClick={() => handleDeactiveUser(user.key)}
            style={{
              marginRight: "10px",
              color: "#ffffff",
              background: "#5865F2",
            }}
          >
            <UnlockOutlined />
          </Button>
        ) : (
          <Button
            onClick={() => handleActivateUser(user.key)}
            style={{
              marginRight: "10px",
              color: "#ffffff",
              background: "#5865F2",
            }}
          >
            <LockOutlined />
          </Button>
        )}

        <Button
          style={{
            marginRight: "10px",
            color: "#ffffff",
            background: "#F19E3D",
          }}
          onClick={() => handleEditUser(user)}
        >
          <EditOutlined />
        </Button>
      </>
    );
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "date",
    },
    {
      title: "Hành động",
      render: (_, record) => renderAction(record),
    },
  ];

  const handleDeactiveUser = (userId) => {
    deactivateUser(userId) // Assuming deactivateUser API needs a token
      .then(() => {
        LoadListUser();
      })
      .catch((error) => {
        console.error("Error deactivating user:", error);
      });
  };

  const handleActivateUser = (userId) => {
    activateUser(userId)
      .then(() => {
        LoadListUser();
      })
      .catch((error) => {
        console.error("Error activating user:", error);
      });
  };

  const LoadListUser = () => {
    getAllUsers(token).then((response) => {
      if (response.error) {
        console.log(response.error);
      } else {
        const transformedData = response.map((user) => ({
          key: user._id,
          name: user.name,
          role: user.role,
          email: user.email,
          status: user.active ? "Kích hoạt" : "Khoá",
          date: new Date(user.date).toLocaleDateString(),
        }));
        setUsers(transformedData);
      }
    });
  };

  useEffect(() => {
    LoadListUser();
  }, []);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  // const handleFormSubmit = (userData) => {
  //   if (editingUser) {
  //     updateUser(editingUser.key, userData, token)
  //       .then(() => {
  //         setEditingUser(null);
  //         LoadListUser();
  //       })
  //       .catch(error => console.error('Error updating user:', error));
  //   } else {
  //     createUser(userData, token)
  //       .then(() => LoadListUser())
  //       .catch(error => console.error('Error creating user:', error));
  //   }
  //   setIsModalOpen(false);
  // };

  const handleFormSubmit = (userData) => {
    const action = editingUser ? updateUser : createUser;
    const userId = editingUser ? editingUser.key : undefined;

    action(userId, userData, token)
      .then(() => {
        setIsModalOpen(false);
        setEditingUser(null); // Reset editingUser sau khi submit
        LoadListUser(); // Cập nhật danh sách người dùng
      })
      .catch((error) => {
        console.error("Error:", error);
        message.error(`Failed to ${editingUser ? "update" : "create"} user.`);
      });
  };

  const handleOk = () => {
    formRef.current.submit();
  };

  return (
    <div style={{ textAlign: "left" }}>
      <h1>Quản lý người dùng</h1>
      <Button className="manageUsers-btn" onClick={showModal}>
        <PlusSquareOutlined /> Thêm người dùng
      </Button>
      <h2> </h2>
      <Table columns={columns} dataSource={users} />
      {/* <Modal
      title={editingUser ? "Chỉnh sửa thông tin người dùng" : "Khởi tạo người dùng "}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={() => { setIsModalOpen(false); setEditingUser(null); }}
    > */}
      <Modal
        title={
          editingUser
            ? "Chỉnh sửa thông tin người dùng"
            : "Khởi tạo người dùng "
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {/* <UserForm 
        ref={formRef}
        initialUserData={editingUser} 
        onSubmit={handleFormSubmit} 
      /> */}
        <UserForm
          ref={formRef}
          initialUserData={editingUser}
          onSubmit={handleFormSubmit}
          isEditing={Boolean(editingUser)} // Thêm prop này để thông báo cho form về trạng thái
        />
      </Modal>
    </div>
  );
};

export default ManageUsers;
