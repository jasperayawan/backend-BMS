const router = require('express').Router();
const { createNewImmunization, getImmunizationById, updateImmunization, deleteImmunization } = require('../controller/immunization.controller');

router.post('/', createNewImmunization);
router.get('/:id', getImmunizationById);
router.put('/:id', updateImmunization);
router.delete('/:id', deleteImmunization);  

module.exports = router;
