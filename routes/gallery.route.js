const { createNewGallery, getAllGalleries, updateGallery, deleteGallery, addNewFiletoFolder, removeFileFromFolder } = require("../controller/gallery.controller");

const router = require("express").Router();

router.post('/', createNewGallery);
router.post('/addFileToGallery/:galleryId', addNewFiletoFolder);
router.delete('/removeFileFromFolder/:galleryId', removeFileFromFolder);
router.get('/', getAllGalleries);
router.put('/:objectId', updateGallery);
router.delete('/:objectId', deleteGallery);

module.exports = router;