// Create a new Parse Object class for OtherServices
const OtherServices = Parse.Object.extend("OtherServices");

// Create new service record
const createOtherService = async (req, res) => {
  try {
    const {
      userId,
      servicesAvailed,
      date,
      firstName,
      middleName,
      lastName,
      sex,
      status,
      dateOfBirth,
      age,
      bloodType,
      bloodPressure,
      height,
      weight,
      relationship,
      prescription,
      patientSignature,
      nurseSignature
    } = req.body;

    const userQuery = new Parse.Query(Parse.User);
    const user = await userQuery.get(userId, { useMasterKey: true }); 

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }


    // Create new OtherServices instance
    const service = new OtherServices();

    // Set the values
    service.set("servicesAvailed", servicesAvailed);
    service.set("date", date);
    service.set("firstName", firstName);
    service.set("middleName", middleName);
    service.set("lastName", lastName);
    service.set("sex", sex);
    service.set("status", status);
    service.set("dateOfBirth", dateOfBirth);
    service.set("age", age);
    service.set("bloodType", bloodType);
    service.set("bloodPressure", bloodPressure);
    service.set("height", height);
    service.set("weight", weight);
    service.set("relationship", relationship);
    service.set("prescription", prescription);
    service.set("patientSignature", patientSignature);
    service.set("nurseSignature", nurseSignature);
    // Set the relation to the user
    service.set("user", user);

    // Save the service record
    await service.save(null, { useMasterKey: true });

    res.status(201).json({
      success: true,
      data: service,
      message: 'Service record created successfully'
    });

  } catch (error) {
    if (error.code === 101) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID provided',
        error: error.message
      });
    }
    console.error('Error creating service record:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating service record',
      error: error.message
    });
  }
};

// Get all service records
const getAllServices = async (req, res) => {
  try {
    const query = new Parse.Query(OtherServices);
    const services = await query.find({ useMasterKey: true });

    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service records',
      error: error.message
    });
  }
};

// Get service record by ID
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = new Parse.Query(OtherServices);
    const service = await query.get(id, { useMasterKey: true });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service record',
      error: error.message
    });
  }
};



// Delete service record
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const query = new Parse.Query(OtherServices);
    const service = await query.get(id, { useMasterKey: true });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service record not found'
      });
    }

    await service.destroy({ useMasterKey: true });

    res.status(200).json({
      success: true,
      message: 'Service record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting service record',
      error: error.message
    });
  }
};

// Get first service record by userId
const getServicesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Create a query for the User first
    const userQuery = new Parse.Query(Parse.User);
    const user = await userQuery.get(userId, { useMasterKey: true });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Query for the first service related to this user
    const query = new Parse.Query(OtherServices);
    query.equalTo("user", user);
    // Optionally add sorting by date in descending order (most recent first)
    query.descending("date");
    const service = await query.first({ useMasterKey: true });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'No service record found for user'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching services by userId:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service record for user',
      error: error.message
    });
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const query = new Parse.Query(OtherServices);
    const service = await query.get(id, { useMasterKey: true });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service record not found'
      });
    }

    // Define allowed fields that exist in the schema
    const allowedFields = [
      "servicesAvailed",
      "date",
      "firstName", 
      "middleName",
      "lastName",
      "sex",
      "status",
      "dateOfBirth",
      "age",
      "bloodType",
      "bloodPressure", 
      "height",
      "weight",
      "relationship",
      "prescription",
      "patientSignature",
      "nurseSignature"
    ];

    // Update only allowed fields if they are provided in req.body
    Object.keys(req.body).forEach(field => {
      if (allowedFields.includes(field)) {
        let value = req.body[field];
        
        // Handle special data types
        if (field === "date" || field === "dateOfBirth") {
          // Store dates as strings to match schema
          value = value.toString();
        } else if (field === "age" || field === "height" || field === "weight") {
          // Store numeric fields as strings to match schema
          value = value.toString();
        }
        
        service.set(field, value);
      }
    });

    // Handle user relation separately
    if (req.body.userId) {
      const userQuery = new Parse.Query(Parse.User);
      const user = await userQuery.get(req.body.userId, { useMasterKey: true });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      service.set("user", user);
    }

    await service.save(null, { useMasterKey: true });

    res.status(200).json({
      success: true,
      data: service,
      message: 'Service record updated successfully'
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating service record',
      error: error.message
    });
  }
};

module.exports = {
  createOtherService,
  getAllServices,
  getServiceById,
  deleteService,
  getServicesByUserId,
  updateService
}; 