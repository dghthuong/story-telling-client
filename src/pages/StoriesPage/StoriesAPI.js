import axios from 'axios';

const baseUrl = 'http://localhost:8000/api'; // Replace with your actual base URL

const axiosInstance = axios.create({
    baseURL: baseUrl,
});

// Get all stories
export const getAllStories = async (token) => {
    try {
        const response = await axiosInstance.get('/getAll-stories', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching stories:', error);
    }
};

// Add a story
export const addStory = async (storyData, token) => {
    try {
        const response = await axiosInstance.post('/create-stories', storyData, {
            headers: { 
                Authorization: `Bearer ${token}`
                // Bỏ 'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding story:', error);
    }
};



// Update a story
export const updateStory = async (storyId, storyData, token) => {
    try {
        const response = await axiosInstance.put(`/update-stories/${storyId}`, storyData, {
            headers: { 
                Authorization: `Bearer ${token}`
                // Bỏ 'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating story:', error);
    }
};

// Delete a story
export const deleteStory = async (storyId, token) => {
    try {
        const response = await axiosInstance.delete(`/delete-stories/${storyId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting story:', error);
    }
};
