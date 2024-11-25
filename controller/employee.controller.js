const cloudinary = require("cloudinary");


// Function to create a new employee
const createNewEmployee = async (req, res) => {
  const {
    userId,
    profilePic,
    lastName,
    firstName,
    middleInitial,
    maritalStatus,
    bloodType,
    position,
    birthdate,
    age,
    nationality,
    address,
    contactNo,
    email,
    licenseId,
    profession,
    companyName,
    companyContact,
    workAddress,
    emergencyName,
    emergencyRelationship,
    emergencyAddress,
    emergencyContact,
  } = req.body;

  try {
    // Set fields from the request body
    
    const Employee = new Parse.Object("Employee");

    if (!profilePic) {
        return res.status(400).json({ message: 'No image provided' });
    }

    if(profilePic){
        const imageResult = await cloudinary.uploader.upload(profilePic);
        Employee.set("profilePic", imageResult.secure_url);
    }
    Employee.set("userId", userId)
    Employee.set("lastName", lastName);
    Employee.set("firstName", firstName);
    Employee.set("middleInitial", middleInitial);
    Employee.set("maritalStatus", maritalStatus);
    Employee.set("bloodType", bloodType);
    Employee.set("position", position);
    Employee.set("birthdate", new Date(birthdate)); // Ensure this is parsed as a date
    Employee.set("age", parseInt(age)); // Convert age to an integer
    Employee.set("nationality", nationality);
    Employee.set("address", address);
    Employee.set("contactNo", contactNo);
    Employee.set("email", email);
    Employee.set("licenseId", licenseId);
    Employee.set("profession", profession);
    Employee.set("companyName", companyName);
    Employee.set("companyContact", companyContact);
    Employee.set("workAddress", workAddress);
    Employee.set("emergencyName", emergencyName);
    Employee.set("emergencyRelationship", emergencyRelationship);
    Employee.set("emergencyAddress", emergencyAddress);
    Employee.set("emergencyContact", emergencyContact);

    // Save the employee to Parse Server
    const savedEmployee = await Employee.save();

    // Send a success response
    res.status(201).json({
      message: "Employee created successfully",
      data: savedEmployee,
    });
  } catch (error) {
    // Handle errors
    console.error("Error creating employee:", error.message);
    console.log(error)
    res.status(400).json({ message: "Error creating employee", error: error.message });
  }
};


const getAllEmployee = async (req, res) => {
    try{
        const query = new Parse.Query("Employee")
        const employee = await query.find();

        res.status(200).json(employee)
    }
    catch(error){
        res.status(400).json(error)
    }
}


// Function to update an employee
const updateEmployee = async (req, res) => {
    const { employeeId } = req.params;  // Assume we are identifying employees by userId
    const {
      userId,
      profilePic,
      lastName,
      firstName,
      middleInitial,
      maritalStatus,
      bloodType,
      position,
      birthdate,
      age,
      nationality,
      address,
      contactNo,
      email,
      licenseId,
      profession,
      companyName,
      companyContact,
      workAddress,
      emergencyName,
      emergencyRelationship,
      emergencyAddress,
      emergencyContact,
    } = req.body;
  
    try {

      const query = new Parse.Query("Employee");
      const employee = await query.get(employeeId); 
  
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      // Update fields with the new data
      if (profilePic) {
        // If a new profilePic is provided, upload it to Cloudinary
        const imageResult = await cloudinary.uploader.upload(profilePic);
        employee.set("profilePic", imageResult.secure_url);
      }
      if (userId) employee.set("userId", userId);
      if (lastName) employee.set("lastName", lastName);
      if (firstName) employee.set("firstName", firstName);
      if (middleInitial) employee.set("middleInitial", middleInitial);
      if (maritalStatus) employee.set("maritalStatus", maritalStatus);
      if (bloodType) employee.set("bloodType", bloodType);
      if (position) employee.set("position", position);
      if (birthdate) employee.set("birthdate", birthdate);
      if (age) employee.set("age", age);
      if (nationality) employee.set("nationality", nationality);
      if (address) employee.set("address", address);
      if (contactNo) employee.set("contactNo", contactNo);
      if (email) employee.set("email", email);
      if (licenseId) employee.set("licenseId", licenseId);
      if (profession) employee.set("profession", profession);
      if (companyName) employee.set("companyName", companyName);
      if (companyContact) employee.set("companyContact", companyContact);
      if (workAddress) employee.set("workAddress", workAddress);
      if (emergencyName) employee.set("emergencyName", emergencyName);
      if (emergencyRelationship) employee.set("emergencyRelationship", emergencyRelationship);
      if (emergencyAddress) employee.set("emergencyAddress", emergencyAddress);
      if (emergencyContact) employee.set("emergencyContact", emergencyContact);
  
      // Save the updated employee object
      const updatedEmployee = await employee.save();
  
      // Send success response
      res.status(200).json({
        message: "Employee updated successfully",
        data: updatedEmployee,
      });
    } catch (error) {
      console.error("Error updating employee:", error.message);
      res.status(400).json({ message: "Error updating employee", error: error.message });
    }
  };


const deleteEmployee = async (req, res) => {
    const { employeeId } = req.params; 
  
    try {
      const query = new Parse.Query("Employee");
      const employee = await query.get(employeeId); 
  
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      // Delete the employee record
      await employee.destroy();
  
      // Send success response
      res.status(200).json({
        message: "Employee deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting employee:", error.message);
      res.status(400).json({ message: "Error deleting employee", error: error.message });
    }
  };
  
  

module.exports = {
  createNewEmployee,
  getAllEmployee,
  updateEmployee,
  deleteEmployee
};
