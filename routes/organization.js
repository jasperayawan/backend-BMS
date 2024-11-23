const { getOrganizationAboutus, deleteUserFromOrg } = require('../controller/organization.controller');

const router = require('express').Router();

router.get('/', getOrganizationAboutus);
router.delete('/:id', deleteUserFromOrg)

module.exports = router