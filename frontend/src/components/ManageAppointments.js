import React, { useState, useEffect } from 'react';
import '../css/ManageAppointments.css';
import coopLogo from '../pic/cooplogo.png';
import secondLogo from '../pic/3.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';


const ManageAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [members, setMembers] = useState({});
  const [uploadedResults, setUploadedResults] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAppointmentId, setModalAppointmentId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // Temp store for the selected file
  const [searchId, setSearchId] = useState('');
  const [searchDate, setSearchDate] = useState('');


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:3003/appointments');
       
        setAppointments(response.data);
       


        const memberIds = response.data.map((appointment) => appointment.memId);
        fetchMemberDetails(memberIds);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };


    fetchAppointments();
  }, []);


  const fetchMemberDetails = async (memberIds) => {
    try {
      const responses = await Promise.all(
        memberIds.map((memId) => axios.get(`http://localhost:3003/members/${memId}`))
      );
      const memberData = responses.reduce((acc, curr) => {
        acc[curr.data.memId] = curr.data;
        return acc;
      }, {});
      setMembers(memberData);
    } catch (error) {
      console.error('Error fetching member details:', error);
    }
  };


  const handleUploadResults = (appointmentId) => {
    setModalAppointmentId(appointmentId);
    setSelectedFile(null); // Reset selected file when opening the modal
    setIsModalOpen(true);
  };


  const handleFileSelection = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };


  const handleFileUpload = () => {
    if (!selectedFile || !modalAppointmentId) {
      alert('Please select a file and ensure the appointment ID is set.');
      return;
    }


    console.log("Appointment ID:", modalAppointmentId);




    const formData = new FormData();
    formData.append('result', selectedFile);


    axios.post(`http://localhost:3003/appointments/${modalAppointmentId}/upload-pdf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('File uploaded successfully:', response.data);
        setUploadedResults((prev) => ({
          ...prev,
          [modalAppointmentId]: response.data.appointment.pdfUrl,
        }));
        closeModal();
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
      });
  };


  const closeModal = () => {
    setIsModalOpen(false);
    setModalAppointmentId(null);
    setSelectedFile(null); // Clear file selection
  };


  const handleDeleteResults = async (appointmentId) => {
    try {
      // Simulate result deletion (replace this with actual delete logic)
      const response = await fetch(`http://localhost:3003/appointments/delete-results/${appointmentId}`, {
        method: 'DELETE',
      });


      if (response.ok) {
        alert('Results deleted successfully!');
        window.location.reload();
      } else {
        alert('Failed to delete results.');
      }
    } catch (error) {
      console.error('Error deleting results:', error);
      alert('An error occurred.');
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('memId');
    localStorage.removeItem('role');
    navigate('/');
  };


  const filteredAppointments = appointments.filter((appointment) => {
    const matchId = appointment._id.toLowerCase().includes(searchId.toLowerCase());
    const matchDate = appointment.date.includes(searchDate);
    return (searchId === '' || matchId) && (searchDate === '' || matchDate);
  });


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
            <li><a>Products and Services</a></li>
            <li><a>Allied Business</a></li>
            <li><a>Membership</a></li>
            <li><a>Branches</a></li>
            <li><a>FAQ</a></li>
            <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
          </ul>
        </nav>
      </header>


      <div className="dashboard-title">
        <h1>Admin Dashboard</h1>
      </div>


      <div className="search-container">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by Appointment ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
        </div>
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="date"
            placeholder="Search by Date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </div>
      </div>


      <div className="appointments-table">
        <table>
          <thead>
            <tr>
              <th>Appointment Number</th>
              <th>Name</th>
              <th>Age</th>
              <th>Date & Time</th>
              <th>Services Availed</th>
              <th>Total Cost</th>
              <th>Status</th>
              <th>Action</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment._id}</td>
                <td>{members[appointment.memId]?.name || 'Loading...'}</td>
                <td>{members[appointment.memId]?.age || 'Loading...'}</td>
                <td>{`${appointment.date} ${appointment.time}`}</td>
                <td>
                  {appointment.selectedServices?.length > 0
                    ? appointment.selectedServices.map(service => service.name).join(', ')
                    : 'No services selected'}
                </td>
                <td>PHP {appointment.total}</td>
                <td>{appointment.status || 'Pending'}</td>
                <td>
                  {appointment.status=== "Success"?(
                    <button
                    className="upload-btn"
                    onClick={() =>handleDeleteResults(appointment._id)}
                    >
                    Delete Results
                    </button>
                  ) :(
                    <button
                    className="upload-btn"
                    onClick={() =>handleUploadResults(appointment._id)}
                  >
                    Upload Results
                  </button>
                  )}
                </td>
                <td>
                  {appointment.pdfUrl ? (
                    <a href={appointment.pdfUrl} target="_blank" rel="noopener noreferrer">
                      View PDF
                    </a>
                  ) : (
                    <span>No Result</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {isModalOpen && (
        <div className="upload-modal">
          <div className="modal-content">
            <h3>Upload Results</h3>
            <p>Browse Files or Drag File Here</p>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelection}
            />
            <div className="modal-actions">
              <button className="upload-btn" onClick={handleFileUpload}>
                Upload
              </button>
              <button className="close-btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}


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
              <li>Payment & Contribution</li>
              <li>Membership</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Visit Us</h4>
            <ul>
              <li>Home</li>
              <li>Products & Services</li>
              <li>FAQ</li>
              <li>Branches</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <ul>
              <li>Facebook</li>
              <li>Instagram</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};


export default ManageAppointments;
