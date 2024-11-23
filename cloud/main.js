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
  
  