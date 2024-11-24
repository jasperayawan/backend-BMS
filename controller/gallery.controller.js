const cloudinary = require("cloudinary");

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dxp5dv6ut",
  api_key: "466854698258958",
  api_secret: "u7fEx27OyFit-9qhShHYzFt0SAU",
});

const createNewGallery = async (req, res) => {
  const { galleryName, galleryImage } = req.body;

  try {
    // Check if galleryName and galleryImage are provided
    if (!galleryName || !galleryImage) {
      return res.status(400).json({ message: "Gallery name and image are required." });
    }

    // Upload the image to Cloudinary
    const imageResult = await cloudinary.uploader.upload(galleryImage, {
      folder: `galleries/${galleryName}`,
    });

    // Prepare the data to save to Parse
    const Gallery = Parse.Object.extend("Gallery"); // Assuming you're using a 'Gallery' class in Parse Server
    const gallery = new Gallery();

    // Set gallery data
    gallery.set("name", galleryName);
    gallery.set("files", [imageResult.secure_url]);  // Save image URL(s) in the 'files' field

    // Save gallery data to Parse Server
    await gallery.save();

    // Respond with success
    res.status(200).json({
      message: "Gallery created and saved to Parse successfully.",
      gallery: { name: galleryName, files: [imageResult.secure_url] },
    });
  } catch (error) {
    console.error("Error creating gallery:", error);
    res.status(500).json({ message: "Error creating gallery.", error });
  }
};



