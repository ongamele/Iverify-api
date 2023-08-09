const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  name: String,
  surname: String,
  phoneNumber: String,
  email: String,
  idNumber: String,
  password: String,
  createdAt: String,
});

module.exports = model("User", userSchema);
