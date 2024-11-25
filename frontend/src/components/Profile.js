import React, { useState, useEffect } from 'react';
import '../css/Profile.css';
import profileLogo from '../pic/profilelogo.png'; // Default image if user doesn't have one
import axios from 'axios';

function Profile() {
  const [profileData, setProfileData] = useState(null);  // State to store the fetched profile data

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    // Fetch the member data based on the logged-in user
    const fetchProfileData = async () => {
      const memId = localStorage.getItem('memId');  // Assuming memId is stored in localStorage after login

      if (memId) {
        try {
          const response = await axios.get(`http://localhost:3003/members/${memId}`);
          setProfileData(response.data); // Store fetched profile data
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      }
    };

    fetchProfileData();
  }, []);  // Empty dependency array means this effect runs once when the component mounts

  // If profile data is still loading, show a loading state
  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={profileData.photo || profileLogo} alt="Profile" className="profile-photo" />
        <div className="profile-info">
          <h1>{profileData.name}</h1>
          <p>Member ID: {profileData.memId}</p>
          <p>Email: {profileData.email}</p>
          <p>Membership Start: {new Date(profileData.date).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="profile-body">
        <div className="benefits-section">
          <h2>Membership Details</h2>
          <ul>
            <li>Age: {profileData.age}</li>
            <li>Role: {profileData.role}</li>
          </ul>
        </div>

        <div className="contact-section">
          <h2>Contact Information</h2>
          <p>Phone: {profileData.phone}</p>
          <p>Address: {profileData.address}</p>
        </div>
      </div>

      <div className="profile-actions">
        <button className="print-btn" onClick={handlePrint}>Print Profile</button>
      </div>
    </div>
  );
}

export default Profile;
