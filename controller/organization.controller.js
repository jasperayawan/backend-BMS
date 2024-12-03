let TeamMember = Parse.Object.extend('Organization');

const getOrganizationAboutus = async (req, res) => {
    try{
        const query = new Parse.Query(TeamMember);
        const organization = await query.find();

        res.status(200).json(organization);
    }
    catch(error){
        console.log(error);
    }
}


const deleteUserFromOrg = async (req, res) => {
    try {
        const { id } = req.params; 
        
        const query = new Parse.Query(TeamMember);
        const userFromOrg = await query.get(id); 
          
        if (!userFromOrg) {
          return res.status(404).json({ error: 'Team member not found' });
        }
    
        await userFromOrg.destroy();
    
        return res.status(200).json({ message: 'Team member deleted successfully' });
      } catch (error) {
        console.error('Error deleting Team member:', error);
        return res.status(500).json({ error: 'Failed to delete Team member. Please try again.' });
      }
}


const updateTeamMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, image } = req.body;

        const query = new Parse.Query(TeamMember);
        const teamMember = await query.get(id);

        if (!teamMember) {
            return res.status(404).json({ error: 'Team member not found' });
        }

        teamMember.set('name', name);
        teamMember.set('role', role);
        teamMember.set('image', image);

        await teamMember.save();

        return res.status(200).json({ message: 'Team member updated successfully' });
    } catch (error) {
        console.error('Error updating Team member:', error);
        return res.status(500).json({ error: 'Failed to update Team member. Please try again.' });
    }
}


module.exports = {
    getOrganizationAboutus,
    deleteUserFromOrg,
    updateTeamMember
}