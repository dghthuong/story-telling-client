import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/Wishlist.css"

import {
  Table,
  Button,
  message,
  Select,
  Progress,
  Tooltip,
  Modal,
  Input,
} from "antd";
import {
  PlayCircleOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  LoadingOutlined,
  PlayCircleFilled,
  SearchOutlined,
  DeleteFilled,
  SlidersFilled,
  SlidersOutlined,
} from "@ant-design/icons";
const { Option } = Select;

const API_URL = process.env.REACT_APP_API_URL;

message.config({
  top: 100,
  style: { marginLeft: "500px" },
  maxCount: 1,
  duration: 0.5,
});



const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [generatedStories, setGeneratedStories] = useState([]);
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const userId = localStorage.getItem("id");
  const [voices, setVoices] = useState([]);
  const [voiceSelections, setVoiceSelections] = useState({});
  const [voiceId, setVoiceId] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [voiceStatus, setVoiceStatus] = useState({});
  const [searchText, setSearchText] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleVoiceChange = (selectedVoice, storyId) => {
    setVoiceSelections((prevSelections) => ({
      ...prevSelections,
      [storyId]: selectedVoice,
    }));

    if (selectedVoice === "default") {
      const story = wishlist.find((s) => s._id === storyId);
      if (story && story.isGenerated && story.voiceGenerated) {
        addToPlaylist(storyId, story.voiceGenerated); // Thêm vào playlist với giọng đọc mặc định
      }
    }
  };

  // const handleVoiceChange = (selectedVoice, storyId) => {
  //   setVoiceSelections((prevSelections) => ({
  //     ...prevSelections,
  //     [storyId]: selectedVoice,
  //   }));
  // };

  useEffect(() => {
    // Fetch voices using the userId, this should return an array of voice objects
    const fetchVoices = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/audio/list/${userId}`);
        // If voiceId is a direct property of the voice object, this is correct.
        // If it's nested inside another object, you need to adjust the path accordingly.
        setVoices(response.data);
      } catch (error) {
        console.error("Error fetching voices:", error);
        message.error("Giọng nói không tồn tại! Hãy thử lại.");
      }
    };

    fetchVoices();
  }, [userId]);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const hideSearch = () => {
    setIsSearchVisible(false);
    setSearchText("");
  };

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/api/wishlist/${userId}`)
      .then((response) => {
        console.log(response.data.stories);

        //Khởi tạo voiceSelections lúc ban đầu.
        const initialVoiceSelections = {};
        response.data.stories.forEach((story) => {
          initialVoiceSelections[story._id] = "default";
        });
        setVoiceSelections(initialVoiceSelections);
        setWishlist(
          response.data.stories.map((story) => ({
            ...story,
            imageUrl: story.imageUrl ? `${API_URL}/${story.imageUrl}` : null,
            description: story.description,
            voiceGenerated: story.voiceGenerated
              ? `${API_URL}/${story.voiceGenerated}`
              : null,

            isGenerated: story.isGenerated,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching wishlist:", error);
      });
  }, [userId]);

  const titleFilters = Array.from(
    new Set(wishlist.map((story) => story.title[0].toUpperCase()))
  ).map((letter) => ({
    text: letter,
    value: letter,
  }));

  const filteredWishlist = wishlist.filter((story) =>
    story.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const removeFromWishlist = (storyId) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xoá câu chuyện khỏi Yêu thích",
      content: "Hành động sẽ được tiếp tục",
      okText: "Xác nhận",
      cancelText: "Huỷ",
      onOk: () => {
        axios
          .delete(`${API_URL}/api/wishlist/${userId}/remove/${storyId}`)
          .then((response) => {
            if (response.status === 200) {
              message.success("Câu chuyện xóa thành công khỏi Yêu thích");
              setWishlist((prevWishlist) =>
                prevWishlist.filter((story) => story._id !== storyId)
              );
            } else {
              message.error("Failed to remove from wishlist.");
            }
          })
          .catch((error) => {
            console.error("Error removing from wishlist:", error);
            message.error(
              "Câu chuyện xóa không thành công khỏi Danh sách yêu thích"
            );
          });
      },
    });
  };

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

  //
  const generateStory = async (storyId, storyDescription) => {
    const selectedVoiceId = voiceSelections[storyId];
    const story = wishlist.find((s) => s._id === storyId);

    if (!selectedVoiceId) {
      message.warning("Please select a voice to generate the story.");
      return;
    }

    if (!story) {
      message.error("Story not found.");
      return;
    }

    // Kiểm tra xem GIỌNG ĐỌC CỤ THỂ đã được tạo cho câu chuyện này chưa
    const voiceGenerated = story.userVoices.some(
      (voice) =>
        voice.voiceId === selectedVoiceId && voice.status === "completed" // Bỏ điều kiện kiểm tra userId ở đây
    );

    if (voiceGenerated) {
      message.info(
        "This story has already been generated with the selected voice."
      );

      return;
    }

    // Tiếp tục thực hiện generate story nếu giọng chưa được generated
    try {
      setLoading(true);
      setSelectedStoryId(storyId);
      setLoadingProgress(30);

      const audioPath = await generateAudio(selectedVoiceId, storyDescription);
      setLoadingProgress(60);
      console.log(loadingProgress);

      const audioUrl = await retrieveAudio(audioPath);
      setLoadingProgress(90);

      const response = await fetch(audioUrl);
      const audioBlob = await response.blob();

      const formData = new FormData();
      formData.append("storyId", storyId);
      formData.append("userId", userId);
      formData.append("voiceId", selectedVoiceId);
      formData.append("audioFile", audioBlob, "story-audio.wav");

      const uploadResponse = await axios.post(
        `${API_URL}/api/stories/${storyId}/upload-audio`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (uploadResponse.status === 200) {
        message.success("Story generated and saved successfully.");
        setLoadingProgress(100);
        setWishlist((prevWishlist) =>
          prevWishlist.map((storyItem) => {
            if (storyItem._id === storyId) {
              // Cập nhật trạng thái của giọng đọc cụ thể
              const newUserVoices = storyItem.userVoices.map((voice) =>
                voice.voiceId === selectedVoiceId
                  ? { ...voice, status: "completed" }
                  : voice
              );
              return { ...storyItem, userVoices: newUserVoices };
            }
            return storyItem;
          })
        );
        const newVoice = {
          ...uploadResponse.data.newVoice,
          status: "completed",
          voiceId: selectedVoiceId,
          userId: userId,
        };
        updateVoiceStatus(storyId, newVoice);
      } else {
        message.error("Failed to save the generated story.");
      }
    } catch (error) {
      console.error("Error in voice cloning process:", error);
      message.error("Failed to generate story.");
    } finally {
      setLoading(false);
      setLoadingProgress(0);
    }
  };

  const getDefaultVoice = (record) => {
    // Ensure that defaultVoice is an array before calling find
    if (Array.isArray(record.defaultVoice)) {
      return record.defaultVoice.find((voice) => voice.isDefault === true);
    }
    // If defaultVoice is not an array, return null or some default object
    return null;
  };

  const updateVoiceStatus = (storyId, newVoice) => {
    setWishlist((currentWishlist) =>
      currentWishlist.map((story) => {
        if (story._id === storyId) {
          // Kiểm tra nếu voice đã tồn tại trong userVoices
          const voiceIndex = story.userVoices.findIndex(
            (v) => v.voiceId === newVoice.voiceId
          );
          if (voiceIndex > -1) {
            // Cập nhật voice hiện tại
            const updatedVoices = [...story.userVoices];
            updatedVoices[voiceIndex] = {
              ...updatedVoices[voiceIndex],
              ...newVoice,
            };
            return { ...story, userVoices: updatedVoices };
          } else {
            // Thêm voice mới
            return { ...story, userVoices: [...story.userVoices, newVoice] };
          }
        }
        return story;
      })
    );
  };

  const addToPlaylist = async (storyId, voiceSelection) => {
    try {
      let response;
      const requestData = {
        userId: userId,
        storyId: storyId,
      };

      if (voiceSelection === "default") {
        // Gọi API thêm giọng đọc mặc định
        response = await axios.post(
          `${API_URL}/api/playlist/add-default-voice`,
          requestData
        );
      } else {
        // Gọi API thêm giọng đọc cụ thể
        requestData.voiceId = voiceSelection;
        response = await axios.post(`${API_URL}/api/playlist/add`, requestData);
      }

      if (response.status === 200) {
        message.success("Story added to playlist successfully.");
      } else {
        message.error("Failed to add story to playlist.");
      }
    } catch (error) {
      console.error("Error adding to playlist:", error);
      message.error("Failed to add to playlist. " + error.message);
    }
  };

  const wishlistColumns = [
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
      title: (
        <div>
          Tên truyện
          {isSearchVisible ? (
            <Input
              placeholder="Nhập tên truyện"
              onChange={handleSearch}
              onBlur={hideSearch} // Sự kiện onBlur
              autoFocus
            />
          ) : (
            <Button
              icon={<SearchOutlined />}
              onClick={() => setIsSearchVisible(true)}
              style={{ marginLeft: "10px" }}
            />
          )}
        </div>
      ),

      dataIndex: "title",
      key: "title",
      // Lọc dữ liệu dựa trên searchText
      onFilter: (value, record) =>
        record.title.toLowerCase().includes(searchText.toLowerCase()),
      sorter: (a, b) => a.title.localeCompare(b.title),
    },

    {
      title: "Giọng đọc",
      key: "voice",
      render: (text, record) => (
        <Select
          style={{ width: 120 }}
          onChange={(value) => handleVoiceChange(value, record._id)}
          value={
            record.isGenerated && !voiceSelections[record._id]
              ? "Không tồn tại"
              : voiceSelections[record._id] || " "
          }
        >
          {record.isGenerated ? <Option value="default">Default</Option> : null}

          {voices.map((voice) => (
            <Option key={voice._id} value={voice.voiceId || voice._id}>
              {voice.title}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Trạng thái",
      key: "progress",
      render: (text, record) => {
        // Giả sử bạn lưu trữ trạng thái trong `userVoices`
        const voiceStatus = record.userVoices.find(
          (voice) => voice.voiceId === voiceSelections[record._id]
        )?.status;
        const selectedVoiceId = voiceSelections[record._id];
        const isDefaultVoiceSelected = selectedVoiceId === "default";
        if (voiceStatus === "completed" || isDefaultVoiceSelected) {
          return "Hoàn thành";
        } else if (
          selectedStoryId === record._id &&
          loadingProgress > 0 &&
          loadingProgress < 100
        ) {
          return "Đang xử lý";
        } else {
          return "Chưa xử lý";
        }
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (text, record) => {
        const selectedVoiceId = voiceSelections[record._id];
        const isDefaultVoiceSelected = selectedVoiceId === "default";
        const voiceGenerated =
          isDefaultVoiceSelected ||
          record.userVoices.some(
            (voice) =>
              voice.voiceId === selectedVoiceId && voice.status === "completed"
          );
        const isGenerating = loading && selectedStoryId === record._id;

        return (
          <>
            {!selectedVoiceId && (
              <Tooltip title="Chọn một giọng đọc trước">
                <Button icon={<SlidersOutlined />} disabled />
              </Tooltip>
            )}
            {selectedVoiceId && !voiceGenerated && (
              <Tooltip title="Tạo Truyện">
                <Button
                  icon={<SlidersFilled />}
                  loading={isGenerating}
                  onClick={() => generateStory(record._id, record.description)}
                  disabled={isGenerating}
                  style={{ marginRight: "10px",color: "#ffffff", background: "#029FAE" }}
                />
              </Tooltip>
            )}
            {voiceGenerated && (
              <Tooltip title="Thêm vào Playlist">
                <Button
                  icon={<PlusCircleOutlined />}
                  onClick={() => addToPlaylist(record._id, selectedVoiceId)}
                  disabled={isGenerating}
                />
              </Tooltip>
            )}
            <Tooltip title="Xóa khỏi Yêu thích">
              <Button
                icon={<DeleteFilled />}
                onClick={() => removeFromWishlist(record._id)}
                disabled={isGenerating}
                style={{
                  color: "#ffffff",
                  background: "#ff0000",
                }}
              />
            </Tooltip>
          </>
        );
      },
    },
  ];

  return (
    <div className="wishlist-container">
    <div className="wishlist-content" style={{ margin: "50px 100px 0px 105px" }}>
      <h2 className="wishlist-title" style={{ color: "#029FAE" }}>Yêu thích</h2>
      <Table
        className="wishlist-table"
        columns={wishlistColumns}
        dataSource={filteredWishlist}
        rowKey="_id"
        pagination={{ pageSize: 3 }}
      />
    </div>
  </div>
  );
};

export default WishlistPage;
