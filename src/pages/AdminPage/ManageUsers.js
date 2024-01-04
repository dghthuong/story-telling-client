import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { getAllUsers, deactivateUser,createUser, updateUser,activateUser } from "./AdminAPI";
import { PlusSquareOutlined, LockOutlined, EditOutlined, UnlockOutlined } from "@ant-design/icons";
import { Button, Table, Modal } from "antd";
import UserForm from "../../components/Form/UserForm";

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
      {user.status === "Active" ? (
        <Button onClick={() => handleDeactiveUser(user.key)} style={{ marginRight: '10px' }}>
          <UnlockOutlined/>
        </Button>
      ) : (
        <Button onClick={() => handleActivateUser(user.key)} style={{ marginRight: '10px' }}>
           <LockOutlined/>
        </Button>
      )}

        <Button onClick={() => handleEditUser(user)}>
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
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Action",
      render: (_, record) => renderAction(record),
    },
  ];

  const handleDeactiveUser = (userId) => {
    deactivateUser(userId, token) // Assuming deactivateUser API needs a token
      .then(() => {
        LoadListUser(); // Refresh the list after deactivation
      })
      .catch(error => {
        console.error('Error deactivating user:', error);
      });
  };

  const handleActivateUser = (userId) => {
    activateUser(userId, token) 
      .then(() => {
        LoadListUser(); // Refresh the list after activation
      })
      .catch(error => {
        console.error('Error activating user:', error);
      });
  };
  
  const LoadListUser = () => {
    getAllUsers(token).then((response) => {
      if (response.error) {
        console.log(response.error);
      } else {
        const transformedData = response.map((user) => ({
          key: user._id,
          email: user.email,
          status: user.active ? "Active" : "Deactive",
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


  const handleFormSubmit = (userData) => {
    if (editingUser) {
      updateUser(editingUser.key, userData, token)
        .then(() => {
          setEditingUser(null);
          LoadListUser();
        })
        .catch(error => console.error('Error updating user:', error));
    } else {
      createUser(userData, token)
        .then(() => LoadListUser())
        .catch(error => console.error('Error creating user:', error));
    }
    setIsModalOpen(false);
  };


  const handleOk = () => {
    setIsModalOpen(false);
    formRef.current.submit();
  };

  return (
    <div style={{ textAlign: "left" }}>
    <h1>Manage Users</h1>
    <Button
      style={{ height: "50px", width: "50px", borderRadius: "8px" }}
      onClick={showModal}
    >
      <PlusSquareOutlined />
    </Button>
    <Table rowSelection={rowSelection} columns={columns} dataSource={users} />
    <Modal
      title={editingUser ? "Edit User" : "Create New User"}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={() => { setIsModalOpen(false); setEditingUser(null); }}
    >
      <UserForm 
        ref={formRef}
        initialUserData={editingUser} 
        onSubmit={handleFormSubmit} 
      />
    </Modal>
  </div>
  );
};

export default ManageUsers;
