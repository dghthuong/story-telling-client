import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "antd";
import { PlayCircleFilled,DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import QRCode from "qrcode.react";

const PlaylistPage = () => {
  const [playlistData, setPlaylistData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState("");
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/playlist/${userId}`
        );
        // Assuming response.data.stories is the array of story objects
        const stories = response.data.stories || [];
        const formattedData = stories
          .map((story) => {
            // Find the userVoice for the current user
            const userVoice = story.userVoices.find(
              (voice) => voice.userId === userId
            );
            return {
              key: story._id,
              title: story.title,
              voice: userVoice ? userVoice.narrator : "N/A", // Fallback to 'N/A' if not found
              audioUrl: userVoice
                ? `http://localhost:8000/${userVoice.audioUrl}`
                : "", // Fallback to empty string if not found
            };
          })
          .filter((item) => item.audioUrl); // Filter out any items without an audio URL
        setPlaylistData(formattedData);
      } catch (error) {
        console.error("Error fetching playlist data:", error);
      }
    };

    fetchPlaylistData();
  }, [userId]);

  const handleRemoveFromPlaylist = async (storyId) => {
    Modal.confirm({
      title: 'Are you sure you want to remove this story from the playlist?',
      content: 'This action cannot be undone',
      okText: 'Yes, remove it',
      cancelText: 'No, keep it',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:8000/api/playlist/${userId}/${storyId}`);
  
          // Update the state to remove the story from the table
          setPlaylistData(playlistData.filter((story) => story.key !== storyId));
          console.log("Story removed from playlist");
        } catch (error) {
          console.error("Error removing story from playlist:", error);
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
      title: "Voice",
      dataIndex: "voice",
      key: "voice",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button onClick={() => playAudio(record.audioUrl)}>
            <PlayCircleFilled />
          </Button>

          <Button
            onClick={() => handleRemoveFromPlaylist(record.key)}
            style={{ marginLeft: 8 }}
          >
            <DeleteOutlined />
          </Button>
        </>
      ),
    },
  ];

  const playAudio = (audioUrl) => {
    console.log(`Trying to play audio from URL: ${audioUrl}`); // Debugging line
    setCurrentAudioUrl(audioUrl);
    setIsModalVisible(true);
  };

  // const playAudio = (storyId) => {
  //   // Sử dụng navigate để chuyển hướng đến trang PlayStories với ID của câu chuyện
  //   navigate(`/play-stories/${storyId}`);
  // };

  const handleShare = () => {
    setShowQR(true); // Hiển thị QR Code khi người dùng nhấn nút Chia Sẻ
  };

  return (
    <div style={{ margin: "0px 100px" }}>
      <h1>Playlist</h1>
      <Table dataSource={playlistData} columns={columns} />

      <Modal
        title="Audio Player"
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <audio controls autoPlay>
          <source src={currentAudioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </Modal>
      <h3>SCAN QR CODE</h3>
      <QRCode value={window.location.href} size={128} level={"H"} />
      <h3> Hãy chia sẽ Playlist của bạn</h3>
    </div>
  );
};

export default PlaylistPage;
