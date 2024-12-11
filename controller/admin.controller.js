const cloudinary = require("cloudinary")



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
    const { profilePicture, name, role, birthdate, age, bloodType, address, contact, email, username, password, status } = req.body;
  
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
      
      // Add additional fields if available
      if (name) user.set('name', name);
      if (role) user.set('role', role);
      if (birthdate) user.set('birthdate', birthdate);
      if (age) user.set('age', age);
      if (bloodType) user.set('bloodType', bloodType);
      if (address) user.set('address', address);
      if (contact) user.set('contact', contact);
      if (status) user.set('status', status);

      if(profilePicture){
        const imageResult = await cloudinary.uploader.upload(profilePicture);
        user.set("profilePicture", imageResult.secure_url);
      }
      
  
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
  
  const updateUser = async (req, res) => {
    const { id } = req.params;
    const { profilePicture, ...updateData } = req.body;

    try {
      // Query the user by ID
      const query = new Parse.Query(Parse.User);
      const user = await query.get(id, { useMasterKey: true });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Handle profile picture update if provided
      if (profilePicture) {
        const imageResult = await cloudinary.uploader.upload(profilePicture);
        user.set('profilePicture', imageResult.secure_url);
      }

      // Update other fields
      Object.keys(updateData).forEach(key => {
        user.set(key, updateData[key]);
      });

      // Save the updated user
      await user.save(null, { useMasterKey: true });

      res.status(200).json({
        message: 'User updated successfully',
        user
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: `Error updating user: ${error.message}` });
    }
  };
  
  module.exports = {
    createUserWithRole,
    updateUser
  };
  