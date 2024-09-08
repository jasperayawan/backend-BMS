const { createUserWithRole } = require('../controller/admin.controller');
const router = require('express').Router();

router.post('/', createUserWithRole);

module.exports = router;