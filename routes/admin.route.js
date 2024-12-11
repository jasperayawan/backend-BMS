const { createUserWithRole, updateUser } = require('../controller/admin.controller');
const router = require('express').Router();

router.post('/', createUserWithRole);
router.put('/:id', updateUser)

module.exports = router;