const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const MemberModel = require ('./models/Members')
const AppointmentModel = require ('./models/Appointments');
const { PackageModel, ServiceModel, PanelModel } = require('./models/Services');
const fs = require('fs');
const path = require('path');
const { Buffer } = require('buffer');




const app = express();
const port = 3003;
app.use(cors());
app.use(express.json());


mongoose.connect('mongodb://localhost:27017/wellnessII',{
    useNewUrlParser: true,
    useUnifiedTopology:true
})
.then(db=>console.log('DB is connected'))
.catch(err=> console.log(err));


const multer = require('multer');


// Configure Multer for PDF file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true); // Accept PDF files
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});




app.post('/login', async (req, res) => {
    const { memId, password } = req.body;
    try {
        // Check if the member exists
        const user = await MemberModel.findOne({ memId });
        if (!user) {
            return res.status(404).json({ message: "Member ID not found" });
        }




        // Directly compare the provided password with the stored one
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid Member ID or password" });
        }




        // If valid, return success with user data
        res.json({ memId: user.memId, role: user.role, name: user.name, age: user.age });
    } catch (error) {
        res.status(500).json({ message: "An error occurred during login" });
    }
});


app.get('/members/:memId', async (req, res) => {
    const { memId } = req.params;
 
    try {
      const member = await MemberModel.findOne({ memId });
     
      if (!member) {
        return res.status(404).json({ message: 'Member not found' });
      }
 
      res.json(member);  // Return the full member data
    } catch (error) {
      console.error('Error fetching member:', error);
      res.status(500).json({ message: 'Error fetching member details' });
    }
  });


app.post('/appointments', async (req, res) => {
  try {
    const { memId, date, time, selectedServices, total } = req.body;


    // Create a new laboratory appointment
    const newLaboratoryAppointment = new AppointmentModel({
      memId,
      date,
      time,
      selectedServices,
      total,
      status: 'Pending',
      result: { data: null, contentType: null },
    });
    // Save the appointment to the Laboratories collection
    const savedAppointment = await newLaboratoryAppointment.save();
    res.status(201).json({ message: 'Appointment saved successfully!', _id: savedAppointment._id });
  } catch (error) {
    console.error('Error saving appointment:', error);




    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }




    res.status(500).json({ message: 'Error saving appointment', error: error.message });
  }
});


app.get('/appointments', async (req, res) => {
  try {
      const appointmentsList = await AppointmentModel.find(); // Fetch all appointments


      const appointments = appointmentsList.map(appointment => {
        // Check if there is result data and generate pdfUrl if it exists
        if (appointment.result && appointment.result.data) {
          const pdfBase64 = appointment.result.data.toString('base64');
          const pdfUrl = `data:${appointment.result.contentType};base64,${pdfBase64}`;


          // Flatten the structure to return properties directly
          return {
            _id: appointment._id,
            date: appointment.date,
            memId: appointment.memId,
            selectedServices: appointment.selectedServices,
            status: appointment.status,
            time: appointment.time,
            total: appointment.total,
            result: appointment.result, // Keep result if needed
            pdfUrl // Attach the generated PDF URL
          };
        }


        // Return appointment as is if no result data
        return {
          _id: appointment._id,
          date: appointment.date,
          memId: appointment.memId,
          selectedServices: appointment.selectedServices,
          status: appointment.status,
          time: appointment.time,
          total: appointment.total
        };
      });


      res.json(appointments); // Send the processed appointments as a response
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving appointments', error });
  }
});


app.delete('/appointments/delete-results/:appointmentId', async (req, res) => {
  const { appointmentId } = req.params;


  try {
    // Find the appointment by ID and update its 'results' field to null or remove the field
    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      appointmentId,
      { $unset: { 'result.data': null,
        'result.contentType': null
       },// Unset the 'results' field
        $set: {
          status: 'Pending',
      }, },
     
      { new: true } // Return the updated document
    );


    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }


    res.status(200).json({
      message: 'Results successfully deleted',
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error('Error deleting results:', error);
    res.status(500).json({ message: 'Failed to delete results', error });
  }
});




app.put('/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Status will be 'Cancelled', 'Pending', 'Successful', etc.


    // Find the appointment by ID and update its status
    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      id,
      { status: status },
      { new: true } // Return the updated document
    );


    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }


    res.json(updatedAppointment); // Respond with the updated appointment
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Error updating appointment', error: error.message });
  }
});


