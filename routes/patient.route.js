const { createNewPatient, getAllPatients } = require('../controller/patient.controller');

const router = require('express').Router();

router.post('/', createNewPatient)
router.get('/', getAllPatients)

module.exports = router;