const createRole = async (roleName, user) => {
    try {
      // Use master key to bypass ACLs
      const query = new Parse.Query(Parse.Role);
      query.equalTo('name', roleName);
      const existingRole = await query.first({ useMasterKey: true });
  
      let role;
      if (existingRole) {
        role = existingRole; // If role exists, use it
      } else {
        // Create a new role if it doesn't exist
        const roleACL = new Parse.ACL();
        roleACL.setPublicReadAccess(true); // Public can read the role
        roleACL.setRoleWriteAccess('Admin', true); // Only Admins can modify the role
  
        role = new Parse.Role(roleName, roleACL);
        await role.save(null, { useMasterKey: true }); // Save the new role
      }
  
      // Add the user to the role
      const usersRelation = role.relation('users');
      usersRelation.add(user);
  
      // Save the role with the new user added, using master key
      await role.save(null, { useMasterKey: true });
  
      return role;
    } catch (error) {
      throw new Error(`Error creating or finding role: ${roleName} - ${error.message}`);
    }
  };
  
  const createUserWithRole = async (req, res) => {
    const { username, email, password, role } = req.body;
  
    try {
      // Validate input
      if (!username || !password || !role) {
        return res.status(400).json({ error: 'Username, password, and role are required' });
      }
  
      // Create a new Parse.User object for the user
      const user = new Parse.User();
      user.set('username', username);
      user.set('email', email);
      user.set('password', password);
  
      // Save the user object (using signUp to handle password securely)
      const savedUser = await user.signUp();
  
      // Assign the user to the specified role
      await createRole(role, savedUser);
  
      res.status(200).json({ 
        message: `${role} user created successfully`, 
        user: savedUser 
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: `Error creating user with role: ${error.message}` });
    }
  };
  
  module.exports = {
    createUserWithRole
  };
  