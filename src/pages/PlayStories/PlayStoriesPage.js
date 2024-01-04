import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PlayStories.css'; // Make sure to create a CSS file with your styles

const API_URL = "http://localhost:8000";

function PlayStories() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/get-stories/${storyId}`);
        setStory(response.data);
      } catch (error) {
        console.error('Error fetching story:', error);
      }
    };

    fetchStory();
  }, [storyId]);

  const handleBackClick = () => {
    navigate(-1); 
  };

  return (
    <div className="play-stories">
      <button className="back-button" onClick={handleBackClick}>Back</button>
      {story && (
        <>
          <div className="story-details">
            <img className="story-cover" src={`${API_URL}/${story.imageUrl}`} alt={story.title} />
            <h1 className="story-title">{story.title}</h1>
            <h2 className="story-author">{story.author}</h2>
            <p className="story-year">{story.year}</p>
          </div>
          <div className="audio-player-container">
            <audio controls autoPlay className="audio-player">
              <source src={`${API_URL}/${story.generatedVoice}`} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </>
      )}
    </div>
  );
}

export default PlayStories;
