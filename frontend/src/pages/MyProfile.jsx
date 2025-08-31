import React, { useEffect, useState } from 'react';
import API from "../services/api.js";
import '../assets/css/profile.css';

const MyProfile = () => {
  const [userInfo, setUserInfo] = useState({
    id: '',
    username: '',
    email: '',
    role: '',
   
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user info from the API
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await API.get('auth/user_detail'); 
        setUserInfo(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    // 🔥 This line was missing
    fetchUserInfo();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      <div className="profile-details">
        <div className="profile-info"><strong>ID:</strong> {userInfo.id}</div>
        <div className="profile-info"><strong>Username:</strong> {userInfo.username}</div>
        <div className="profile-info"><strong>Email:</strong> {userInfo.email || 'N/A'}</div>
        <div className="profile-info"><strong>Role:</strong> {userInfo.role}</div>
       
      </div>

      {/* <div className="profile-actions">
        <button className="add-btn">Edit Profile</button>
      </div> */}
    </div>
  );
};

export default MyProfile;
