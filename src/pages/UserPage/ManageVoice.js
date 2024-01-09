import React, { useState, useEffect } from "react";
import { Select, message, Button, Table, Modal } from "antd";
import { DeleteFilled, DeleteOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';

import AudioRecorder from "./Voice";
import axios from "axios";
import './css/ManageVoice.css'



const API_URL = process.env.REACT_APP_API_URL;

const AudioList = () => {
  const [audios, setAudios] = useState([]);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const userId = localStorage.getItem("id");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAudios = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/audio/list/${userId}`);
        setAudios(response.data);
        if (response.data.length > 0) {
          setSelectedAudio(response.data[0]._id); // Automatically select the first audio
        }
      } catch (error) {
        console.error("Error fetching audios: ", error);
      }
    };

    if (userId) {
      fetchAudios();
    }
  }, [userId]);


  const handleAudioChange = (event) => {
    setSelectedAudio(event.target.value);
  };

  const deleteAudio = async (audioId) => {
    Modal.confirm({
      title: "Bạn có chắc là muốn xoá giọng đọc này không?",
      content: "Việt này sẽ ảnh hưởng đến những câu chuyện khác",
      okText: "Xác nhận",
      cancelText: "Huỷ",
      onOk: async () => {
        try {
          await axios.delete(`${API_URL}/api/audio/${audioId}`);
          setAudios(audios.filter((audio) => audio._id !== audioId));
          message.success("Audio deleted successfully");
        } catch (error) {
          console.error("Error deleting audio: ", error);
          message.error("Failed to delete audio");
        }
      },
    });
  };

  const columns = [
    {
      title: "Tên giọng đọc",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Âm thanh",
      key: "play",
      render: (_, record) =>
        record.recordings?.map((recording, index) => (
          <audio key={index} src={`${API_URL}/${recording.url}`} controls />
        )),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Button  style={{background:'#ff0000', color:'#ffffff'}} onClick={() => deleteAudio(record._id)}>
          <DeleteFilled />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div>
        <div style={{ textAlign: "Left" }}>
          <h1 style={{ textAlign: "Left" }}>QUẢN LÝ GIỌNG ĐỌC</h1>
         <Button className = 'manageVoice-btn' onClick={() => navigate('/user/record')}><PlusSquareOutlined/>Thêm Giọng Đọc</Button>
          <h1></h1>
          <Table columns={columns} dataSource={audios} rowKey="_id" />
        </div>
      </div>
    </div>
  );
};

export default AudioList;
