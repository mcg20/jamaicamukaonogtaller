import React, { useState } from 'react';
import '../css/MemberDash.css';
import Profile from './Profile';
import Transactions from './Transactions';
import coopLogo from '../pic/cooplogo.png'; 
import secondLogo from '../pic/3.png'; 
import profileLogo from '../pic/profilelogo.png';
import { useNavigate } from 'react-router-dom';

const MemberDashboard = () => {
 const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('memId');
    localStorage.removeItem('role');

    // Navigate to the login page
    navigate('/');
  };
    const handleClick = () => {
        navigate('/memberdash');
    }; 

  const [activeTab, setActiveTab] = useState('profile');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile />;
      case 'transactions':
        return <Transactions />;
      default:
        return <Profile />;
    }
  }; 

  return (
    <div className="member-dashboard">
      {/* Header Section */}
      <header className="landing-header">
        <div className="logo-container">
          <img src={coopLogo} alt="Coop Logo" className="coop-logo" />
          <img src={secondLogo} alt="Second Logo" className="second-logo" />
        </div>
        <nav>
          <ul>
            <li><a href="/members">Home</a></li>
            <li><a href="/products">Products and Services</a></li>
            <li><a href="/allied-business">Allied Business</a></li>
            <li><a href="/membership">Membership</a></li>
            <li><a href="/branches">Branches</a></li>
            <li><a href="/faq">FAQ</a></li>
            {/* Replace Login button with Profile logo */}
            <li>
              <button className="profile-btn" onClick={handleClick} >
                <img src={profileLogo} alt="Profile" className="profile-icon" />
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <header className="dashboard-header">
        <h1>Member Dashboard</h1>
      </header>

      <div className="dashboard-container">
        <nav className="sidebar">
          <ul>
            <li className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
              View Profile
            </li>
            <li className={activeTab === 'transactions' ? 'active' : ''} onClick={() => setActiveTab('transactions')}>
              View Transactions
            </li>
            <li className={activeTab === 'logout' ? 'active' : ''} onClick={handleLogout}>
              Logout
            </li>
          </ul>
        </nav>

        <main className="dashboard-content">
          {renderTabContent()}
        </main>
      </div>

      <footer className="dashboard-footer">
        <p>&copy; 2024 MSU-IIT National Multi-Purpose Cooperative. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default MemberDashboard;