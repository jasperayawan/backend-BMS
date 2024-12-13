const { createNewPatient, getAllPatients, getPatientById } = require('../controller/patient.controller');

const router = require('express').Router();

router.post('/', createNewPatient)
router.get('/', getAllPatients)
router.get('/:id', getPatientById)

module.exports = router;