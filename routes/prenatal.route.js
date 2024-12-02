const { createNewPrenatal, getPrenatalById, updatePrenatal, deletePrenatal, getPrenatalByUserId } = require('../controller/prenatal.controller');

const router = require('express').Router();

router.post('/', createNewPrenatal)
router.get('/:prenatalId', getPrenatalById);
router.put('/:prenatalId', updatePrenatal);
router.delete('/:prenatalId', deletePrenatal);
router.get('/user/:userId', getPrenatalByUserId);


module.exports = router;