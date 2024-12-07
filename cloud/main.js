const cloudinary = require("cloudinary")


Parse.Cloud.define("getUsers", async (request) => {
    try {
      const query = new Parse.Query(Parse.User);

      if (request.params.role) {
        query.equalTo("role", request.params.role);
      }
      if (request.params.status) {
        query.equalTo("status", request.params.status);
      }

      const users = await query.find({ useMasterKey: true });
      return users.map((user) => ({
        id: user.id,
        profilePicture: user.get("profilePicture"),
        age: user.get("age"),
        bloodType: user.get("bloodType"),
        birthdate: user.get("birthdate"),
        name: user.get("name"),
        email: user.get("email"),
        role: user.get("role"),
        status: user.get("status"),
        address: user.get("address"),
        contact: user.get("contact"),
      }));
    } catch (error) {
      throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, error.message);
    }
  });

Parse.Cloud.define("myAccount", async (request) => {
  const { id } = request.params;
  try {
    const query = new Parse.Query(Parse.User);

    if (request.params.role) {
      query.equalTo("role", request.params.role);
    }
    if (request.params.status) {
      query.equalTo("status", request.params.status);
    }

    const users = await query.get(id, { useMasterKey: true });


    const userInfo = {
      id: users.id,
      profilePicture: users.get("profilePicture"),
      age: users.get("age"),
      username: users.get("username"),
      bloodType: users.get("bloodType"),
      birthdate: users.get("birthdate"),
      name: users.get("name"),
      email: users.get("email"),
      role: users.get("role"),
      status: users.get("status"),
      address: users.get("address"),
      contact: users.get("contact"),
    };

    return userInfo;
  } catch (error) {
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, error.message);
  }
});

Parse.Cloud.define("updateMyAccount", async (request) => {
  const { id, name, email, username, password, address, contact, profilePicture } = request.params;
  
  try {
    const query = new Parse.Query(Parse.User);
    const user = await query.get(id, { useMasterKey: true });

    // Update user fields if provided
    if (name) user.set("name", name);
    if (email) user.set("email", email);
    if (username) user.set("username", username);
    if (password) user.set("password", password);
    if (address) user.set("address", address);
    if (contact) user.set("contact", contact);

    // Handle profile picture upload if provided
    if (profilePicture) {
      const imageResult = await cloudinary.uploader.upload(profilePicture);
      user.set("profilePicture", imageResult.secure_url);
    }

    await user.save(null, { useMasterKey: true });

    return {
      success: true,
      message: "Account updated successfully",
      user: {
        id: user.id,
        profilePicture: user.get("profilePicture"),
        age: user.get("age"),
        username: user.get("username"),
        bloodType: user.get("bloodType"),
        birthdate: user.get("birthdate"),
        name: user.get("name"),
        email: user.get("email"),
        role: user.get("role"),
        status: user.get("status"),
        address: user.get("address"),
        contact: user.get("contact"),
      }
    };
  } catch (error) {
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, error.message);
  }
});




  Parse.Cloud.define('addOrUpdateMember', async (request) => {
    const { id, name, role, image } = request.params;
  
    try {
      let TeamMember = Parse.Object.extend('Organization');
      let teamMember;
  
      if (id) {
        // Update existing member
        const query = new Parse.Query(TeamMember);
        try {
          teamMember = await query.get(id);
          console.log('Updating existing member:', id);
        } catch (error) {
          throw new Error(`Member with ID ${id} not found`);
        }
      } else {
        // Create new member
        teamMember = new TeamMember();
        console.log('Creating new member');
      }
  
      // Set the properties
      teamMember.set('name', name);
      teamMember.set('role', role);
  
      // Only update image if a new one is provided
      if (image) {
        const imageResult = await cloudinary.uploader.upload(image);
        teamMember.set("image", imageResult.secure_url);
      }
  
      await teamMember.save(null, { useMasterKey: true });
  
      return { 
        success: true, 
        message: id ? 'Member updated successfully.' : 'Member added successfully.',
        member: {
          objectId: teamMember.id,
          name: teamMember.get('name'),
          role: teamMember.get('role'),
          image: teamMember.get('image')
        }
      };
  
    } catch (error) {
      console.error('Error in addOrUpdateMember:', error);
      throw new Error(error.message);
    }
  });
  
  
  