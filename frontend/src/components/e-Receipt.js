import React, { useEffect, useState, useRef } from 'react';
import "../css/e-Receipt.css";
import coopLogo from '../pic/cooplogo.png';
import secondLogo from '../pic/3.png';
import profileLogo from '../pic/profilelogo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import * as htmlToImage from 'html-to-image';

const Summary = () => {
  const location = useLocation();
  const { appointmentData } = location.state || {};
  const [memberDetails, setMemberDetails] = useState(null);
  const receiptRef = useRef();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(3);


  // Check if appointmentData exists, else alert and navigate back
  if (!appointmentData) {
    alert('No appointment data available.');
    navigate('/memberdash');
  }

  const { appointmentId, date: appointmentDate, selectedServices, total, memId } = appointmentData; // Destructure appointmentData

  // Fetch the member details using memId
  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        if (memId) {
          const memberResponse = await axios.get(`http://localhost:3003/members/${memId}`);
          setMemberDetails(memberResponse.data);
        } else {
          alert('Member ID is missing from appointment.');
        }
      } catch (error) {
        console.error('Error fetching member details:', error);
        alert('Error retrieving member details. Please try again later.');
      }
    };

    fetchMemberDetails();
  }, [memId]);

  // Handle download functionality
  const handleDownload = () => {
    if (receiptRef.current) {
      htmlToImage.toJpeg(receiptRef.current, { quality: 1.0, pixelRatio: 2 })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = 'e-receipt.jpg';
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          console.error('Error generating image:', error);
        });
    }
  };

  const handleClick = () => {
    navigate('/memberdash');
  };

  // Render loading state if memberDetails is not yet loaded
  if (!memberDetails) {
    return <p>Loading member details...</p>;
  }

  // Destructure data from memberDetails
  const { name, age } = memberDetails;
  const transactionDate = new Date().toLocaleDateString();

  const handleStepChange = (step) => {
    
    if (step <= currentStep) {
      setCurrentStep(step);

      if (step === 1) {
        navigate('/labservices'); 
      } else if (step === 2) {
        navigate('/schedule'); 
      } else if (step === 3) {
        navigate('/eReceipt'); 
      }
    }
  };

  return (
    <div className="summary-page">
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
            <li><a href="/membership">Membership</a></li>
            <li><a href="/branches">Branches</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li>
              <button className="profile-btn" onClick={handleClick}>
                <img src={profileLogo} alt="Profile" className="profile-icon" />
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <div className="laboratory-page">
        <div className="progress-bar">
            <button
              className={`progress-step ${currentStep >= 1 ? "done" : ""} ${currentStep >=1 ? "active" : ""}`}
              onClick={() => handleStepChange(1)}
              disabled={currentStep === 1 || currentStep === 3} 
            >
              1
            </button>
            <button
              className={`progress-step ${currentStep >= 2 ? "done" : ""} ${currentStep >=2 ? "active" : ""}`}
              onClick={() => handleStepChange(2)} 
              disabled={currentStep === 3 || currentStep < 2}
            >
              2
            </button>
            <button
              className={`progress-step ${currentStep >= 3 ? "done" : ""} ${currentStep >= 3 ? "active" : ""}`}
              onClick={() => handleStepChange(3)}
              disabled={currentStep <= 3} 
            >
              3
            </button>
        </div>
      </div>

      {/* Summary Section */}
      <div className="receipt-container" >
        <div className="receipt-form" ref={receiptRef}>

        
          <header className="receipt-header">
            <img src={coopLogo} alt="Coop Logo" className="coop-logo" />
            <h2>Your Lab Appointment E-Receipt</h2>
            <p>Thank you for booking your appointment with us. Please keep this e-receipt safe.</p>
          </header>

          <div className="transaction-details">
            <p><strong>Appointment ID:</strong> {appointmentId}</p>
            <p><strong>Transaction Date:</strong> {transactionDate}</p>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Age:</strong> {age}</p>
            <p><strong>Appointment Date:</strong> {appointmentDate}</p>
          </div>

          <table className="service-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {selectedServices.map((service, index) => (
                <tr key={index}>
                  <td>{service.name}</td>
                  <td>₱{service.price}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="total-section">
            <p><strong>Total Amount:</strong> ₱{total}</p>
          </div>
        </div>
        <div className="download-section">
            <button onClick={handleDownload}>Download E-Receipt</button>
          </div>
      </div>
    </div>
  );
};

export default Summary;
