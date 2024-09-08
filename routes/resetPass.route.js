const router = require("express").Router();

const { resetPassword, resetPassConfirm } = require("../controller/resetPass.controller");

router.post('/reset-password', resetPassword);
router.post('/reset-password/confirm', resetPassConfirm)

module.exports = router;