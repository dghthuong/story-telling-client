import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  getAllStories,
  addStory,
  updateStory,
  deleteStory,
} from "../../pages/StoriesPage/StoriesAPI";
import {
  PlusSquareOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
} from "antd";

const API_URL = "http://localhost:8000"; // Adjust this to your API base URL

const ManageStories = () => {
  const [stories, setStories] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [editingStoryId, setEditingStoryId] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchStories();
    fetchGenres();
  }, []);

  const fetchStories = async () => {
    const fetchedStories = await getAllStories();
  
    const genreMap = new Map();
    genres.forEach(genre => {
      genreMap.set(genre._id, genre.name);
    });
  
    const storiesWithGenreName = fetchedStories.map(story => ({
      ...story,
      genre: genreMap.get(story.genre) || '', 
    }));
  
    setStories(storiesWithGenreName);
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/getAll-genre`);
      setGenres(response.data);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };
  
  const toggleActiveState = async (storyId, currentState) => {
    try {
      await axios.patch(`${API_URL}/api/stories/${storyId}/toggle-active`, {
        isActive: !currentState,
      });
      message.success('Story active state updated.');
      fetchStories(); // Refresh the list to show the updated state
    } catch (error) {
      console.error('Error toggling active state:', error);
      message.error('Failed to update active state.');
    }
  };

  const editStory = (storyId) => {
    const storyToEdit = stories.find((story) => story._id === storyId);
    if (storyToEdit) {
      form.setFieldsValue({
        title: storyToEdit.title,
        author: storyToEdit.author,
        genre: storyToEdit.genre,
        imageUrl: storyToEdit.imageUrl, // Uncomment if imageUrl is part of the data
      });
      setImagePreview(storyToEdit.imageUrl); // Set image preview if available
      setIsModalOpen(true);
      setEditingStoryId(storyId);
    }
  };

  const handleAddOrUpdateStory = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
    
      // Thêm các trường dữ liệu text vào formData
      for (const [key, value] of Object.entries(values)) {
        if (key !== 'imageUrl') {
          formData.append(key, value instanceof Array ? value.join(',') : value);
        }
      }
    
      // Thêm file ảnh vào formData nếu có
      const imageField = form.getFieldValue('imageUrl');
      if (imageField && imageField.fileList.length > 0) {
        // Chỉ lấy file cuối cùng trong danh sách nếu có nhiều file được chọn
        const file = imageField.fileList[imageField.fileList.length - 1].originFileObj;
        formData.append('imageUrl', file);
      }
    
      if (editingStoryId) {
        await updateStory(editingStoryId, formData); // Chắc chắn rằng API có thể xử lý formData
      } else {
        await addStory(formData); // Chắc chắn rằng API có thể xử lý formData
      }
    
      // Reset form và state sau khi hoàn thành
      form.resetFields();
      setImagePreview("");
      setIsModalOpen(false);
      fetchStories();
      setEditingStoryId(null);
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };
  
  

  const removeStory = async (storyId) => {
    try {
      await deleteStory(storyId);
      fetchStories(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  const renderAction = (text, record) => {
    return (
      <>
        <Button
          onClick={() => editStory(record._id)}
          style={{ marginRight: 8 }}
        >
          <EditOutlined />
        </Button>
        <Button onClick={() => removeStory(record._id)}>
          <DeleteOutlined />
        </Button>

        <Button
        onClick={() => toggleActiveState(record._id, record.isActive)}
        style={{ marginLeft: 8 }}
      >
        {record.isActive ? 'Deactivate' : 'Activate'}
      </Button>
      </>
    );
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Author",
      dataIndex: "author",
    },
    {
      title: "Genre",
      dataIndex: "genre",
  
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: isActive => isActive ? 'Active' : 'Inactive',
    },
    {
      title: "Action",
      render: renderAction,
    },

  ];

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    const isLessThan5MB = file.size / 1024 / 1024 < 5; // less than 5MB

    if (isJpgOrPng && isLessThan5MB) {
      return true;
    } else {
      message.error("You can only upload JPG/PNG images less than 5MB.");
      return false;
    }
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
      // You need to replace this with actual upload logic
      // and set the image URL using the response from the server
    }, 0);
  };

  const handleImageChange = (info) => {
    if (info.file.status === "done") {
      const fileUrl = URL.createObjectURL(info.file.originFileObj);
      setImagePreview(fileUrl);
    }
  };

  const handleAddStory = async () => {
    try {
      const values = await form.validateFields();
      await addStory(values);
      form.resetFields();
      setIsModalOpen(false);
      fetchStories(); // Refresh the list after adding
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };

  return (
    <div style={{ textAlign: "left" }}>
      <h1>Manage Stories</h1>
      <Button
        style={{ height: "50px", width: "50px", borderRadius: "8px" }}
        onClick={() => setIsModalOpen(true)}
      >
        <PlusSquareOutlined />
      </Button>
      <Table columns={columns} dataSource={stories} />

      <Modal
        title={editingStoryId ? "Edit Story" : "Create New Story"}
        open={isModalOpen}
        onOk={handleAddOrUpdateStory}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setImagePreview("");
          setEditingStoryId(null);
        }}
      >
        <Form form={form} layout="vertical">
          {/* Form fields for title, author, genre */}
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
          <Form.Item name="author" label="Author" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="genre" label="Genre" rules={[{ required: true }]}>
            <Select placeholder="Select a genre">
              {genres.map((genre) => (
                <Select.Option key={genre._id} value={genre._id}>
                  {genre.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Image Upload */}
          <Form.Item name="imageUrl" label="Image URL">
            <Upload
              listType="picture-card"
              customRequest={dummyRequest}
              beforeUpload={beforeUpload}
              onChange={handleImageChange}
            >
              {imagePreview ? null : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: "100%", marginTop: "10px" }}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageStories;
