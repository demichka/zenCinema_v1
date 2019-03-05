class User extends REST {

  static async createUser() {

    let user = new User({
      "firstName": $('.first-name-input').val(),
      "lastName": $('.last-name-input').val(),
      "email": $('.email-input').val(),
      "password": $('.password-input').val(),
    });

    // await user.save();
    return await user.save();
  }

  
}