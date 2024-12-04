const router = require("express").Router();
const {
  createNewImmunization,
  getImmunizationById,
  updateImmunization,
  deleteImmunization,
  getImmunizationsByUser,
  updateImmunizationByUserId,
} = require("../controller/immunization.controller");

router.post("/", createNewImmunization);
router.get("/:id", getImmunizationById);
router.put("/:id", updateImmunization);
router.put("/user/:userId", updateImmunizationByUserId);
router.delete("/:id", deleteImmunization);
router.get("/user/:userId", getImmunizationsByUser);
module.exports = router;