const getAllGalleries = async (req, res) => {
    try {
      // Query the Gallery class from Parse Server
      const Gallery = Parse.Object.extend("Gallery"); 
      const query = new Parse.Query(Gallery);
      
      // Fetch all gallery entries
      const galleries = await query.find();
      
      if (galleries.length === 0) {
        return res.status(404).json({ message: "No galleries found." });
      }
      // Format the galleries data for the response
      const galleryData = galleries.map((gallery) => ({
        id: gallery.id,
        name: gallery.get("name"),
        files: gallery.get("files"), // Assuming 'files' field contains an array of image URLs
      }));
  
      // Respond with the gallery data
      res.status(200).json({
        message: "Galleries retrieved successfully.",
        galleries: galleryData,
      });
    } catch (error) {
      console.error("Error fetching galleries:", error);
      res.status(500).json({ message: "Error fetching galleries.", error });
    }
  };


  const updateGallery = async (req, res) => {
    const Gallery = Parse.Object.extend("Gallery");
    const galleryId = req.params.objectId;
    const { galleryName, galleryImage, prevImage } = req.body;
  
    try {
      // Fetch the gallery object by its objectId
      const query = new Parse.Query(Gallery);
      const gallery = await query.get(galleryId);
  
      if (!gallery) {
        return res.status(404).json({ message: "Gallery not found." });
      }
  
      // If a new image is provided, delete the previous image from Cloudinary (if exists)
      if (galleryImage) {
        if (prevImage) {
          try {
            await new Promise((resolve, reject) => {
              cloudinary.uploader.destroy(prevImage, (err, result) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              });
            });
          } catch (error) {
            console.log("Error during photo deletion:", error);
          }
        }
  
        // Upload the new image to Cloudinary
        const imageResult = await cloudinary.uploader.upload(galleryImage);
        gallery.set("files", [imageResult.secure_url]); // Update the gallery with the new image URL
      }
  
      // If galleryName is provided, update it
      if (galleryName) {
        gallery.set("name", galleryName);
      }
  
      // Save the updated gallery
      await gallery.save();
  
      res.status(200).json({
        message: "Gallery updated successfully.",
        gallery: {
          name: gallery.get("name"),
          files: gallery.get("files"),
        },
      });
    } catch (error) {
      console.error("Error updating gallery:", error);
      res.status(500).json({ message: "Error updating gallery.", error });
    }
  };


  const deleteGallery = async (req, res) => {
    const Gallery = Parse.Object.extend("Gallery");
    const galleryId = req.params.objectId;
  
    try {
      // Fetch the gallery object by its objectId
      const query = new Parse.Query(Gallery);
      const gallery = await query.get(galleryId);
  
      if (!gallery) {
        return res.status(404).json({ message: "Gallery not found." });
      }
  
      // If the gallery has files, delete them from Cloudinary
      const files = gallery.get("files");
      if (files && files.length > 0) {
        for (const fileUrl of files) {
          const publicId = fileUrl.split("/").pop().split(".")[0]; // Extract public ID from URL
          try {
            await new Promise((resolve, reject) => {
              cloudinary.uploader.destroy(publicId, (err, result) => {
                if (err) reject(err);
                else resolve(result);
              });
            });
          } catch (error) {
            console.log("Error during file deletion:", error);
          }
        }
      }
  
      // Delete the gallery object from Parse Server
      await gallery.destroy();
  
      res.status(200).json({ message: "Gallery deleted successfully." });
    } catch (error) {
      console.error("Error deleting gallery:", error);
      res.status(500).json({ message: "Error deleting gallery.", error });
    }
  };


  const addNewFiletoFolder = async (req, res) => {
    try {
      const { galleryId } = req.params;
      const { file } = req.body;  // Assuming `file` is Base64 or URL
  
      if (!file) {
        return res.status(400).json({ message: "No file provided" });
      }
  
      // Upload the file to Cloudinary (handle Base64 or file URL)
      const imageResult = await cloudinary.uploader.upload(file, {
        folder: `galleries/${galleryId}`,
      });
  
      // Extract file URL from the result
      const fileUrl = imageResult.secure_url;
  
      // Query the gallery in Parse (Use Parse.Query instead of findById)
      const Gallery = Parse.Object.extend("Gallery");
      const query = new Parse.Query(Gallery);
      const gallery = await query.get(galleryId);
  
      if (!gallery) {
        return res.status(404).json({ message: "Gallery not found" });
      }
  
      // Update gallery with new file URL
      const files = gallery.get("files") || [];
      files.push(fileUrl);  // Add the new file URL to the gallery
  
      gallery.set("files", files);  // Update the gallery's files field
      await gallery.save();  // Save the updated gallery
  
      // Respond with the file URL
      res.status(200).json({ fileUrl });
  
    } catch (error) {
      console.log("Error adding file to folder:", error);
      res.status(500).json({ message: "Error uploading file", error });
    }
  };


  const removeFileFromFolder = async (req, res) => {
    try {
      const { galleryId } = req.params;  // The gallery ID from the URL
      const { fileUrl } = req.body;  // The file URL to remove from the gallery
        console.log('fileUrl', fileUrl)
      if (!fileUrl) {
        return res.status(400).json({ message: "No file URL provided" });
      }
  
      // Query the gallery in Parse (Use Parse.Query instead of findById)
      const Gallery = Parse.Object.extend("Gallery");
      const query = new Parse.Query(Gallery);
      const gallery = await query.get(galleryId);
  
      if (!gallery) {
        return res.status(404).json({ message: "Gallery not found" });
      }
  
      // Get the existing files array from the gallery
      let files = gallery.get("files") || [];
      
      // Check if the file exists in the gallery
      const fileIndex = files.indexOf(fileUrl);
      if (fileIndex === -1) {
        return res.status(404).json({ message: "File not found in the gallery" });
      }
  
      // Remove the file URL from the gallery's files array
      files.splice(fileIndex, 1);  // Removes the file at the found index
  
      // Update the gallery's files field
      gallery.set("files", files);
  
      // Delete the file from Cloudinary
      const publicId = fileUrl.split("/").pop().split(".")[0];  // Extract the public ID from the URL
      await cloudinary.uploader.destroy(publicId);  // Delete the file from Cloudinary
  
      // Save the updated gallery to Parse
      await gallery.save();
  
      // Respond with a success message
      res.status(200).json({ message: "File removed successfully", gallery: { files } });
  
    } catch (error) {
      console.log("Error removing file from folder:", error);
      res.status(500).json({ message: "Error removing file", error });
    }
  };


module.exports = {
  createNewGallery,
  getAllGalleries,
  updateGallery,
  deleteGallery,
  addNewFiletoFolder,
  removeFileFromFolder
};
