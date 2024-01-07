import React, { useState, useEffect } from "react";
import axios from "axios";
import GenreForm from "../../components/Form/GenreForm";
import { Button, Table, Modal } from "antd";
import "./css/ManageGenre.css"
import { EditOutlined, DeleteOutlined, DeleteFilled } from "@ant-design/icons";
import {PlusSquareOutlined} from '@ant-design/icons'




const API_URL = process.env.REACT_APP_API_URL;

const ManageGenres = () => {
  const [genres, setGenres] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/getAll-genre`);
      setGenres(response.data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const handleEdit = (genre) => {
    setEditingGenre(genre);
    showModal();
  };

  const handleDelete = async (genreId) => {
    try {
      await axios.delete(`${API_URL}/api/delete-genre/${genreId}`);
      setGenres(genres.filter((genre) => genre._id !== genreId)); // Make sure you use the correct ID field
    } catch (error) {
      console.error('Error deleting genre:', error);
    }
  };

  const handleAdd = () => {
    setEditingGenre(null); // Ensure no genre is set for editing
    showModal();
  };

  const handleSave = async (genreData) => {
    if (editingGenre) {
      try {
        await axios.put(`${API_URL}/api/change-genre/${editingGenre._id}`, genreData);
        setGenres(genres.map((genre) =>
          genre._id === editingGenre._id ? { ...genre, ...genreData } : genre
        ));
      } catch (error) {
        console.error('Error updating genre:', error);
      }
    } else {
      try {
        const response = await axios.post(`${API_URL}/api/new-genre`, genreData);
        setGenres([...genres, response.data]);
      } catch (error) {
        console.error('Error adding genre:', error);
      }
    }
    setIsModalOpen(false);
  };

  const renderAction = (text, record) => (
    <>
      <Button style={{color: '#ffffff', background:'#F76B56'}} onClick={() => handleEdit(record)}>
        <EditOutlined />
      </Button>
      <Button onClick={() => handleDelete(record._id)} style={{ marginLeft: "10px",background: '#ff0000',color:'#ffffff'}}>
        <DeleteFilled />
      </Button>
    </>
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Action",
      key: "action",
      render: renderAction,
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div style={{textAlign:'Left'}}>
      <h1 style= {{textAlign:'Left'}} >Manage Genres</h1>
      <Button className="manageGenre-btn" onClick={handleAdd} >
      <PlusSquareOutlined /> Thêm thể loại
      </Button>
      <h2> </h2>
      <Table columns={columns} dataSource={genres.map((genre) => ({ ...genre, key: genre._id }))} />
      <Modal
        title={editingGenre ? "Edit Genre" : "Add New Genre"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <GenreForm genre={editingGenre} onSave={handleSave} />
      </Modal>
    </div>
  );
};

export default ManageGenres;
