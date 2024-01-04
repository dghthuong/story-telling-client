import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import StoriesCard from "../../components/Card/Card";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Pagination, Search ,message} from 'antd';
import styles from './StoriesPage.module.css';


const API_URL = "http://localhost:8000/api";

const StoriesPage = () => {
  const storiesPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [stories, setStories] = useState([]);
  const [genres, setGenres] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get(`${API_URL}/getAll-stories`);
        setStories(response.data);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${API_URL}/getAll-genre`);
        setGenres(response.data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchStories();
    fetchGenres();
  }, []);


  const handlePlayStory = (storyId) => {
    // Navigate to the play story page with the story ID
    navigate(`/play/${storyId}`);
  };


  const handleAddToWishlist = async (storyId) => {
    try {
      // Make sure to replace 'userId' with the actual user ID from your auth context or props
      const userId = localStorage.getItem("id");
      await axios.post(`${API_URL}/wishlist/${userId}/add`, { storyId });
      message.success('Story added to wishlist!'); // Or handle this with a more user-friendly UI update
    } catch (error) {
      console.error('Error adding story to wishlist:', error);
      message.error('Failed to add story to wishlist.'); // Or handle this with a more user-friendly UI update
    }
  };
  const mapGenreIdToName = (genreId) => {
    const genre = genres.find((genre) => genre._id === genreId);
    return genre ? genre.name : "";
  };

  const filteredStories = stories
  .filter(story => story.isActive) 
    .filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(story => !selectedGenre || mapGenreIdToName(story.genre) === selectedGenre)
    .map(story => ({
      ...story,
      genre: mapGenreIdToName(story.genre),
    }));

  const indexOfLastStory = currentPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
 

  const handlePageChange = page => {
    setCurrentPage(page);
  };
  const currentStories = filteredStories.slice(indexOfFirstStory, indexOfLastStory).map(story => ({
    ...story,
    imageUrl: `http://localhost:8000/${story.imageUrl}` // Construct the full image URL
  }));
  return (
<div className={styles.pageContainer}>
    <div className={styles.sidebarContainer}>
      <Sidebar
        onSearch={setSearchTerm}
        onCategorySelect={setSelectedGenre}
        categories={genres.map(genre => genre.name)}
        selectedCategory={selectedGenre}
      />
    </div>
    <div className={styles.mainContent}>
      <div className={styles.storiesContainer}> 
        {currentStories.map(story => (
          <div className={styles.storyCardContainer} key={story._id}>
            <StoriesCard 
              story={story}
              imageUrl={story.imageUrl}
              onAddToWishlist={handleAddToWishlist}
              onPlay={() => handlePlayStory(story._id)}
            />
          </div>
        ))}
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
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
  );
};

export default StoriesPage;
