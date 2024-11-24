const { createContactus, updateContactus, deleteContactus, getContactInfo } = require("../controller/contactus.controller");

const router = require("express").Router();

router.post('/', createContactus);
router.get('/', getContactInfo);
router.put('/', updateContactus);
router.delete('/:id', deleteContactus);

module.exports = router;