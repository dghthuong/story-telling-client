import React from 'react';
import { Navigate } from 'react-router-dom';


const UserRoutes = ({ children }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem("role"); 
    if (!token||role !== "user") {
        
        return <Navigate to="/"/>;
        
    }
    return children;
};

export default UserRoutes;
