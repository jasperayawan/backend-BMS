const { createNewServices, updateServices, deleteServices, getAllServices } = require("../controller/services.controller");

const router = require("express").Router();

router.post('/', createNewServices)
router.get('/', getAllServices)
router.put('/:id', updateServices)
router.delete('/:id', deleteServices)

module.exports = router;