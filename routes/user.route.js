const router = require("express").Router();

const { deleteUser } = require("../controller/user.controller");

router.delete('/:id', deleteUser)

module.exports = router;