import React, { useState } from 'react';
import '../css/Landing.css';
import coopLogo from '../pic/cooplogo.png';
import secondLogo from '../pic/3.png'; 
import sampleImage from '../pic/labpic.jpg';
import headerImage from '../pic/lanyards.png'; 
import { useNavigate } from 'react-router-dom';
import profileLogo from '../pic/profilelogo.png';

import labImage1 from '../pic/labpic.jpg';
import labImage2 from '../pic/labpic2.jpg';
import labImage3 from '../pic/labpic3.jpg';
import labImage4 from '../pic/labpic4.jpg';
import labImage5 from '../pic/labpic5.jpg';
import labImage6 from '../pic/labpic6.jpg';
import labPackageImage from '../pic/labpic.jpg';
import labPanelImage from '../pic/labpic.jpg';

const Member = () => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/memberdash');
    }; 

    const handleAppointment = () => {
      navigate('/labservices')
    }

     // List of services, packages, and panels
     const servicesList = [
      {
          category: 'Chemistry',
          tests: [
              { name: 'FBS/RBS/HGT/2HPP - PHP 160' },
              { name: 'Total Cholesterol - PHP 220' },
              { name: 'Triglycerides - PHP 220' },
              { name: 'HDL Cholesterol - PHP 220' },
              { name: 'LDL Cholesterol - PHP 220' },
              { name: 'VLDL Cholesterol - PHP 220' },
              { name: 'CREATININE - PHP 230' },
              { name: 'BUA (Blood Uric Acid) - PHP 230' },
              { name: 'SGPT (ALT) - PHP 330' },
              { name: 'SGOT(AST) - PHP 330' },
              { name: 'BUN (Blood Urea Nitrogen) - PHP 320' },
              { name: 'HBA1C - PHP 1200' },
          ]
      },
      {
          category: 'Hematology',
          tests: [
              { name: 'CBC w/ plt count - PHP 250' },
              { name: 'Blood Typing (ABO) - PHP 150' },
              { name: 'NS1 - PHP 850' },
              { name: 'Dengue Duo - PHP 1100' }
          ]
      },
      {
          category: 'Serology',
          tests: [
              { name: 'HBs AG (Qualitative) - PHP 190' },
              { name: 'Syphilis (Qualitative) - PHP 250' },
              { name: 'H.Pylori - PHP 500' },
              { name: 'Anti-HAV - PHP 1100' }
          ]
      },
      {
          category: 'X-Ray',
          tests: [
              { name: 'Ankle APL - PHP 750' },
              { name: 'Apicolordotic View - PHP 480' },
              { name: 'Arm APL - PHP 300' },
              { name: 'CXR PA - PHP 300' },
              { name: 'Elbow APL - PHP 750' },
              { name: 'Forearm APL - PHP 750' },
              { name: 'Knee APL - PHP 750' },
              { name: 'Lumbar APL - PHP 400' },
              { name: 'Pelvis AP - PHP 850' }
          ]
      },
      {
          category: 'Thyroid Test',
          tests: [
              { name: 'T3 - PHP 1200' },
              { name: 'T4 - PHP 1200' },
              { name: 'TSH - PHP 1200' }
          ]
      },
      {
          category: 'Clinical Microscopy',
          tests: [
              { name: 'Urinalysis - PHP 80' },
              { name: 'Stool/Fecalysis - PHP 80' },
              { name: 'Micral Test - PHP 450' },
              { name: 'Pregnancy Test (HCG) - PHP 200' },
              { name: 'ECG Leads - PHP 400' }
          ]
      }
  ];


  const packageList = [
      {
          packageName: 'Basic Health Package',
          price: 1500,
          details: 'Includes CBC, Urinalysis, FBS, Total Cholesterol',
      },
      {
          packageName: 'Comprehensive Health Package',
          price: 3000,
          details: 'Includes CBC, FBS, Lipid Profile, Liver Function Test, ECG',
      },
      {
          packageName: 'Diabetes Screening Package',
          price: 2000,
          details: 'Includes FBS, HBA1C, Creatinine, BUA, ECG',
      },
      {
          packageName: 'Heart Check-Up Package',
          price: 3500,
          details: 'Includes ECG, Lipid Profile, 2D Echo, Chest X-ray',
      },
      {
          packageName: 'Senior Citizen Wellness Package',
          price: 2500,
          details: 'Includes CBC, Urinalysis, Creatinine, ECG, Chest X-ray',
      },
      {
          packageName: 'Pre-Employment Package',
          price: 1800,
          details: 'Includes CBC, Urinalysis, Chest X-ray, ECG',
      },
  ];


  const panelList = [
      {
          panelName: 'Panel A',
          price: 1600,
          tests: [
              'Lipid Profile',
              'FBS',
              'SGPT(ALT)',
              'Creatinine',
              'BUA (Blood Uric Acid)',
              'ECG',
              'Chest-Xray PA View',
              'CBC',
              'Urinalysis',
          ],
      },
      {
          panelName: 'Panel B (For Diabetic & Hypertensive Patients)',
          price: 2380,
          tests: [
              'Lipid Profile',
              'FBS',
              'SGPT(ALT)',
              'Creatinine',
              'BUA (Blood Uric Acid)',
              'ECG',
              'Chest-Xray PA View',
              'CBC',
              'HBA1C',
          ],
      },
      {
          panelName: 'Panel C',
          price: 850,
          tests: [
              'FBS',
              'Total Cholesterol',
              'SGPT(ALT)',
              'Creatinine',
              'BUA (Blood Uric Acid)',
          ],
      },
      {
          panelName: 'Panel D',
          price: 900,
          tests: [
              'Lipid Profile',
              'SGPT(ALT)',
              'Creatinine',
              'BUA (Blood Uric Acid)',
          ],
      },
      {
          panelName: 'Panel E',
          price: 1300,
          tests: [
              'HBA1C',
              'Creatinine',
              'SGPT(ALT)',
          ],
      },
      {
          panelName: 'Thyroid Panel',
          price: 3300,
          tests: [
              'T3',
              'T4',
              'TSH',
          ],
      },
      {
          panelName: 'Lipid Panel',
          price: 650,
          tests: [
              'Total Cholesterol',
              'Triglycerides',
              'Direct HDL',
              'LDL',
              'VLDL',
          ],
      },
  ];


  const [currentLabIndex, setCurrentLabIndex] = useState(0);


  const handleLabNext = () => {
      setCurrentLabIndex((prevIndex) => (prevIndex + 1) % labImages.length);
  };


  const handleLabPrev = () => {
      setCurrentLabIndex((prevIndex) => (prevIndex - 1 + labImages.length) % labImages.length);
  };


  const labImages = [
      {
          src: labImage1,
          title: 'Chemistry',
          description: 'Extensive chemistry tests including FBS, Total Cholesterol, Triglycerides, and more.',
          services: servicesList[0]?.tests || [],
      },
      {
          src: labImage2,
          title: 'Hematology',
          description: 'Comprehensive hematology tests including CBC, Blood Typing, NS1, and Dengue Duo.',
          services: servicesList[1]?.tests || [],
      },
      {
          src: labImage3,
          title: 'Serology',
          description: 'Reliable serology tests including HBs AG, Syphilis, H.Pylori, and Anti-HAV.',
          services: servicesList[2]?.tests || [],
      },
      {
          src: labImage4,
          title: 'X-Ray Imaging',
          description: 'High-quality X-ray imaging for accurate diagnostic support across various conditions.',
          services: servicesList[3]?.tests || [],
      },
      {
          src: labImage5,
          title: 'Thyroid Test',
          description: 'Thyroid health assessments including T3, T4, and TSH testing.',
          services: servicesList[4]?.tests || [],
      },
      {
          src: labImage6,
          title: 'Clinical Microscopy',
          description: 'Detailed clinical microscopy including Urinalysis, Stool Analysis, and Pregnancy Test.',
          services: servicesList[5]?.tests || [],
      },
      {
          src: labPackageImage,
          title: 'Lab Packages',
          description: 'Various health packages tailored to meet your wellness needs.',
          services: packageList?.map((packageItem) => ({
              name: `${packageItem.packageName} - PHP ${packageItem.price}`,
          })) || [],
      },
      {
          src: labPanelImage,
          title: 'Lab Panels',
          description: 'Specialized lab panels for comprehensive diagnostics and preventive care.',
          services: panelList?.map((panelItem) => ({
              name: `${panelItem.panelName} - PHP ${panelItem.price}`,
          })) || [],
      },
  ];

  return (
    <div className="landing-page">
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
            {/* Replace Login button with Profile logo */}
            <li>
              <button className="profile-btn" onClick={handleClick} >
                <img src={profileLogo} alt="Profile" className="profile-icon" />
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <img src={headerImage} alt="Header Background" className="header-image" />

      <main className="landing-content">
        <div className="content-wrapper">
          {/* First Section: Laboratory Services */}

          <div className="content-section">
            <div className="carousel">
                <button onClick={handleLabPrev} className="carousel-arrow left-arrow">❮</button>
                <div className="image-section">
                    <img src={labImages[currentLabIndex].src} alt="Laboratory Service" className="content-image" />
                    <div className="preview-hover-area">
                        {labImages[currentLabIndex].services.map((service, index) => (
                            <div key={index} className="preview-overlay">
                                <h3>{service.name.split(' - ')[0]}</h3>
                                <p>{service.name.split(' - ')[1]}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <button onClick={handleLabNext} className="carousel-arrow right-arrow">❯</button>
            </div>
            <div className="text-section">
                <h2>{labImages[currentLabIndex].title}</h2>
                <p>{labImages[currentLabIndex].description}</p>
                <button className="read-more-btn" onClick={handleAppointment}>Book an Appointment</button>
            </div>
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
}

export default Member;