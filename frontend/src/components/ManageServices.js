import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/ManageServices.css';
import coopLogo from '../pic/cooplogo.png';
import secondLogo from '../pic/3.png';




const Services = () => {
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [panels, setPanels] = useState([]);
  const [serviceForm, setServiceForm] = useState({ name: '', category: '', price: '' });
  const [panelForm, setPanelForm] = useState({ name: '', services: '', price: '' });
  const [packageForm, setPackageForm] = useState({ name: '', services: '', price: '' });
  const [editServiceId, setEditServiceId] = useState(null);
  const [editPackageId, setEditPackageId] = useState(null);
  const [editPanelId, setEditPanelId] = useState(null);
  const [searchService, setSearchService] = useState('');
  const [searchPackage, setSearchPackage] = useState('');
  const [searchPanels, setSearchPanel] = useState('');
  const [sortService, setSortService] = useState({ column: null, direction: 'asc' });
  const [sortPackage, setSortPackage] = useState({ column: null, direction: 'asc' });
  const [sortPanel, setSortPanel] = useState({ column: null, direction: 'asc' });
  const [servicePage, setServicePage] = useState(1);
  const [packagePage, setPackagePage] = useState(1);
  const [panelPage, setPanelPage] = useState(1);
  const itemsPerPage = 10;




  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:3003/services');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };


    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://localhost:3003/packages');
        setPackages(response.data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };


    const fetchPanels = async () => {
        try {
          const response = await axios.get('http://localhost:3003/panels');
          setPanels(response.data);
        } catch (error) {
          console.error('Error fetching panels:', error);
        }
      };


    fetchServices();
    fetchPackages();
    fetchPanels();
  }, []);




  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3003/services', serviceForm);
      setServices([...services, response.data]);
      setServiceForm({ name: '', category: '', price: '' });
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };


  const handleEditService = (id) => {
    const serviceToEdit = services.find((service) => service._id === id);
    setServiceForm(serviceToEdit);
    setEditServiceId(id);
  };




  const handleUpdateService = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3003/services/${editServiceId}`, serviceForm);
      setServices(services.map((service) => (service._id === editServiceId ? serviceForm : service)));
      setServiceForm({ name: '', category: '', price: '' });
      setEditServiceId(null);
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };


  const handleDeleteService = async (id) => {
    try {
      await axios.delete(`http://localhost:3003/services/${id}`);
      setServices(services.filter((service) => service._id !== id));
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };


  // Add/Edit/Delete Handlers for Packages
  const handleAddPackage = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3003/packages', packageForm);
      setPackages([...packages, response.data]);
      setPackageForm({ name: '', details: '', price: '' });
    } catch (error) {
      console.error('Error adding package:', error);
    }
  };


  const handleEditPackage = (id) => {
    const packageToEdit = packages.find((pkg) => pkg._id === id);
    setPackageForm(packageToEdit);
    setEditPackageId(id);
  };




  const handleUpdatePackage = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3003/packages/${editPackageId}`, packageForm);
      setPackages(packages.map((pkg) => (pkg._id === editPackageId ? packageForm : pkg)));
      setPackageForm({ name: '', details: '', price: '' });
      setEditPackageId(null);
    } catch (error) {
      console.error('Error updating package:', error);
    }
  };




  const handleDeletePackage = async (id) => {
    try {
      await axios.delete(`http://localhost:3003/packages/${id}`);
      setPackages(packages.filter((pkg) => pkg._id !== id));
    } catch (error) {
      console.error('Error deleting package:', error);
    }
  };


  // Add/Edit/Delete Handlers for Panels
  const handleAddPanel = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3003/panels', panelForm);
      setPanels([...panels, response.data]);
      setPanelForm({ name: '', services: '', price: '' });
    } catch (error) {
      console.error('Error adding panel:', error);
    }
  };
   
   
  const handleEditPanels = (id) => {
    const panelToEdit = panels.find((panel) => panel._id === id);
    setPanelForm(panelToEdit);
    setEditPanelId(id);
  };
   
   
  const handleUpdatePanel = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3003/panels/${editPanelId}`, panelForm);
      setPanels(panels.map((panel) => (panel._id === editPanelId ? panelForm : panel)));
      setPanelForm({ name: '', details: '', price: '' });
      setEditPanelId(null);
    } catch (error) {
      console.error('Error updating panel:', error);
    }
  };  
   
   
  const handleDeletePanel = async (id) => {
    try {
      await axios.delete(`http://localhost:3003/panels/${id}`);
      setPanels(panels.filter((panel) => panel._id !== id));
    } catch (error) {
      console.error('Error deleting panel:', error);
    }
  };




  // Handle form changes
  const handleChange = (e, setForm) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };




  // Sort data
  const handleSort = (column, table) => {
    const sortConfig = table === 'services' ? sortService : sortPackage;
    const direction = sortConfig.column === column && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    const sortedData = [...(table === 'services' ? services : packages)].sort((a, b) => {
      if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    if (table === 'services') {
      setSortService({ column, direction });
      setServices(sortedData);
    }
    if (table === 'packages')  {
      setSortPackage({ column, direction });
      setPackages(sortedData);
    }
    if (table === 'panels')  {
        setSortPanel({ column, direction });
        setPanels(sortedData);
      }
  };




  // Pagination
  const handlePageChange = (page, table) => {
    if (table === 'services') {
      setServicePage(page);
    } else if (table === 'packages') {
      setPackagePage(page);
    } else if (table === 'panels') {
      setPanelPage(page);
    }
  };


  // Filtered and paginated data
  const filteredServices = services
  .filter((service) => service.name.toLowerCase().includes(searchService.toLowerCase()))
  .slice((servicePage - 1) * itemsPerPage, servicePage * itemsPerPage);


  const filteredPackages = packages
    .filter((pkg) => pkg.name.toLowerCase().includes(searchPackage.toLowerCase()))
    .slice((packagePage - 1) * itemsPerPage, packagePage * itemsPerPage);


  const filteredPanels = panels
    .filter((panel) => panel.name.toLowerCase().includes(searchPanels.toLowerCase()))
    .slice((panelPage - 1) * itemsPerPage, panelPage * itemsPerPage);




  return (
    <div className="services-container">
      {/* Header */}
      <header className="landing-header">
        <div className="logo-container">
          <img src={coopLogo} alt="Coop Logo" className="coop-logo" />
          <img src={secondLogo} alt="Second Logo" className="second-logo" />
        </div>
        <nav>
          <ul>
            <li><a href="/admins">Home</a></li>
            <li><a href="/products">Products and Services</a></li>
            <li><a href="/allied-business">Allied Business</a></li>
            <li><a href="/membership">Membership</a></li>
            <li><a href="/branches">Branches</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><button className="logout-btn">Logout</button></li>
          </ul>
        </nav>
      </header>








        <div className= "servi">
      {/* Services Section */}
      <h2>Services</h2>
      <input
        type="text"
        placeholder="Search Services"
        className="search-bar"
        value={searchService}
        onChange={(e) => setSearchService(e.target.value)}
      />
     
      <div className="table-form-container">
        {/* Services Table */}
        <div>
          <table className="services-table">
            <thead>
              <tr>
                <th>
                  Service Name <button onClick={() => handleSort('name', 'services')}>⇅</button>
                </th>
                <th>Category</th>
                <th>
                  Price <button onClick={() => handleSort('price', 'services')}>⇅</button>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td>{service.name}</td>
                    <td>{service.category}</td>
                    <td>{service.price}</td>
                    <td>
                      <button onClick={() => handleEditService(service._id)}>Edit</button>
                      <button onClick={() => handleDeleteService(service._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No entries.</td>
                </tr>
              )}
            </tbody>
          </table>




          {/* Services Pagination */}
          <div className="pagination">
            <button onClick={() => handlePageChange(servicePage - 1, 'services')} disabled={servicePage === 1}>
              {'<'}
            </button>
            <button onClick={() => handlePageChange(servicePage + 1, 'services')} disabled={servicePage === Math.ceil(services.length / itemsPerPage)}>
              {'>'}
            </button>
          </div>
        </div>




        {/* Add/Edit Service Form */}
        <form className="add-service-form" onSubmit={editServiceId ? handleUpdateService : handleAddService}>
          <input
            type="text"
            placeholder="Service Name"
            name="name"
            value={serviceForm.name}
            onChange={(e) => handleChange(e, setServiceForm)}
          />
          <input
            type="text"
            placeholder="Category"
            name="category"
            value={serviceForm.category}
            onChange={(e) => handleChange(e, setServiceForm)}
          />
          <input
            type="number"
            placeholder="Price"
            name="price"
            value={serviceForm.price}
            onChange={(e) => handleChange(e, setServiceForm)}
          />
          <button type="submit">{editServiceId ? 'Update' : 'Add'} Service</button>
        </form>
      </div>




      {/* Package Section */}
      <h2>Packages</h2>
      <input
        type="text"
        placeholder="Search Packages"
        className="search-bar"
        value={searchPackage}
        onChange={(e) => setSearchPackage(e.target.value)}
      />
     
      <div className="table-form-container">
        {/* Packages Table */}
        <div>
          <table className="services-table">
            <thead>
              <tr>
                <th>
                  Package Name <button onClick={() => handleSort('name', 'packages')}>⇅</button>
                </th>
                <th>Services</th>
                <th>
                  Price <button onClick={() => handleSort('price', 'packages')}>⇅</button>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPackages.length > 0 ? (
                filteredPackages.map((pkg) => (
                  <tr key={pkg.id}>
                    <td>{pkg.name}</td>
                    <td>{pkg.details}</td>
                    <td>{pkg.price}</td>
                    <td>
                      <button onClick={() => handleEditPackage(pkg._id)}>Edit</button>
                      <button onClick={() => handleDeletePackage(pkg._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No entries.</td>
                </tr>
              )}
            </tbody>
          </table>




          {/* Packages Pagination */}
          <div className="pagination">
            <button onClick={() => handlePageChange(packagePage - 1, 'packages')} disabled={packagePage === 1}>
              {'<'}
            </button>
            <button onClick={() => handlePageChange(packagePage + 1, 'packages')} disabled={packagePage === Math.ceil(packages.length / itemsPerPage)}>
              {'>'}
            </button>
          </div>
        </div>




        {/* Add/Edit Package Form */}
        <form className="add-service-form" onSubmit={editPackageId ? handleUpdatePackage : handleAddPackage}>
          <input
            type="text"
            placeholder="Package Name"
            name="name"
            value={packageForm.name}
            onChange={(e) => handleChange(e, setPackageForm)}
          />
          <input
            type="text"
            placeholder="Services"
            name="details"
            value={packageForm.details}
            onChange={(e) => handleChange(e, setPackageForm)}
          />
          <input
            type="number"
            placeholder="Price"
            name="price"
            value={packageForm.price}
            onChange={(e) => handleChange(e, setPackageForm)}
          />
          <button type="submit">{editPackageId ? 'Update' : 'Add'} Package</button>
        </form>
      </div>


      {/* Panel Section */}
      <h2>Panels</h2>
      <input
        type="text"
        placeholder="Search Panels"
        className="search-bar"
        value={searchPanels}
        onChange={(e) => setSearchPanel(e.target.value)}
      />
     
      <div className="table-form-container">
        {/* Panels Table */}
        <div>
          <table className="services-table">
            <thead>
              <tr>
                <th>
                  Panel Name <button onClick={() => handleSort('name', 'panels')}>⇅</button>
                </th>
                <th>Services</th>
                <th>
                  Price <button onClick={() => handleSort('price', 'panels')}>⇅</button>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPanels.length > 0 ? (
                filteredPanels.map((panels) => (
                  <tr key={panels.id}>
                    <td>{panels.name}</td>
                    <td>{panels.details}</td>
                    <td>{panels.price}</td>
                    <td>
                      <button onClick={() => handleEditPanels(panels._id)}>Edit</button>
                      <button onClick={() => handleDeletePanel(panels._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No entries.</td>
                </tr>
              )}
            </tbody>
          </table>




          {/* Panels Pagination */}
          <div className="pagination">
            <button onClick={() => handlePageChange(panelPage - 1, 'panels')} disabled={panelPage === 1}>
              {'<'}
            </button>
            <button onClick={() => handlePageChange(panelPage + 1, 'panels')} disabled={panelPage === Math.ceil(panels.length / itemsPerPage)}>
              {'>'}
            </button>
          </div>
        </div>




        {/* Add/Edit Package Form */}
        <form className="add-service-form" onSubmit={editPanelId ? handleUpdatePanel : handleAddPanel}>
          <input
            type="text"
            placeholder="Panel Name"
            name="name"
            value={panelForm.name}
            onChange={(e) => handleChange(e, setPanelForm)}
          />
          <input
            type="text"
            placeholder="Services"
            name="details"
            value={panelForm.details}
            onChange={(e) => handleChange(e, setPanelForm)}
          />
          <input
            type="number"
            placeholder="Price"
            name="price"
            value={panelForm.price}
            onChange={(e) => handleChange(e, setPanelForm)}
          />
          <button type="submit">{editPanelId ? 'Update' : 'Add'} Panel</button>
        </form>
      </div>
      </div>








      {/* Footer */}
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




export default Services;
