import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { UserContext } from "./context/UserContext";


const App = () => {
  const { user , loginContext} = useContext(UserContext);
  console.log('>> user: ', user) 
  useEffect(()=>{
    if(localStorage.getItem("token")){
      loginContext(localStorage.getItem("id"),localStorage.getItem("email"),localStorage.getItem("token"),localStorage.getItem("role"))
    }
  },[])
  return (
    <>
      <Router>
        <div className="app-header">
          <Navbar />
        </div>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </>
  );
};

export default App;
