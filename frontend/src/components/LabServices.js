import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/LabServices.css'; // Ensure this CSS file is created
import coopLogo from '../pic/cooplogo.png';
import secondLogo from '../pic/3.png';
import { useLocation, useNavigate } from 'react-router-dom';
import profileLogo from '../pic/profilelogo.png';


const LaboratoryServices = () => {

  const navigate = useNavigate();
  const { state } = useLocation();

  const [servicesList, setServicesList] = useState([]);
  const [packageList, setPackageList] = useState([]);
  const [panelList, setPanelList] = useState([]);

  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [selectedPanels, setSelectedPanels] = useState([]);
 

  const [total, setTotal] = useState(0);
  
  const [currentStep, setCurrentStep] = useState(1);


  
  // Fetch data from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:3003/services');
        setServicesList(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };


    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://localhost:3003/packages');
        setPackageList(response.data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };


    const fetchPanels = async () => {
        try {
          const response = await axios.get('http://localhost:3003/panels');
          setPanelList(response.data);
        } catch (error) {
          console.error('Error fetching panels:', error);
        }
      };


    fetchServices();
    fetchPackages();
    fetchPanels();
  }, []);


  const groupByCategory = (services) => {
    return services.reduce((acc, service) => {
      const { category } = service;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(service);
      return acc;
    }, {});
  };


  const servicesByCategory = groupByCategory(servicesList);


  const calculateTotal = () => {
    const servicesTotal = selectedServices.reduce((total, service) => total + service.price, 0);
    const packagesTotal = selectedPackages.reduce((total, pkg) => total + pkg.price, 0);
    const panelsTotal = selectedPanels.reduce((total, panel) => total + panel.price, 0);
    return servicesTotal + packagesTotal + panelsTotal;
  };

  const handleServiceClick = (test) => {
    setSelectedServices((prev) =>
      prev.includes(test) ? prev.filter((item) => item !== test) : [...prev, test]
    );
  };


  const handlePackageClick = (pkg) => {
    setSelectedPackages((prev) =>
      prev.includes(pkg) ? prev.filter((item) => item !== pkg) : [...prev, pkg]
    );
  };


  const handlePanelClick = (panel) => {
    setSelectedPanels((prev) =>
      prev.includes(panel) ? prev.filter((item) => item !== panel) : [...prev, panel]
    );
  };


  const isSelected = (test) => selectedServices.includes(test);
  const isPackageSelected = (pkg) => selectedPackages.includes(pkg);
  const isPanelSelected = (panel) => selectedPanels.includes(panel);



  const handleNextClick = () => {
    const servicesData = {
      selectedServices,
      selectedPackages,
      selectedPanels,
      total: calculateTotal(),
    };

    sessionStorage.setItem('servicesData', JSON.stringify(servicesData)); // Save data to sessionStorage
    navigate('/schedule', { state: { servicesData } });
  };


  const handleClick = () => {
    navigate('/memberdash');
  };

  const handleStepChange = (step) => {
    setCurrentStep(step);
    if (step === 1) {
      navigate('/labservices');
    } else if (step === 2) {
      navigate('/schedule');
    } else if (step === 3) {
      navigate('/eReceipt');
    }
  };
  
  return (
    <div className="laboratory-page">
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
              className={`progress-step ${currentStep >= 1 ? "done" : ""} ${currentStep >=1 ? "active" : ""}`}
              onClick={() => handleStepChange(1)}
              disabled={currentStep < 1} 
            >
              1
            </button>
            <button
              className={`progress-step ${currentStep >= 2 ? "done" : ""} ${currentStep >=2 ? "active" : ""}`}
              onClick={() => handleStepChange(2)} 
              disabled={currentStep < 2}
            >
              2
            </button>
            <button
              className={`progress-step ${currentStep >= 3 ? "done" : ""} ${currentStep >= 3 ? "active" : ""}`}
              onClick={() => handleStepChange(3)}
              disabled={currentStep < 3} 
            >
              3
            </button>
          </div>
        </div>


      <main className="lab-content">
        <div className="content-container">
          {/* Left Column: Services */}
          <div className="services-column">
          <h2>Our Laboratory Services</h2>
            <div className="services-grid">
              {Object.keys(servicesByCategory).map((category) => (
                <div className="service-category" key={category}>
                  <h3 className="category-title">{category}</h3> {/* Display the category name */}
                  {servicesByCategory[category].map((service) => (
                    <div
                      className={`test-item ${isSelected(service) ? 'selected' : ''}`}
                      key={service._id}
                      onClick={() => handleServiceClick(service)}
                    >
                      <div className={`checkbox ${isSelected(service) ? 'checked' : ''}`}></div>
                      <span className="test-name">{service.name}</span>
                      <span className="test-price">PHP {service.price}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {/* Laboratory Packages Section */}
            <h2>Our Laboratory Packages</h2>
            <div className="packages-grid">
              {packageList.map((pkg) => (
                <div
                  className={`package-item ${isPackageSelected(pkg) ? 'selected' : ''}`}
                  key={pkg._id}
                  onClick={() => handlePackageClick(pkg)}
                >
                  <div className={`checkbox ${isPackageSelected(pkg) ? 'checked' : ''}`}></div>
                  <span className="package-name">{pkg.name}</span>
                  <span className="package-details">{pkg.details}</span>
                  <span className="package-price">PHP {pkg.price}</span>
                </div>
              ))}
            </div>  


            {/* Laboratory Panels Section */}
            <h2>Our Laboratory Panels</h2>
            <div className="panels-grid">
              {panelList.map((panel) => (
                <div
                  className={`panel-item ${isPanelSelected(panel) ? 'selected' : ''}`}
                  key={panel._id}
                  onClick={() => handlePanelClick(panel)}
                >
                  <div className={`checkbox ${isPanelSelected(panel) ? 'checked' : ''}`}></div>
                  <span className="panel-name">{panel.name}</span>
                  <ul className="panel-tests">
                    {panel.details.split(',').map((test, idx) => (
                      <li key={idx}>{test}</li>
                    ))}
                  </ul>
                  <span className="panel-price">PHP {panel.price}</span>
                </div>
              ))}
            </div>
          </div>


          {/* Right Column: Selected Services */}
          <div className="receipt-column">
            <h3>Selected Services, Packages, and Panels</h3>
            <ul>
              {selectedServices.length > 0 || selectedPackages.length > 0 || selectedPanels.length > 0 ? (
                <>
                  {selectedServices.map((service, idx) => (
                    <li key={idx}>
                      {service.name} - PHP {service.price}
                    </li>
                  ))}
                  {selectedPackages.map((pkg, idx) => (
                    <li key={idx}>
                      {pkg.name} - PHP {pkg.price}
                    </li>
                  ))}
                  {selectedPanels.map((panel, idx) => (
                    <li key={idx}>
                      {panel.name} - PHP {panel.price}
                    </li>
                  ))}
                </>
              ) : (
                <p>No services, packages, or panels selected</p>
              )}
            </ul>
            <h4>Total: PHP {calculateTotal()}</h4>
            <button className="next-btn" onClick={handleNextClick} disabled={
              selectedServices.length === 0 &&
              selectedPackages.length === 0 &&
              selectedPanels.length === 0
            }>Next</button>
          </div>
        </div>
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
};


export default LaboratoryServices;
