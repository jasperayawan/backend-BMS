const createFamilyPlanningRecord = async (req, res) => {
  try {
    // Extract details from request body
    const {
      userId,
      nurseIncharge,
      // Type of Client
      newAcceptor,
      currentUser,
      changingMethod,
      changingClinic,
      dropoutRestart,
      spacingReason,
      medicalCondition,
      sideEffects,
      limitingReason,
      otherReason,
      // Method Currently Used
      coc,
      pop,
      injectable,
      implant,
      inteval,
      postPartum,
      condom,
      bomCmm,
      bbt,
      stm,
      lam,
      otherMethod,
      // VAW Risks
      unpleasantRelationship,
      partnerDisapproval,
      domesticViolence,
      referredToDSWD,
      referredToWCPU,
      referredToOthers,
    } = req.body;

    const userQuery = new Parse.Query(Parse.User);
    const user = await userQuery.get(userId, { useMasterKey: true });
    const nurse = await userQuery.get(nurseIncharge, { useMasterKey: true });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    if (!nurse) {
      return res.status(404).json({
          success: false,
          message: 'User not found',
      });
  }

    // Create a new Parse Object for FamilyPlanning
    const FamilyPlanning = Parse.Object.extend("FamilyPlanning");
    const familyPlanningRecord = new FamilyPlanning();

    // Set only the fields that match formData
    familyPlanningRecord.set('newAcceptor', newAcceptor);
    familyPlanningRecord.set('currentUser', currentUser);
    familyPlanningRecord.set('changingMethod', changingMethod);
    familyPlanningRecord.set('changingClinic', changingClinic);
    familyPlanningRecord.set('dropoutRestart', dropoutRestart);
    familyPlanningRecord.set('spacingReason', spacingReason);
    familyPlanningRecord.set('medicalCondition', medicalCondition);
    familyPlanningRecord.set('sideEffects', sideEffects);
    familyPlanningRecord.set('limitingReason', limitingReason);
    familyPlanningRecord.set('otherReason', otherReason);
    familyPlanningRecord.set('coc', coc);
    familyPlanningRecord.set('pop', pop);
    familyPlanningRecord.set('injectable', injectable);
    familyPlanningRecord.set('implant', implant);
    familyPlanningRecord.set('inteval', inteval);
    familyPlanningRecord.set('postPartum', postPartum);
    familyPlanningRecord.set('condom', condom);
    familyPlanningRecord.set('bomCmm', bomCmm);
    familyPlanningRecord.set('bbt', bbt);
    familyPlanningRecord.set('stm', stm);
    familyPlanningRecord.set('lam', lam);
    familyPlanningRecord.set('otherMethod', otherMethod);
    familyPlanningRecord.set('unpleasantRelationship', unpleasantRelationship);
    familyPlanningRecord.set('partnerDisapproval', partnerDisapproval);
    familyPlanningRecord.set('domesticViolence', domesticViolence);
    familyPlanningRecord.set('referredToDSWD', referredToDSWD);
    familyPlanningRecord.set('referredToWCPU', referredToWCPU);
    familyPlanningRecord.set('referredToOthers', referredToOthers);
    familyPlanningRecord.set('nurseIncharge', nurse)
    familyPlanningRecord.set('user', user)

    // Save the record
    await familyPlanningRecord.save(null, { useMasterKey: true });

    res.status(201).json({
      message: 'Family planning record created successfully!',
      record: familyPlanningRecord
    });
  } catch (error) {
    console.error('Error creating family planning record:', error.message);
    res.status(500).json({ error: 'An error occurred while creating the family planning record.' });
  }
};

const updateFamilyPlanningRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const FamilyPlanning = Parse.Object.extend("FamilyPlanning");
    const query = new Parse.Query(FamilyPlanning);
    const record = await query.get(id, { useMasterKey: true });

    if (!record) {
      return res.status(404).json({ error: 'Family planning record not found.' });
    }

    // Update fields
    Object.keys(updatedData).forEach(key => {
      record.set(key, updatedData[key]);
    });

    await record.save(null, { useMasterKey: true });

    res.status(200).json({
      message: 'Family planning record updated successfully!',
      record
    });
  } catch (error) {
    console.error('Error updating family planning record:', error.message);
    res.status(500).json({ error: 'An error occurred while updating the record.' });
  }
};

const getFamilyPlanningRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const FamilyPlanning = Parse.Object.extend("FamilyPlanning");
    const query = new Parse.Query(FamilyPlanning);
    const record = await query.get(id, { useMasterKey: true });

    if (!record) {
      return res.status(404).json({ error: 'Family planning record not found.' });
    }

    res.status(200).json({ record });
  } catch (error) {
    console.error('Error fetching family planning record:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching the record.' });
  }
};

const getAllFamilyPlanningRecords = async (req, res) => {
  try {
    const FamilyPlanning = Parse.Object.extend("FamilyPlanning");
    const query = new Parse.Query(FamilyPlanning);
    const records = await query.find({ useMasterKey: true });

    res.status(200).json({ records });
  } catch (error) {
    console.error('Error fetching family planning records:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching records.' });
  }
};

const deleteFamilyPlanningRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const FamilyPlanning = Parse.Object.extend("FamilyPlanning");
    const query = new Parse.Query(FamilyPlanning);
    const record = await query.get(id, { useMasterKey: true });

    if (!record) {
      return res.status(404).json({ error: 'Family planning record not found.' });
    }

    await record.destroy({ useMasterKey: true });

    res.status(200).json({ message: 'Family planning record deleted successfully!' });
  } catch (error) {
    console.error('Error deleting family planning record:', error.message);
    res.status(500).json({ error: 'An error occurred while deleting the record.' });
  }
};

const getFamilyPlanningRecordsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // First, get the User object
    const userQuery = new Parse.Query(Parse.User);
    const user = await userQuery.get(userId, { useMasterKey: true });
    
    // Then use the User object in the query
    const FamilyPlanning = Parse.Object.extend("FamilyPlanning");
    const query = new Parse.Query(FamilyPlanning);
    query.equalTo("user", user);  // Compare with User object instead of userId
    query.include("nurseIncharge");  // Include the nurseIncharge relation
    const record = await query.first({ useMasterKey: true });

    if (!record) {
      return res.status(404).json({ message: 'No family planning record found for this user.' });
    }

    // Get the nurse's name from the included nurseIncharge object
    const nurseName = record.get('nurseIncharge') ? 
      `${record.get('nurseIncharge').get('firstname')} ${record.get('nurseIncharge').get('lastname')}` : 
      'Unknown';

    res.status(200).json({ 
      record,
      nurseName 
    });
  } catch (error) {
    console.error('Error fetching family planning record by userId:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching the record.' });
  }
};

module.exports = {
  createFamilyPlanningRecord,
  updateFamilyPlanningRecord,
  getFamilyPlanningRecord,
  getAllFamilyPlanningRecords,
  deleteFamilyPlanningRecord,
  getFamilyPlanningRecordsByUserId
}; 