import axios from "axios";


export const getAllUsers = async (token) => {
    try {
      const response = await axios.get('http://localhost:8000/api/list-user', {
        headers: {
          Authorization: `Bearer ${token}`,
          // If the role is expected as a header, uncomment the following line
          // 'User-Role': 'admin'
        },
        // If the role is expected as a query parameter, uncomment the following line
        // params: { role: 'admin' }
      });
  
      return response.data; // Assuming the server response contains the user data
    } catch (error) {
      console.error('Error fetching admin users:', error);
    }
  };
  

export const deactivateUser = async (userId) => {
    try {
      // Send a PUT request to update the user's active status to false
      const response = await axios.put(`http://localhost:8000/api/deactive-user/${userId}`);
      
      // Check if the request was successful
      if (response.status === 200) {
        console.log('User deactivated successfully');
        // Optionally, you can handle the success response here
      } else {
        console.error('Failed to deactivate user');
        // Handle the failure response here
      }
    } catch (error) {
      console.error('An error occurred:', error);
      // Handle the error here
    }
  };




  export const createUser = async (userData, token) => {
    try {
      const response = await axios.post('http://localhost:8000/api/create-user', userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
  
      if (response.status === 201) {
        console.log('User created successfully');
        return response.data; // You can return the response data if needed
      } else {
        console.error('Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };
  


  export const updateUser = async (userId, userData, token) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/update-user/${userId}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
  
      if (response.status === 200) {
        console.log('User updated successfully');
        return response.data; // You can return the response data if needed
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  

  export const activateUser = async (userId, token) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/active-user/${userId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        console.log('User activated successfully');
      } else {
        console.error('Failed to activate user');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  



  