const { model, Schema } = require("mongoose");

const requestSchema = new Schema({
  userId: String,
  name: String,
  surname: String,
  email: String,
  address: String,
  phoneNumber: String,
  date: String,
  time: String,
  status: String,
  createdAt: String,
});

module.exports = model("Request", requestSchema);
