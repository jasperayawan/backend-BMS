const express = require('express');
const router = express.Router();
const {
  createFamilyPlanningRecord,
  updateFamilyPlanningRecord,
  getFamilyPlanningRecord,
  getAllFamilyPlanningRecords,
  deleteFamilyPlanningRecord,
  getFamilyPlanningRecordsByUserId
} = require('../controller/familyPlanning.controller');

// Create a new family planning record
router.post('/', createFamilyPlanningRecord);

// Update a family planning record
router.put('/:id', updateFamilyPlanningRecord);

// Get a specific family planning record
router.get('/:id', getFamilyPlanningRecord);

// Get all family planning records
router.get('/', getAllFamilyPlanningRecords);

router.get('/user/:userId', getFamilyPlanningRecordsByUserId)

// Delete a family planning record
router.delete('/:id', deleteFamilyPlanningRecord);

module.exports = router; 