app.get('/appointments/:memId', async (req, res) => {
  try {
    const { memId } = req.params;
    const appointmentsList = await AppointmentModel.find({ memId });  // Fetch all appointments for the given member


    if (!appointmentsList.length) {
      return res.status(404).json({ message: 'No appointments found for this member' });
    }


    // Map through each appointment to check for result data and generate pdfUrl if it exists
    const appointments = appointmentsList.map(appointment => {
      if (appointment.result && appointment.result.data) {
        const pdfBase64 = appointment.result.data.toString('base64');
        const pdfUrl = `data:${appointment.result.contentType};base64,${pdfBase64}`;


        // Flatten the structure to return properties directly with the generated PDF URL
        return {
          _id: appointment._id,
          date: appointment.date,
          memId: appointment.memId,
          selectedServices: appointment.selectedServices,
          status: appointment.status,
          time: appointment.time,
          total: appointment.total,
          result: appointment.result, // Keep result if needed
          pdfUrl // Attach the generated PDF URL
        };
      }


      // Return appointment as is if no result data
      return {
        _id: appointment._id,
        date: appointment.date,
        memId: appointment.memId,
        selectedServices: appointment.selectedServices,
        status: appointment.status,
        time: appointment.time,
        total: appointment.total
      };
    });


    res.json(appointments); // Send the processed appointments as a response
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving appointments', error });
  }
});


app.get('/services', async (req, res) => {
  try {
    const services = await ServiceModel.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching services', error: err });
  }
});


// Create a service
app.post('/services', async (req, res) => {
  const { name, category, price } = req.body;
  try {
    const newService = await ServiceModel.create({ name, category, price });
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Update a service
app.put('/services/:id', async (req, res) => {
  const { name, category, price } = req.body;
  try {
    const updatedService = await ServiceModel.findByIdAndUpdate(req.params.id, { name, category, price }, { new: true });
    res.json(updatedService);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Delete a service
app.delete('/services/:id', async (req, res) => {
  try {
    const result = await ServiceModel.findByIdAndDelete(req.params.id);
    if (!result) {
      console.error("Service not found with ID:", req.params.id);
      return res.status(404).json({ error: "Service not found" });
    }
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    console.error("Error deleting service:", err.message);
    res.status(500).json({ error: err.message });
  }
});




app.get('/packages', async (req, res) => {
  try {
    const packages = await PackageModel.find();
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching packages', error: err });
  }
});


app.post('/packages', async (req, res) => {
  const { name, details, price } = req.body;
  try {
    const newPackage = await PackageModel.create({ name, details, price });
    res.status(201).json(newPackage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.put('/packages/:id', async (req, res) => {
  const { name, details, price } = req.body;
  try {
    const updatedPackage = await PackageModel.findByIdAndUpdate(req.params.id, { name, details, price }, { new: true });
    res.json(updatedPackage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.delete('/packages/:id', async (req, res) => {
  try {
    await PackageModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Package deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/panels', async (req, res) => {
  try {
    const panel = await PanelModel.find();
    res.json(panel);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching panels', error: err });
  }
});


// Create a panel
app.post('/panels', async (req, res) => {
  const { name, details, price } = req.body;
  try {
    const newPanel = await PanelModel.create({ name, details, price });
    res.status(201).json(newPanel);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Update a panel
app.put('/panels/:id', async (req, res) => {
  const { name, services, price } = req.body;
  try {
    const updatedPanel = await PanelModel.findByIdAndUpdate(
      req.params.id,
      { name, services, price },
      { new: true }
    );
    res.json(updatedPanel);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Delete a panel
app.delete('/panels/:id', async (req, res) => {
  try {
    await PanelModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Panel deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/appointments/:id/upload-pdf', upload.single('result'), async (req, res) => {
  const { id } = req.params;


  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded or incorrect file format' });
    }


    // Update the appointment with the uploaded PDF
    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      id,
      {
        $set: {
          'result.data': req.file.buffer,
          'result.contentType': req.file.mimetype,
          status: 'Success',
        },
      },
      { new: true, runValidators: true }
    );


    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }


    res.json({ message: 'PDF uploaded successfully', appointment: updatedAppointment });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    res.status(500).json({ message: 'Error uploading PDF', error: error.message });
  }
});


app.listen(port,()=>{
    console.log('Example app listening on port ${port}');
});
