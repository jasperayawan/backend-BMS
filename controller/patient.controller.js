const cloudinary = require("cloudinary");

// Function to create a new patient
const createNewPatient = async (req, res) => {
  try {
    // Extract patient details from the request body
    const {
      profilePicture,
      firstname,
      lastname,
      middleInitial,
      civilStatus,
      purok,
      barangay,
      municipality,
      province,
      bod,
      age,
      nationality,
      religion,
      patientIdNo,
      birthPlace,
      bloodType,
      contact,
      occupation,
      role,
      email,
      password,
      houseHoldMonthlyIncome,
      livingChild,
      nonLivingChild,
      healthcareAssistance,
      emergencyFirstName,
      emerygencyLastName,
      emergencyInitial,
      emergencyRelationship,
      emergencyAddress,
      emergencyBod,
      emergencyAge,
      emergencyOcccupation,
      emergencyCivilStatus,
      emergencyNationality,
      emergencyReligion,
      emergencyContact
    } = req.body;

    // Validate required fields
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ error: 'Firstname, lastname, email, and password are required.' });
    }

    // Check if the email is already registered
    const query = new Parse.Query(Parse.User);
    query.equalTo('email', email);
    const existingUser = await query.first({ useMasterKey: true });

    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use.' });
    }

    // Create a new Parse.User instance
    const user = new Parse.User();
    user.set('username', email); // Use email as username
    user.set('password', password);
    user.set('email', email);

    // Add patient-specific fields to the User object
    if(profilePicture){
        const imageResult = await cloudinary.uploader.upload(profilePicture);
        user.set("profilePicture", imageResult.secure_url);
    }
    user.set('firstname', firstname);
    user.set('lastname', lastname);
    user.set('middleInitial', middleInitial);
    user.set('civilStatus', civilStatus);
    user.set('purok', purok);
    user.set('barangay', barangay);
    user.set('municipality', municipality);
    user.set('province', province);
    user.set('bod', bod);
    user.set('age', age);
    user.set('role', role == null ? 'PATIENT' : role);
    user.set('nationality', nationality);
    user.set('religion', religion);
    user.set('patientIdNo', patientIdNo);
    user.set('birthPlace', birthPlace);
    user.set('bloodType', bloodType);
    user.set('contact', contact);
    user.set('occupation', occupation);
    user.set('houseHoldMonthlyIncome', houseHoldMonthlyIncome);
    user.set('livingChild', livingChild);
    user.set('nonLivingChild', nonLivingChild);
    user.set('healthcareAssistance', healthcareAssistance);

    // Add emergency contact information
    user.set('emergencyFirstName', emergencyFirstName);
    user.set('emerygencyLastName', emerygencyLastName);
    user.set('emergencyInitial', emergencyInitial);
    user.set('emergencyRelationship', emergencyRelationship);
    user.set('emergencyAddress', emergencyAddress);
    user.set('emergencyBod', emergencyBod);
    user.set('emergencyAge', emergencyAge);
    user.set('emergencyOcccupation', emergencyOcccupation);
    user.set('emergencyCivilStatus', emergencyCivilStatus);
    user.set('emergencyNationality', emergencyNationality);
    user.set('emergencyReligion', emergencyReligion);
    user.set('emergencyContact', emergencyContact);

    // Save the user to Parse
    await user.signUp();

    // Respond with success
    res.status(201).json({ message: 'Patient registered successfully!', user });
  } catch (error) {
    console.error('Error creating patient:', error.message);
    res.status(500).json({ error: 'An error occurred while creating the patient.' });
  }
};


const updatePatient = async (req, res) => {
    try {
      const { id } = req.params; // Patient ID to update
      const updatedData = req.body; // Updated fields
  
      // Query the patient by ID
      const query = new Parse.Query(Parse.User);
      const patient = await query.get(id);
  
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found.' });
      }
  
      // Update patient fields
      for (const key in updatedData) {
        if (updatedData.hasOwnProperty(key)) {
          patient.set(key, updatedData[key]);
        }
      }
  
      // Save the updated patient
      await patient.save();
  
      res.status(200).json({ message: 'Patient updated successfully!', patient });
    } catch (error) {
      console.error('Error updating patient:', error.message);
      res.status(500).json({ error: 'An error occurred while updating the patient.' });
    }
  };

  const getAllPatients = async (req, res) => {
    try {
      const query = new Parse.Query(Parse.User);
  
      // Optionally, filter by a role or specific field (e.g., "Patient")
      query.equalTo('role', 'Patient'); 
  
      const patients = await query.find();
  
      res.status(200).json({ patients });
    } catch (error) {
      console.error('Error fetching patients:', error.message);
      res.status(500).json({ error: 'An error occurred while fetching patients.' });
    }
  };

  const getPatientById = async (req, res) => {
    try {
      const { id } = req.params; // Patient ID to retrieve
  
      // Query the patient by ID
      const query = new Parse.Query(Parse.User);
      const patient = await query.get(id);
  
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found.' });
      }
  
      res.status(200).json({ patient });
    } catch (error) {
      console.error('Error fetching patient by ID:', error.message);
      res.status(500).json({ error: 'An error occurred while fetching the patient.' });
    }
  };

  
  const deletePatient = async (req, res) => {
    try {
      const { id } = req.params; // Patient ID to delete
  
      // Query the patient by ID
      const query = new Parse.Query(Parse.User);
      const patient = await query.get(id);
  
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found.' });
      }
  
      // Delete the patient
      await patient.destroy();
  
      res.status(200).json({ message: 'Patient deleted successfully!' });
    } catch (error) {
      console.error('Error deleting patient:', error.message);
      res.status(500).json({ error: 'An error occurred while deleting the patient.' });
    }
  };
  

  module.exports = {
    createNewPatient,
    updatePatient,
    getAllPatients,
    getPatientById,
    deletePatient
  };
  