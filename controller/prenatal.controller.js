const Prenatal = Parse.Object.extend('Prenatal');

const createNewPrenatal = async (req, res) => {
    const {
        userId, // Add userId to associate the Prenatal record with a user
        trimesterOne,
        dateOne,
        weekOne,
        coditionOne,
        trimesterTwo,
        dateTwo,
        weekTwo,
        coditionTwo,
        trimesterThree,
        dateThree,
        weekThree,
        coditionThree,
        hospital,
        expectedDateToDeliver,
        questionOne,
        questionTwo,
        edema,
        constipation,
        nauseaOrVomiting,
        legCramps,
        hemmorhoids,
        heartBurn,
        heent,
        chestOrHeart,
        abdomen,
        genital,
        extremities,
        skin,
        cva,
        hypertension,
        asthma,
        heartDisease,
        diabites,
        skinTwo,
        allergies,
        drugIntake,
        bleedingTendencies,
        anemia,
        diabitesTwo,
        soresInOrAroundVagina,
        bloodPressure,
        weight,
        height,
        bodyMaxIndex,
        pulseRate,
        dateForMaternalClientRecord,
        complaints,
        mcnServicesGiven,
        NameOfProviderAndSignature,
        followUp
    } = req.body;

    try {
        // Retrieve the user by ID
        const userQuery = new Parse.Query(Parse.User);
        const user = await userQuery.get(userId, { useMasterKey: true }); // Ensure master key is used for secure queries

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const newPrenatal = new Prenatal();

        // Set fields for the new Prenatal object
        newPrenatal.set('trimesterOne', trimesterOne);
        newPrenatal.set('dateOne', dateOne);
        newPrenatal.set('weekOne', weekOne);
        newPrenatal.set('coditionOne', coditionOne);
        newPrenatal.set('trimesterTwo', trimesterTwo);
        newPrenatal.set('dateTwo', dateTwo);
        newPrenatal.set('weekTwo', weekTwo);
        newPrenatal.set('coditionTwo', coditionTwo);
        newPrenatal.set('trimesterThree', trimesterThree);
        newPrenatal.set('dateThree', dateThree);
        newPrenatal.set('weekThree', weekThree);
        newPrenatal.set('coditionThree', coditionThree);
        newPrenatal.set('hospital', hospital);
        newPrenatal.set('expectedDateToDeliver', expectedDateToDeliver);
        newPrenatal.set('questionOne', questionOne);
        newPrenatal.set('questionTwo', questionTwo);
        newPrenatal.set('edema', edema);
        newPrenatal.set('constipation', constipation);
        newPrenatal.set('nauseaOrVomiting', nauseaOrVomiting);
        newPrenatal.set('legCramps', legCramps);
        newPrenatal.set('hemmorhoids', hemmorhoids);
        newPrenatal.set('heartBurn', heartBurn);
        newPrenatal.set('heent', heent);
        newPrenatal.set('chestOrHeart', chestOrHeart);
        newPrenatal.set('abdomen', abdomen);
        newPrenatal.set('genital', genital);
        newPrenatal.set('extremities', extremities);
        newPrenatal.set('skin', skin);
        newPrenatal.set('cva', cva);
        newPrenatal.set('hypertension', hypertension);
        newPrenatal.set('asthma', asthma);
        newPrenatal.set('heartDisease', heartDisease);
        newPrenatal.set('diabites', diabites);
        newPrenatal.set('skinTwo', skinTwo);
        newPrenatal.set('allergies', allergies);
        newPrenatal.set('drugIntake', drugIntake);
        newPrenatal.set('bleedingTendencies', bleedingTendencies);
        newPrenatal.set('anemia', anemia);
        newPrenatal.set('diabitesTwo', diabitesTwo);
        newPrenatal.set('soresInOrAroundVagina', soresInOrAroundVagina);
        newPrenatal.set('bloodPressure', bloodPressure);
        newPrenatal.set('weight', weight);
        newPrenatal.set('height', height);
        newPrenatal.set('bodyMaxIndex', bodyMaxIndex);
        newPrenatal.set('pulseRate', pulseRate);
        newPrenatal.set('dateForMaternalClientRecord', dateForMaternalClientRecord);
        newPrenatal.set('complaints', complaints);
        newPrenatal.set('mcnServicesGiven', mcnServicesGiven);
        newPrenatal.set('NameOfProviderAndSignature', NameOfProviderAndSignature);
        newPrenatal.set('followUp', followUp);

        // Set the relation to the user
        newPrenatal.set('user', user); // Use the Pointer to associate the Prenatal record with the user

        // Save the new Prenatal object
        const savedPrenatal = await newPrenatal.save(null, { useMasterKey: true });

        res.status(201).json({
            success: true,
            message: 'Prenatal record created successfully',
            data: savedPrenatal
        });
    } catch (error) {
        console.error('Error creating prenatal record:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating prenatal record',
            error: error.message
        });
    }
};

const getPrenatalById = async (req, res) => {
    const { prenatalId } = req.params;

    try {
        const query = new Parse.Query('Prenatal');
        const prenatal = await query.get(prenatalId, { useMasterKey: true });

        if (!prenatal) {
            return res.status(404).json({
                success: false,
                message: 'Prenatal record not found',
            });
        }

        res.status(200).json({
            success: true,
            data: prenatal,
        });
    } catch (error) {
        console.error('Error fetching prenatal record:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching prenatal record',
            error: error.message,
        });
    }
};


const updatePrenatal = async (req, res) => {
    const { prenatalId } = req.params;
    const updatedData = req.body;

    try {
        const query = new Parse.Query('Prenatal');
        const prenatal = await query.get(prenatalId, { useMasterKey: true });

        if (!prenatal) {
            return res.status(404).json({
                success: false,
                message: 'Prenatal record not found',
            });
        }

        // Update fields dynamically based on request body
        Object.keys(updatedData).forEach((key) => {
            prenatal.set(key, updatedData[key]);
        });

        const updatedPrenatal = await prenatal.save(null, { useMasterKey: true });

        res.status(200).json({
            success: true,
            message: 'Prenatal record updated successfully',
            data: updatedPrenatal,
        });
    } catch (error) {
        console.error('Error updating prenatal record:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating prenatal record',
            error: error.message,
        });
    }
};


const deletePrenatal = async (req, res) => {
    const { prenatalId } = req.params;

    try {
        const query = new Parse.Query('Prenatal');
        const prenatal = await query.get(prenatalId, { useMasterKey: true });

        if (!prenatal) {
            return res.status(404).json({
                success: false,
                message: 'Prenatal record not found',
            });
        }

        await prenatal.destroy({ useMasterKey: true });

        res.status(200).json({
            success: true,
            message: 'Prenatal record deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting prenatal record:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting prenatal record',
            error: error.message,
        });
    }
};


module.exports = {
    createNewPrenatal,
    updatePrenatal,
    getPrenatalById,
    deletePrenatal
}
