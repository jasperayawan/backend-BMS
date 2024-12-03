const Immunization = Parse.Object.extend('Immunization');

const createNewImmunization = async (req, res) => {
    const {
        userId,
        patientIdNo,
        lastName,
        firstName,
        middleName,
        birthDate,
        age,
        birthPlace,
        birthWeight,
        birthLength,
        motherName,
        contactNo,
        address,
        purok,
        category,
        vaccinationHistory,
        micronutrientHistory
    } = req.body;

    try {

        const userQuery = new Parse.Query(Parse.User);
        const user = await userQuery.get(userId, { useMasterKey: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const immunization = new Immunization();
        
        // Set the fields
        immunization.set('patientIdNo', patientIdNo);
        immunization.set('lastName', lastName);
        immunization.set('firstName', firstName);
        immunization.set('middleName', middleName);
        immunization.set('birthDate', birthDate);
        immunization.set('age', age);
        immunization.set('birthPlace', birthPlace);
        immunization.set('birthWeight', birthWeight);
        immunization.set('birthLength', birthLength);
        immunization.set('motherName', motherName);
        immunization.set('contactNo', contactNo);
        immunization.set('address', address);
        immunization.set('purok', purok);
        immunization.set('category', category);

        // Set the vaccination and micronutrient histories
        immunization.set('vaccinationHistory', vaccinationHistory);
        immunization.set('micronutrientHistory', micronutrientHistory);

        immunization.set('user', user);

        const savedImmunization = await immunization.save(null, { useMasterKey: true });

        res.status(201).json({
            success: true,
            message: 'Immunization record created successfully',
            data: savedImmunization
        });

    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
}

const getImmunizationById = async (req, res) => {
    try {
        const query = new Parse.Query(Immunization);
        const immunization = await query.get(req.params.id);
        
        if (!immunization) {
            return res.status(404).json({
                success: false,
                message: 'Immunization record not found'
            });
        }

        res.status(200).json({
            success: true,
            data: immunization
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const updateImmunization = async (req, res) => {
    try {
        const query = new Parse.Query(Immunization);
        const immunization = await query.get(req.params.id);

        if (!immunization) {
            return res.status(404).json({
                success: false,
                message: 'Immunization record not found'
            });
        }

        // Update only the fields that are provided in the request
        Object.keys(req.body).forEach(key => {
            immunization.set(key, req.body[key]);
        });

        const updatedImmunization = await immunization.save();

        res.status(200).json({
            success: true,
            message: 'Immunization record updated successfully',
            data: updatedImmunization
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const deleteImmunization = async (req, res) => {
    try {
        const query = new Parse.Query(Immunization);
        const immunization = await query.get(req.params.id);

        if (!immunization) {
            return res.status(404).json({
                success: false,
                message: 'Immunization record not found'
            });
        }

        await immunization.destroy();

        res.status(200).json({
            success: true,
            message: 'Immunization record deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const getImmunizationsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // First get the user
        const userQuery = new Parse.Query(Parse.User);
        const user = await userQuery.get(userId, { useMasterKey: true });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Then query immunizations for this user
        const query = new Parse.Query(Immunization);
        query.equalTo('user', user);
        const immunizations = await query.find({ useMasterKey: true });

        if (immunizations.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No immunization records found for this user'
            });
        }

        res.status(200).json({
            success: true,
            data: immunizations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    createNewImmunization,
    getImmunizationById,
    updateImmunization,
    deleteImmunization,
    getImmunizationsByUser
}
