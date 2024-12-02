const express = require('express');
const router = express.Router();
const {
  createOtherService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getServicesByUserId
} = require('../controller/otherServices.controller');

// Routes
router.post('/', createOtherService);
router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.put('/:id', updateService);
router.delete('/:id', deleteService);
router.get('/user/:userId', getServicesByUserId);

module.exports = router; 