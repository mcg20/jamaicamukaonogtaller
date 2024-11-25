import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContextProvider } from './context/ToastContextProvider'; 
import LogIn from './components/Login';
import Landing from './components/LandingPage';
import Admin from './components/Admin';
import Member from './components/Member'
import MemberDash from './components/MemberDash'
import Profile from './components/Profile'
import Transactions from './components/Transactions'
import LaboratoryServices from './components/LabServices'
import Schedule from './components/Schedule'
import Receipt from './components/e-Receipt'
import ManageAppointments from './components/ManageAppointments'
import ManageServices from './components/ManageServices'
import './App.css';

const App = () => {
  return (
  <div className="App">
     <header>
     </header>
    <ToastContextProvider> 
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/admins" element={<Admin />} />
            <Route path="/members" element={<Member />} />
            <Route path="/memberdash" element={<MemberDash />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/labservices" element={<LaboratoryServices />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/eReceipt" element={<Receipt />} />
            <Route path="/manageappointments" element={<ManageAppointments />} />
            <Route path="/manageservices" element={<ManageServices/>} />
          </Routes>
        </div>
      </Router>
    </ToastContextProvider>
    </div>
  );
}

export default App;
