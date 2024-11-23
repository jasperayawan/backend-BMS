
const deleteUser = async (req, res) => {
    try {
      const { id } = req.params; 

      console.log('Attempting to delete user with ID:', id);
      const User = Parse.Object.extend(Parse.User);
      const query = new Parse.Query(User);
      const user = await query.get(id, { useMasterKey: true }); 
        
      console.log('user', user)
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      await user.destroy({ useMasterKey: true });
  
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ error: 'Failed to delete user. Please try again.' });
    }
};

module.exports = {
    deleteUser
}