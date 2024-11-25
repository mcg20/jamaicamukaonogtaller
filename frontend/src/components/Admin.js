import React from 'react';
import '../css/Admin.css';
import coopLogo from '../pic/cooplogo.png';
import secondLogo from '../pic/3.png';
import { useNavigate } from 'react-router-dom';


const Admin = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('memId');
    localStorage.removeItem('role');


    // Navigate to the login page
    navigate('/');
  };

  const handleAppointment = () => {
    navigate('/manageappointments')
  }

  const handleServices= () => {
    navigate('/manageservices')
  }
  


  return (
    <div className="admin-page">
        <header className="landing-header">
          <div className="logo-container">
            <img src={coopLogo} alt="Coop Logo" className="coop-logo" />
            <img src={secondLogo} alt="Second Logo" className="second-logo" />
          </div>
          <nav>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/products">Products and Services</a></li>
              <li><a href="/allied-business">Allied Business</a></li>
              <li><a href="/membership">Membership</a></li>
              <li><a href="/branches">Branches</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
            </ul>
          </nav>
        </header>


        {/* Admin Dashboard title placed below the header */}
        <div className="dashboard-title">
          <h1>Admin Dashboard</h1>
        </div>


      <main className="admin-content">
        <section className="admin-actions">
          <div className="action-box">
            <h3>Manage Services</h3>
            <p>Manage laboratory services offered by the cooperative.</p>
            <button className="action-btn" onClick={handleServices}>Go to Services</button>
          </div>


          <div className="action-box1">
            <h3>Manage Appointments</h3>
            <p>Manage the lab appointments made by the members.</p>
            <button className="action-btn" onClick={handleAppointment}>Go to Appointments</button>
          </div>
        </section>
      </main>


                {/* Footer Section */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-left">
              <img src={coopLogo} alt="Coop Logo" className="footer-logo" />
              <p>
                Head Office: Gregorio T. Lluch Sr. Ave, Pala-o Iligan City, 9200, Philippines <br />
                Phone: (063) 222-5574 <br />
                Email: msuiitmpc@msuicoop.org <br />
                Webmail, HR Max, IT Support Desk, e-Survey
              </p>
            </div>
            <div className="footer-section resources">
              <h4>Resources</h4>
              <ul>
                <li>FAQs</li>
                <li>Policy Guidelines</li>
                <li>Help Center</li>
              </ul>
            </div>
            <div className="footer-section quick-links">
              <h4>Quick Links</h4>
              <ul>
                <li>About</li>
                <li>Become a Member</li>
                <li>Loan Products</li>
                <li>Financial Services</li>
              </ul>
            </div>
            <div className="footer-section admin-links">
              <h4>Admin Links</h4>
              <ul>
                <li>Membership Management</li>
                <li>POS Management</li>
                <li>Loan Management</li>
                <li>Wellness Programs Management</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; MSU-IIT National Multi-Purpose Cooperative 2024 | Privacy Policy | Terms & Conditions</p>
          </div>
        </footer>
    </div>
   
  );
}


export default Admin;
