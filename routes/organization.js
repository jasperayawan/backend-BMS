const { getOrganizationAboutus, deleteUserFromOrg, updateTeamMember } = require('../controller/organization.controller');

const router = require('express').Router();

router.get('/', getOrganizationAboutus);
router.put('/:id', updateTeamMember)
router.delete('/:id', deleteUserFromOrg)

module.exports = router