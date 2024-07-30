import userModel from "./models/user.model.js";

export default class UserManager {
  getUsers() {
    return userModel.find();
  }

  getUserById(userId) {
    return userModel.findById(userId);
  }

  getUserByEmail(userEmail) {
    return userModel.findOne({ email: userEmail });
  }

  createUser(user) {
    return userModel.create(user);
  }
}