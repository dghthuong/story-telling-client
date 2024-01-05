import React, { useState, useEffect } from "react";
import { Select, message, Button, Table, Modal } from "antd";
import {DeleteOutlined } from '@ant-design/icons'
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const AudioList = () => {
  const [audios, setAudios] = useState([]);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const userId = localStorage.getItem("id");
  useEffect(() => {
    const fetchAudios = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/audio/list/${userId}`
        );
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
      title: 'Are you sure you want to delete this audio?',
      content: 'This action cannot be undone',
      okText: 'Yes, delete it',
      cancelText: 'No, keep it',
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
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Play",
      key: "play",
      render: (_, record) =>
        record.recordings?.map((recording, index) => (
          <audio
            key={index}
            src={`${API_URL}/${recording.url}`}
            controls
          />
        )),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="danger" onClick={() => deleteAudio(record._id)}>
          {<DeleteOutlined/>}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div>
        <div style={{margin:'Left'}}>
          <h2 style={{textAlign:'Left'}}>Manage Voices</h2>
          <Table columns={columns} dataSource={audios} rowKey="_id" />
        </div>
      </div>
    </div>
  );
};

export default AudioList;
