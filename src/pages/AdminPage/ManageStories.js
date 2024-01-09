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
  EyeInvisibleOutlined,
  EyeOutlined,
  DeleteFilled,
  SlidersFilled,
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

import "./css/ManageStories.css";

const API_URL = process.env.REACT_APP_API_URL;

const ManageStories = () => {
  const [stories, setStories] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [editingStoryId, setEditingStoryId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingStoryId, setGeneratingStoryId] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    if (genres.length > 0) {
      fetchStories();
    }
  }, [genres]);

  const fetchStories = async () => {
    const fetchedStories = await getAllStories();
    const genreMap = new Map();
    genres.forEach((genre) => {
      genreMap.set(genre._id, genre.name);
    });

    const storiesWithGenreName = fetchedStories.map((story) => ({
      ...story,
      genre: genreMap.get(story.genre),
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
      message.success("Story active state updated.");
      fetchStories(); // Refresh the list to show the updated state
    } catch (error) {
      console.error("Error toggling active state:", error);
      message.error("Failed to update active state.");
    }
  };

  const editStory = (storyId) => {
    const storyToEdit = stories.find((story) => story._id === storyId);
   
    if (storyToEdit) {
      const genreValue = {
        value: storyToEdit.genre._id,
        label: storyToEdit.genre,
      };

      form.setFieldsValue({
        title: storyToEdit.title,
        description: storyToEdit.description,
        author: storyToEdit.author,
        genre: genreValue,
      });
      setImagePreview(`${API_URL}/${storyToEdit.imageUrl}`);
      setIsModalOpen(true);
      setEditingStoryId(storyId);
    }
  };

  //API Generated:
  const generateAudio = async (sessionId, text) => {
    const response = await axios.post(
      "https://research.vinbase.ai/voiceclone/infer",
      {
        session: sessionId,
        text: text,
        pitch: 1,
        speed: 1.0,
        lang: "vi",
      },
      {
        headers: {
          Authorization: "Basic c3BlZWNoX29vdjo0RDYkJiU5cWVFaHZSVGVS",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.infer_status) {
      return response.data.full_audio;
    } else {
      throw new Error("Audio generation failed");
    }
  };

  const retrieveAudio = async (audioPath) => {
    const response = await axios.get(
      `https://research.vinbase.ai/voiceclone/getaudio?filename=${audioPath}`,
      {
        headers: {
          Authorization: "Basic c3BlZWNoX29vdjo0RDYkJiU5cWVFaHZSVGVS",
        },
        responseType: "blob",
      }
    );

    return URL.createObjectURL(response.data);
  };

  // const generateAndSaveStory = async (storyId, description) => {
  //   const handleOk = async () => {
  //     setConfirmLoading(false); 
  //     try {
  //       // Thay đổi 'voiceId' và 'sessionId' theo nhu cầu
  //       setGeneratingStoryId(storyId);

  //       const sessionId = "1234";

  //       const audioPath = await generateAudio(sessionId, description);
  //       const audioUrl = await retrieveAudio(audioPath);

  //       const response = await fetch(audioUrl);
  //       const audioBlob = await response.blob();

  //       const formData = new FormData();
  //       formData.append("audioFile", audioBlob, `${storyId}.wav`);

  //       const uploadResponse = await axios.post(
  //         `${API_URL}/api/stories/${storyId}/upload-default`, // Đường dẫn API có thể khác
  //         formData,
  //         { headers: { "Content-Type": "multipart/form-data" } }
  //       );

  //       if (uploadResponse.status === 200) {
  //         message.success("Story audio generated and saved successfully.");
  //         fetchStories(); // Cập nhật danh sách câu chuyện
  //       } else {
  //         message.error("Failed to save the generated story audio.");
  //       }
  //     } catch (error) {
  //       console.error("Error in generating story audio:", error);
  //       message.error("Failed to generate story audio.");
  //     } finally {
  //       setGeneratingStoryId(null);
  //       setConfirmLoading(true);  // Quá trình hoàn thành, đặt lại loading state

  //     }
  //   };

  //   Modal.confirm({
  //     title: "Bạn có muốn tạo âm thanh cho câu chuyện này không?",
  //     onOk: handleOk,
  //     okText: "Xác nhận",
  //     cancelText: "Huỷ",
  //     confirmLoading: confirmLoading,
  //   });
  // };


  const generateAndSaveStory = async (storyId, description) => {
    const handleOk = async () => {
      // Không cần thiết lập confirmLoading ở đây nếu bạn không muốn nút hiển thị loading
      try {
        // Thay đổi 'voiceId' và 'sessionId' theo nhu cầu
        setGeneratingStoryId(storyId);
  
        const sessionId = "1234";
        const audioPath = await generateAudio(sessionId, description);
        const audioUrl = await retrieveAudio(audioPath);
  
        const response = await fetch(audioUrl);
        const audioBlob = await response.blob();
  
        const formData = new FormData();
        formData.append("audioFile", audioBlob, `${storyId}.wav`);
  
        const uploadResponse = await axios.post(
          `${API_URL}/api/stories/${storyId}/upload-default`, // Đường dẫn API có thể khác
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
  
        if (uploadResponse.status === 200) {
          message.success("Story audio generated and saved successfully.");
          fetchStories(); // Cập nhật danh sách câu chuyện
        } else {
          message.error("Failed to save the generated story audio.");
        }
      } catch (error) {
        console.error("Error in generating story audio:", error);
        message.error("Failed to generate story audio.");
      } finally {
        setGeneratingStoryId(null);
      }
    };
  
    Modal.confirm({
      title: "Bạn có muốn tạo âm thanh cho câu chuyện này không?",
      okText: "Xác nhận",
      cancelText: "Huỷ",
      onOk: () => {
        handleOk(); // Gọi hàm không đồng bộ mà không chờ đợi kết quả của nó
      },

      // Bỏ trạng thái loading ở đây nếu bạn không muốn nút hiển thị loading
    });
  };
  
  const handleAddOrUpdateStory = async () => {
    try {
      const values = await form.validateFields();
      values.genre = values.genre.value;
      const formData = new FormData();

      // Thêm các trường dữ liệu text vào formData
      for (const [key, value] of Object.entries(values)) {
        if (key !== "imageUrl" && key !== "defaultVoice") {
          formData.append(
            key,
            value instanceof Array ? value.join(",") : value
          );
        }
      }

      // Thêm file ảnh vào formData nếu có
      const imageField = form.getFieldValue("imageUrl");
      if (imageField && imageField.fileList.length > 0) {
        // Chỉ lấy file cuối cùng trong danh sách nếu có nhiều file được chọn
        const file =
          imageField.fileList[imageField.fileList.length - 1].originFileObj;
        formData.append("imageUrl", file);
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
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có chắc chắn muốn xóa câu chuyện này không?",
      okText: "Có",
      cancelText: "Không",
      onOk: async () => {
        try {
          await deleteStory(storyId);
          message.success("Câu chuyện đã được xóa.");
          fetchStories(); // Refresh the list after deletion
        } catch (error) {
          console.error("Error deleting story:", error);
          message.error("Không thể xóa câu chuyện.");
        }
      },
    });
  };

  const renderAction = (text, record) => {
    const isLoading = generatingStoryId === record._id;

    return (
      <>
        <Button
          onClick={() => editStory(record._id)}
          style={{ marginLeft: 8, color: "#FFFFFF", background: "#F19E3D" }}
        >
          <EditOutlined />
        </Button>
        <Button
          style={{ marginLeft: 8,color: "#ffFFFF", background: "#ff0000" }}
          onClick={() => removeStory(record._id)}
        >
          <DeleteFilled />
        </Button>

        <Button
          onClick={() => toggleActiveState(record._id, record.isActive)}
          style={{ marginLeft: 8, color: "#FFFFFF", background: "#5865F2" }}
        >
          {record.isActive ? <EyeOutlined /> : <EyeInvisibleOutlined />}
        </Button>
        <Button
          onClick={() => generateAndSaveStory(record._id, record.description)}
          style={{ marginLeft: 8, color: "#ffffff", background: "#029FAE" }}
          loading={isLoading}
        >
          <SlidersFilled />
        </Button>
      </>
    );
  };

  const columns = [
    {
      title: "Tên truyện",
      dataIndex: "title",
    },
    {
      title: "Tác giả",
      dataIndex: "author",
    },
    {
      title: "Thể loại",
      dataIndex: "genre",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (isActive ? "Hiển thị" : "Ẩn"),
    },
    {
      title: "Hành động",
      render: renderAction,
    },
  ];

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    const isLessThan5MB = file.size / 1024 / 1024 < 5;

    if (isJpgOrPng && isLessThan5MB) {
      return true;
    } else {
      message.error("Hình ảnh không vượt quá 5MB");
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
      <h1>Quản lý câu chuyện</h1>
      <Button
        className="manageStories-btn"
        onClick={() => setIsModalOpen(true)}
      >
        <PlusSquareOutlined /> Thêm câu truyện
      </Button>
      <h1> </h1>
      <Table columns={columns} dataSource={stories} />

      <Modal
        title={editingStoryId ? "Chỉnh sửa câu chuyện" : "Tạo mới câu chuyện"}
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
          <Form.Item
            name="title"
            label="Tên truyện"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Nội dung">
            <Input.TextArea autoSize={{ minRows: 5, maxRows: 8 }} />
          </Form.Item>
          <Form.Item name="author" label="Tác giả" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          {/* <Form.Item name="genre" label="Thể loại" rules={[{ required: true }]}>
           
            <Select placeholder="Chọn thể loại">
              {genres.map((genre) => (
                <Select.Option key={genre._id} value={genre._id}>
                  {genre.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item> */}
          <Form.Item name="genre" label="Thể loại" rules={[{ required: true }]}>
            <Select labelInValue placeholder="Chọn thể loại">
              {genres.map((genre) => (
                <Select.Option key={genre._id} value={genre._id}>
                  {genre.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="imageUrl" label="Hình ảnh">
            <Upload
              listType="picture-card"
              customRequest={dummyRequest}
              beforeUpload={beforeUpload}
              onChange={handleImageChange}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: "100%", marginTop: "10px" }}
                />
              ) : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageStories;
