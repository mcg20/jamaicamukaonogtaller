import React, { useState, useEffect } from 'react';
import "../css/Schedule.css"; // Assuming you will create this CSS file
import coopLogo from '../pic/cooplogo.png';
import secondLogo from '../pic/3.png';
import { useNavigate, useLocation } from 'react-router-dom';
import profileLogo from '../pic/profilelogo.png';
import axios from 'axios';

const Schedule = () => {

  const { state } = useLocation();
  const servicesData = state?.servicesData || {};  // Get the selected services from LabServices
  const { selectedServices, selectedPackages, selectedPanels, total, appointmentId } = servicesData;

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedServicesState, setSelectedServicesState] = useState(selectedServices || []);

  const [currentStep, setCurrentStep] = useState(2);


  const availableTimes = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };


  const navigate = useNavigate();  

  const handleClick = () => {
    navigate('/memberdash');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
 
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time');
      return;
    }
 
    const memId = localStorage.getItem('memId');

    //newww added
    if (!memId) { 
      alert("User is not logged in. Please log in first.");
      return;
    }

    // Combine selected services, packages, and panels into a single array
    const combinedServices = [
      ...selectedServices,
      ...selectedPackages,
      ...selectedPanels,
    ];
 
    const appointmentData = {
      date: selectedDate,
      time: selectedTime,
      selectedServices: combinedServices, // Send combined services array
      total,
      memId,
    };
 
    try {
      // Send a POST request to your backend API to save the appointment
      const response = await axios.post('http://localhost:3003/appointments', appointmentData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 201) {
        const appointmentId = response.data._id;
        const updatedAppointmentData = { ...appointmentData, appointmentId };

        alert('Appointment confirmed!');
        navigate(`/eReceipt`, { state: { appointmentData: updatedAppointmentData } });
      }
    } catch (error) {
      console.error('Error confirming appointment:', error.response || error.message);
      alert('There was an error saving your appointment. Please try again.');
    }
  };

  useEffect(() => {
    if (state?.servicesData) {
      setSelectedServicesState(state.servicesData.selectedServices || []);
    } else {
      const savedServicesData = JSON.parse(localStorage.getItem('servicesData'));
      if (savedServicesData) {
        setSelectedServicesState(savedServicesData.selectedServices || []);
      }
    }
  }, [state]);


  const handleStepChange = (step) => {
    const servicesData = {
      selectedServices: selectedServicesState,
      selectedPackages,
      selectedPanels,
      total,
      appointmentId,
    };

    localStorage.setItem('servicesData', JSON.stringify(servicesData));

    setCurrentStep(step);

    if (step === 1) {
      navigate('/labservices', { state: { servicesData } });
    } else if (step === 2) {
      navigate('/schedule', { state: { servicesData } });
    } else if (step === 3) {
      navigate('/eReceipt', { state: { servicesData } });
    }
  };
  
  
  
  return (
    <div className="schedule-page">
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


      <div className="laboratory-page">
        <div className="progress-bar">
            <button
              className={`progress-step ${currentStep >= 1 ? "done" : ""} ${currentStep === 1 ? "active" : ""}`}
              onClick={() => handleStepChange(1)}
              disabled={currentStep < 1 } 
            >
              1
            </button>
            <button
              className={`progress-step ${currentStep >= 2 ? "done" : ""} ${currentStep ===2 ? "active" : ""}`}
              onClick={() => handleStepChange(2)} 
              disabled={currentStep <  2}
            >
              2
            </button>
            <button
              className={`progress-step ${currentStep >= 3 ? "done" : ""} ${currentStep === 3 ? "active" : ""}`}
              onClick={() => handleStepChange(3)}
              disabled={currentStep < 3} 
            >
              3
            </button>
        </div>
      </div>
 


      {/* Schedule Form Section */}
      <div className="schedule-container">
        <h1>Schedule Your Appointment</h1>
        <form onSubmit={handleSubmit}>

          <div className="date-picker">
            <h2>Select Date:</h2>

            <div className="date-options">
              <input
                type="date"
                id="appointment-date"
                value={selectedDate}
                onChange={handleDateChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
          </div>

          <div className="time-picker">
            <h2>Select Time</h2>
            <div className="time-options">
              {availableTimes.map((time, index) => (
                <button
                  type="button"
                  key={index}
                  className={`time-option ${selectedTime === time ? 'selected' : ''}`}
                  onClick={() => handleTimeChange(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="submit-container">
            <button type="submit" className="submit-btn">Confirm Appointment</button>
          </div>

        </form>
      </div>
    </div>
  );
};


export default Schedule;
