import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PlayStories.css'; // Make sure to create a CSS file with your styles

const API_URL = process.env.REACT_APP_API_URL;

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
      
      {story && (
        <>
          <div className="story-details">
            <img className="story-cover" src={`${API_URL}/${story.imageUrl}`} alt={story.title} />
            
            <h2 className="story-author">Tác giả: {story.author}</h2>
            <h1 className="story-title">{story.title}</h1>
            <audio controls autoPlay className="audio-player">
              <source src={`${API_URL}/${story.generatedVoice}`} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
            <p className="story-description">{story.description}</p>
            
            <p className="story-year">{story.year}</p>
            <div className="audio-player-container">

          </div>
          </div>
        </>
      )}
      <h1></h1>
      <button className="back-button" onClick={handleBackClick}>Back</button>
    </div>
  );
}

export default PlayStories;
