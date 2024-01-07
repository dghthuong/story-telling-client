import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;// Replace with your actual base URL

const axiosInstance = axios.create({
    baseURL: API_URL,
});

// Get all stories
export const getAllStories = async (token) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/api/getAll-stories`, {
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
        const response = await axiosInstance.post(`${API_URL}/api/create-stories`, storyData, {
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
        const response = await axiosInstance.put(`${API_URL}/api/update-stories/${storyId}`, storyData, {
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
        const response = await axiosInstance.delete(`${API_URL}/api/delete-stories/${storyId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting story:', error);
    }
};
