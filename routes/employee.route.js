const { createNewEmployee, getAllEmployee, updateEmployee, deleteEmployee } = require("../controller/employee.controller");

const router = require("express").Router();

router.post('/', createNewEmployee)
router.get('/', getAllEmployee)
router.put('/:employeeId', updateEmployee)
router.delete('/:employeeId', deleteEmployee)

module.exports = router;