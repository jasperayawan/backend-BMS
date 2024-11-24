const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: "dxp5dv6ut",
    api_key: "466854698258958",
    api_secret: "u7fEx27OyFit-9qhShHYzFt0SAU",
});
  

// CREATE: Add a new service
const createNewServices = async (req, res) => {
  try {
    const { title, desc, imageBase64 } = req.body; // Expect base64 image in the request

    if (!imageBase64) {
      return res.status(400).json({ message: 'No image provided' });
    }

    const service = new Parse.Object('Services');
    service.set('title', title);
    service.set('desc', desc);

    if(imageBase64){
        const imageResult = await cloudinary.uploader.upload(imageBase64);
        service.set("image", imageResult.secure_url);
    }


    await service.save();
    res.status(201).json({ message: 'Service created successfully', service });
  } catch (error) {
    res.status(500).json({ message: 'Error creating service', error });
  }
};

const getAllServices = async (req, res) => {
    try{
        const query = new Parse.Query('Services');
        const services = await query.find();

        res.status(200).json(services)
    }
    catch(error){
        res.status(500).json({ message: 'Error fetching service', error });
    }
}



// UPDATE: Edit a service
const updateServices = async (req, res) => {
  try {
    const { title, desc, imageBase64 } = req.body;
    const service = await new Parse.Query('Services').get(req.params.id);

    if (imageBase64) {
      // Upload image to Cloudinary if provided
      const result = await cloudinary.uploader.upload(imageBase64, {
        upload_preset: 'your-upload-preset',
      });
      service.set('image', result.secure_url); // Update image URL
    }

    service.set('title', title);
    service.set('desc', desc);

    await service.save();
    res.status(200).json({ message: 'Service updated successfully', service });
  } catch (error) {
    res.status(500).json({ message: 'Error updating service', error });
  }
};

// DELETE: Remove a service
const deleteServices = async (req, res) => {
  try {
    const service = await new Parse.Query('Services').get(req.params.id);
    await service.destroy();
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error });
  }
};

module.exports = {
    createNewServices,
    getAllServices,
    updateServices,
    deleteServices,
}
