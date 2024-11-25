import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import '../css/Transactions.css';
import profileLogo from '../pic/profilelogo.png';
import axios from 'axios';


function Transactions() {
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState(new Date());
  const [memId, setMemId] = useState('');  // This will store the logged-in user's memId
  const [currentIndex, setCurrentIndex] = useState(0);


  // Fetch all appointments for the logged-in user when the component mounts
  useEffect(() => {
    const fetchAppointments = async () => {
      // Get memId from localStorage (ensure user is logged in)
      const storedMemId = localStorage.getItem('memId');
     
      if (storedMemId) {
        setMemId(storedMemId); // Set the memId from localStorage
       
        try {
          // Fetch the appointments of the logged-in user
          const response = await axios.get(`http://localhost:3003/appointments/${storedMemId}`);
          setAppointments(response.data); // Assuming the API returns the appointment data
        } catch (error) {
          console.error('Error fetching appointments:', error);
        }
      } else {
        console.log('User not logged in.');
      }
    };


    fetchAppointments();
  }, []);  // Empty dependency array means this effect runs once when the component mounts




  const cancelAppointment = async (appointmentId) => {
    try {
      const response = await axios.put(`http://localhost:3003/appointments/${appointmentId}`, {
        status: 'Cancelled',
      });


      // Update the appointment's status in the state to reflect the cancellation
      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment._id === appointmentId ? { ...appointment, status: 'Cancelled' } : appointment
        )
      );


      console.log('Appointment cancelled successfully:', response.data);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };




  // Function to check if a date has booked appointments
  const isBooked = (date) => {
    const formattedDate = date.toLocaleDateString('en-CA');  
    return appointments.some(appointment => appointment.date === formattedDate);
  };


  const today = new Date();
  const upcomingAppointment = appointments
  .filter(appointment => new Date(appointment.date) >= today && appointment.status === 'Pending')  // Only future dates and pending status
  .sort((a, b) => new Date(a.date) - new Date(b.date));  // Sort and take the first


  const currentAppointment = upcomingAppointment[currentIndex] || null;


  const handleNext = () => {
    if (currentIndex < upcomingAppointment.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };


  // Function to navigate to the previous appointment
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };


  return (
    <div className="transactions">
      <h1>Your Transactions</h1>
      <p>Here are your recent transactions:</p>


      {/* Statistics Cards */}
      <div className="statistics">
        <div className="stat-card">
          <h2>Your Next Appointment</h2>
          {upcomingAppointment.length > 0 ? (
            <div className="transactions">
              <h3><strong>Appointment ID:</strong> <span>{currentAppointment._id}</span></h3>
              <h3><strong>Transaction Date:</strong> <span>{new Intl.DateTimeFormat("en-CA").format(currentAppointment.tranDate)}</span></h3>
              <h3><strong>Appointment Date:</strong> <span>{currentAppointment.date}</span></h3>




              <div className="status-section">
                <h3 className='sttt'><strong>Status:</strong><span className={`status-color ${currentAppointment.status.toLowerCase()}`}>{currentAppointment.status} </span></h3>
              </div>




              <table className="service-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAppointment.selectedServices.map((service, index) => (
                    <tr key={index}>
                      <td>{service.name}</td>
                      <td>{service.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>


              <div className="total-section">
                <h3><strong>Total Amount:</strong> ₱{currentAppointment.total}</h3>
              </div>


              <div className="cancel-section">
                <button onClick={() => cancelAppointment(currentAppointment._id)}> Cancel Appointment </button>
              </div>
            </div>
          ) : (
            <p>No upcoming appointments found.</p>
          )}
         <div className="arrow-button">
              <button onClick={handlePrevious}>&larr; Previous</button>
              <button onClick={handleNext}>Next &rarr;</button>
         </div>
        </div>
      </div>


      {/* Appointments List and Calendar */}
      <div className="appointments">
        <h2>Your Appointments</h2>
        <h3>All Appointments</h3>


       
        <ul>
          {appointments.length > 0 ? (
            appointments.map(appointment => (
              <div className="anu">
                <li key={appointment._id}>
                  <h3 className='orderNumber'>Appointment No.: <span> {appointment._id} </span></h3>
                  <h3 className='appointmentDate'>Appointment Date: <span>{appointment.date} </span></h3>
                  <h3 className='status'>Status: <span className={`status-color ${appointment.status.toLowerCase()}`}> {appointment.status}</span></h3>
                  <h3 className='result'>
                    Result:  
                    {appointment.pdfUrl ? (
                      <a href={appointment.pdfUrl} target="_blank" rel="noopener noreferrer">
                        View PDF
                      </a>
                    ) : (
                      <span>No Result</span>
                    )}
                  </h3>
                </li>
              </div>
            ))
          ) : (
            <p>No appointments found.</p>
          )}
        </ul>


        {/* Calendar with indicators for booked appointments */}
        <div className="calendar-section">
          <h3>Appointment Calendar</h3>
          <Calendar
            onChange={setDate}
            value={date}
            tileContent={({ date }) => {
              return isBooked(date) ? <span className="indicator">📅</span> : null;
            }}
          />
        </div>
      </div>
    </div>
  );
}


export default Transactions;