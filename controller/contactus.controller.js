const ContactUs = Parse.Object.extend("ContactUs");

const createContactus = async (req, res) => {
    const { phone, email, location, socials } = req.body; // Extract data from request body
  
    try {
      
      const contactUs = new ContactUs();
  
      // Set fields for the object
      contactUs.set("phone", phone);
      contactUs.set("email", email);
      contactUs.set("location", location);
      contactUs.set("socials", socials);
  
      // Save the object to the Parse server
      const savedContact = await contactUs.save();
  
      // Return the saved object
      res.status(201).json({
        success: true,
        message: "Contact Us entry created successfully.",
        data: savedContact,
      });
    } catch (error) {
      // Handle errors
      res.status(400).json({
        success: false,
        message: "Failed to create Contact Us entry.",
        error: error.message,
      });
    }
  };


  const updateContactus = async (req, res) => {
    const { id, phone, email, location, socials } = req.body;
  
    try {
      const query = new Parse.Query(ContactUs);
      const contactUs = await query.get(id);
  
      if (phone) contactUs.set("phone", phone);
      if (email) contactUs.set("email", email);
      if (location) contactUs.set("location", location);
      if (socials) contactUs.set("socials", socials);
  
      // Save the updated object
      const updatedContact = await contactUs.save();
  
      res.status(200).json({
        success: true,
        message: "Contact Us entry updated successfully.",
        data: updatedContact,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Failed to update Contact Us entry.",
        error: error.message,
      });
    }
  };


  const deleteContactus = async (req, res) => {
    const { id } = req.params;
  
    try {
      const query = new Parse.Query(ContactUs);
      const contactUs = await query.get(id);
  
      // Delete the object
      await contactUs.destroy();
  
      res.status(200).json({
        success: true,
        message: "Contact Us entry deleted successfully.",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Failed to delete Contact Us entry.",
        error: error.message,
      });
    }
  };
  

  const getContactInfo = async (req, res) => {
    try{
        const query = new Parse.Query(ContactUs);
        const contact = await query.find();

        res.status(200).json(contact)
    }
    catch(err){
        res.status(400).json(err)
    }
  }
  
  
  module.exports = {
    createContactus,
    updateContactus,
    deleteContactus,
    getContactInfo
  };
  