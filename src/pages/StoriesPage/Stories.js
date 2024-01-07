import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StoriesCard from "../../components/Card/Card";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Pagination, Search, message } from "antd";
import styles from "./StoriesPage.module.css";
import Swal from "sweetalert2";
const API_URL = process.env.REACT_APP_API_URL;

const StoriesPage = () => {
  const storiesPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [stories, setStories] = useState([]);
  const [genres, setGenres] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const userId = localStorage.getItem("id");
  let navigate = useNavigate();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/getAll-stories`);
        setStories(response.data);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/getAll-genre`);
        setGenres(response.data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchStories();
    fetchGenres();
  }, []);

  useEffect(() => {
    // Existing code to fetch stories and genres

    const fetchWishlist = async () => {
      // Replace with actual logic to get user ID
      if (!userId) return;
      try {
        const response = await axios.get(`${API_URL}/api/wishlist/${userId}`);
        setWishlist(response.data); // Assuming the API returns an array of story IDs in wishlist
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, [userId]);


  console.log(wishlist);
  const isStoryInWishlist = (storyId) => {
    return wishlist && Array.isArray(wishlist.stories) && wishlist.stories.some(story => story._id === storyId);
  };
  

  const handlePlayStory = (storyId) => {
    // Navigate to the play story page with the story ID
    navigate(`/play/${storyId}`);
  };

  const handleAddToWishlist = async (storyId) => {
    try {
      // Make sure to replace 'userId' with the actual user ID from your auth context or props
      const userId = localStorage.getItem("id");
      if (isStoryInWishlist(storyId)) {
        message.info("This story is already in your wishlist.");
        return;
      }
      if (!userId) {
        Swal.fire({
          title: "You must be logged in",
          text: "You must be logged in to add stories to your wishlist.",
          icon: "info",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Login",
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            // Người dùng chọn 'Login', điều hướng đến trang đăng nhập
            navigate("/login");
          }
          // Không làm gì cả nếu người dùng chọn 'Cancel'
        });
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/wishlist/${userId}/add`,
        { storyId }
      );
      if (response.status === 200) {
        message.success("Story added to wishlist!");

        // Cập nhật trạng thái local để UI phản ánh sự thay đổi mà không cần làm mới trang
        setWishlist((prevWishlist) => {
          // Thêm câu chuyện vào trạng thái hiện tại của wishlist
          // Đảm bảo bạn không thêm trùng lặp câu chuyện vào wishlist
          const updatedStories = prevWishlist.stories.find(
            (s) => s._id === storyId
          )
            ? [...prevWishlist.stories]
            : [...prevWishlist.stories, { _id: storyId }];

          return { ...prevWishlist, stories: updatedStories };
        });
      } else {
        // Xử lý khi thêm không thành công
        message.error("Failed to add story to wishlist.");
      }
    } catch (error) {
      console.error("Error adding story to wishlist:", error);
      message.error("Failed to add story to wishlist."); // Or handle this with a more user-friendly UI update
    }
  };
  const mapGenreIdToName = (genreId) => {
    const genre = genres.find((genre) => genre._id === genreId);
    return genre ? genre.name : "";
  };

  const filteredStories = stories
    .filter((story) => story.isActive)
    .filter((story) =>
      story.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (story) =>
        !selectedGenre || mapGenreIdToName(story.genre) === selectedGenre
    )
    .map((story) => ({
      ...story,
      genre: mapGenreIdToName(story.genre),
    }));

  const indexOfLastStory = currentPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const currentStories = filteredStories
    .slice(indexOfFirstStory, indexOfLastStory)
    .map((story) => ({
      ...story,
      imageUrl: `${API_URL}/${story.imageUrl}`, // Construct the full image URL
    }));
  return (
    <div className={styles.pageContainer}>
      <div className={styles.sidebarContainer}>
        <Sidebar
          onSearch={setSearchTerm}
          onCategorySelect={setSelectedGenre}
          categories={genres.map((genre) => genre.name)}
          selectedCategory={selectedGenre}
        />
      </div>
      <div className={styles.mainContent}>
        <div className={styles.storiesContainer}>
          {currentStories.map((story) => (
            <div className={styles.storyCardContainer} key={story._id}>
              <StoriesCard
                story={story}
                imageUrl={story.imageUrl}
                onAddToWishlist={handleAddToWishlist}
                onPlay={() => handlePlayStory(story._id)}
                isInWishlist={isStoryInWishlist(story._id)} // Add this prop
              />
            </div>
          ))}
        </div>
        <div
          className={styles.pageContainer}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <h2> </h2>
          <div className="pagination-container">
            <Pagination
              current={currentPage}
              onChange={handlePageChange}
              total={filteredStories.length}
              pageSize={storiesPerPage}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoriesPage;


