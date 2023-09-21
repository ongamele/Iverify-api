const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  name: String,
  surname: String,
  phoneNumber: Number,
  email: String,
  idNumber: String,
  password: String,
  municipality: String,
  status: String,
  createdAt: String,
});

module.exports = model("User", userSchema);
