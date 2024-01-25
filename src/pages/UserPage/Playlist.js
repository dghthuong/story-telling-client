import React, { useState, useEffect, useCallback, useRef } from "react";
import { Table, Button, Modal, Tooltip, message } from "antd";
import {
  PlayCircleFilled,
  DeleteOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import QRCode from "qrcode.react";
import "./css/Playlist.css";

const API_URL = process.env.REACT_APP_API_URL;

const PlaylistPage = () => {
  const [playlistData, setPlaylistData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState("");
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();
  const [voiceTitle, setVoiceTitle] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  const { userId } = useParams();
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        const playlistResponse = await axios.get(
          `${API_URL}/api/playlist/${userId}`
        );
        if (
          playlistResponse.data &&
          Array.isArray(playlistResponse.data.playlist)
        ) {
          const playlistItems = playlistResponse.data.playlist;

          const currentUserId = localStorage.getItem("id");
          setIsOwner(userId === currentUserId);
          const processedItems = playlistItems.map(async (item) => {
            if (item.voiceId === "" || item.voiceTitle === "Default") {
              const storyResponse = await axios.get(
                `${API_URL}/api/get-stories/${item.storyId}`
              );
              const storyData = storyResponse.data;
              return {
                key: `${item.storyId}__default`,
                title: storyData.title,
                imageUrl: storyData.imageUrl
                  ? `${API_URL}/${storyData.imageUrl}`
                  : null,
                narrator: "Default Voice",
                audioUrl: storyData.generatedVoice
                  ? `${API_URL}/${storyData.generatedVoice}`
                  : "", //
              };
            } else {
              const storyResponse = await axios.get(
                `${API_URL}/api/get-stories/${item.storyId}`
              );
              const storyData = storyResponse.data;
              const voice = storyData.userVoices.find(
                (v) => v.voiceId === item.voiceId
              );
              return voice
                ? {
                    key: `${item.storyId}__${item.voiceId}`,
                    title: storyData.title,
                    imageUrl: storyData.imageUrl
                      ? `${API_URL}/${storyData.imageUrl}`
                      : null,
                    narrator: voice.narrator,
                    audioUrl: `${API_URL}/${voice.audioUrl}`, // Đường dẫn âm thanh cụ thể
                  }
                : null;
            }
          });

          const allItems = await Promise.all(processedItems);
          setPlaylistData(allItems.filter((v) => v !== null));
        }
      } catch (error) {
        console.error("Error fetching playlist data:", error);
      }
    };

    fetchPlaylistData();
  }, [userId]);

  const VoiceColumn = ({ voiceId }) => {
    const [voiceTitle, setVoiceTitle] = useState("Loading...");

    useEffect(() => {
      const fetchVoiceTitle = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/audio/${voiceId}`);
          if (response.data && response.data.length > 0) {
            setVoiceTitle(response.data[0].title);
          } else {
            setVoiceTitle("Default");
          }
        } catch (error) {
          console.error("Error fetching voice data:", error);
          setVoiceTitle("N/A");
        }
      };

      fetchVoiceTitle();
    }, [voiceId]);

    return <span>{voiceTitle}</span>;
  };

  const handleRemoveFromPlaylist = async (combinedKey) => {
    const [storyId, voiceId] = combinedKey.split("__");

    // Xác định xem đây có phải là giọng đọc mặc định không
    const isDefaultVoice = voiceId === "default";

    Modal.confirm({
      title: "Bạn có chắc muốn xoá bài này khỏi Danh sách phát?",
      content: " Hành động sẽ được tiếp tục",
      okText: "Xác nhận",
      cancelText: "Huỷ",
      onOk: async () => {
        try {
          let response;
          if (isDefaultVoice) {
            // Gửi request xoá cho giọng đọc mặc định
            response = await axios.delete(
              `${API_URL}/api/playlist/${userId}/remove-default/${storyId}`
            );
            message.success("Câu chuyện được xóa thành công!");
          } else {
            response = await axios.delete(
              `${API_URL}/api/playlist/${userId}/remove/${storyId}/${voiceId}`
            );
            message.success("Câu chuyện được xóa thành công!");
          }

          if (response.status === 200) {
            setPlaylistData((prevPlaylistData) =>
              prevPlaylistData.filter((item) => item.key !== combinedKey)
            );
          } else {
            console.error("Failed to remove item from playlist");
            message.error("Câu chuyện được xóa không thành công!");
          }
        } catch (error) {
          console.error("Error removing item from playlist:", error);
        }
      },
    });
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl) =>
        imageUrl ? (
          <img src={imageUrl} alt="Story" style={{ maxWidth: "50px" }} />
        ) : (
          "No image"
        ),
    },

    {
      title: "Tên truyện",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Giọng đọc",
      dataIndex: "voiceId",
      key: "voiceId",
      render: (_, record) => {
        const [storyId, voiceId] = record.key.split("__");
        console.log(`storyId: ${storyId}, voiceId: ${voiceId}`);
        return <VoiceColumn voiceId={voiceId} />;
      },
    },

    {
      title: "Hành động",
      key: "action",
      render: (_, record) => {
        const [storyId, voiceId] = record.key.split("__");
        //console.log(`storyId: ${storyId}, voiceId: ${voiceId}`);
        return (
          <>
            <Tooltip title="Play Audio">
              <Button
                style={{ color: "#ffffff", background: "#5865F2" }}
                onClick={() => playAudio(record.audioUrl)}
              >
                <PlayCircleFilled />
              </Button>
            </Tooltip>

            {isOwner && (
              <Tooltip title="Remove from Playlist">
                <Button
                  onClick={() => handleRemoveFromPlaylist(record.key)}
                  style={{
                    marginLeft: 8,
                    color: "#ffffff",
                    background: "#ff0000",
                  }}
                >
                  <DeleteFilled />
                </Button>
              </Tooltip>
            )}
          </>
        );
      },
    },
  ];

  useEffect(() => {
    if (isModalVisible && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  }, [isModalVisible, currentAudioUrl]);

  const playAudio = useCallback((audioUrl) => {
    console.log(`Trying to play audio from URL: ${audioUrl}`);
    setCurrentAudioUrl(audioUrl);
    setIsModalVisible(true);
  }, []);

  // const handleModalClose = () => {
  //   if (currentAudioUrl.current) {
  //     currentAudioUrl.current.pause();
  //     currentAudioUrl.current.currentTime = 0;
  //   }
  //   if (audioRef.current) {
  //     audioRef.current.pause();
  // }
  //   setIsModalVisible(false);
  // };

  const handleModalClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsModalVisible(false);
  };

  return (
    // <div className="playlist-container" style={{ margin: "50px 100px 0px 105px" }}>
    //   <h2 style={{ textAlign: "Left" ,color: '#029FAE'}}> Danh sách phát</h2>
    //   <Table dataSource={playlistData} columns={columns} />

    //   <Modal
    //     key={currentAudioUrl}
    //     title="Phát câu chuyện"
    //     visible={isModalVisible}
    //     onOk={() => setIsModalVisible(false)}
    //     onCancel={handleModalClose}
    //     footer= ""
    //   >
    //     <div style={{textAlign:'center'}}>
    //     <audio controls autoPlay ref={audioRef}>
    //       <source src={currentAudioUrl} type="audio/mpeg" />
    //       Your browser does not support the audio element.
    //     </audio>
    //     </div>
    //   </Modal>
    //   <h3>SCAN QR CODE</h3>
    //   <QRCode value={window.location.href} size={128} level={"H"} />
    //   <h3> Hãy chia sẽ Playlist của bạn</h3>
    // </div>

    <div className="playlist-container">
      <h2 className="playlist-title">Danh sách phát</h2>
      <Table
        dataSource={playlistData}
        columns={columns}
        className="playlist-table"
        pagination={{ pageSize: 3 }}
      />

      {/* ... Rest of your component code */}
      <Modal
        key={currentAudioUrl}
        title="Phát câu chuyện"
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={handleModalClose}
        footer=""
      >
        <div style={{ textAlign: "center" }}>
          <audio controls autoPlay ref={audioRef}>
            <source src={currentAudioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </Modal>

      <div className="qr-code-section">
        <h3>SCAN QR CODE</h3>
        <QRCode value={window.location.href} size={128} level={"H"} />
        <h3 className="share-playlist-text">Hãy chia sẻ Playlist của bạn</h3>
      </div>
    </div>
  );
};

export default PlaylistPage;
