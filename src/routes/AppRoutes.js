import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import App from "../pages/AdminPage/AdminPage"
import UserPage from "../pages/UserPage/UserDashboard"
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import ManageUsers from "../pages/AdminPage/ManageUsers"
import PlayStories from "../pages/PlayStories/PlayStoriesPage";
import StoriesPage from "../pages/StoriesPage/Stories";
import WishlistPage from "../pages/UserPage/Wishlist";
import PlaylistPage from "../pages/UserPage/Playlist";
import AudioRecorder from "../pages/UserPage/Voice";
import AudioList from "../pages/UserPage/ManageVoice"


const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/dashboard" element={<AdminRoutes><App/></AdminRoutes>}/>
        <Route path = "/story" element ={<StoriesPage/>}/> 
        <Route path="/user/dashboard" element={<UserRoutes><UserPage /></UserRoutes>} />
        <Route path="/user/wishlist" element={<UserRoutes><WishlistPage/></UserRoutes>} />
        <Route path ="/user/playlist" element={<PlaylistPage/>}/>  
        <Route path="/play/:storyId" element={<PlayStories />} />
        <Route path="/user/record" element={<UserRoutes><AudioRecorder/></UserRoutes>} />
        <Route path="/user/manage-voice" element={<UserRoutes><AudioList/></UserRoutes>} />
      </Routes>
    </>
  );
};

export default AppRoutes;
