const { createNewPatient } = require('../controller/patient.controller');

const router = require('express').Router();

router.post('/', createNewPatient)

module.exports = router;