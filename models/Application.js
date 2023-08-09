const { model, Schema } = require("mongoose");

const applicationSchema = new Schema({
  userId: String,
  name: String,
  surname: String,
  email: String,
  gender: String,
  address: String,
  phoneNumber: String,
  postalCode: String,
  idNumber: String,
  municipalAcc: String,
  race: String,
  country: String,
  houseHoldHead: Boolean,
  maritalStatus: String,
  dependents: Boolean,
  status: String,
  idBook: String,
  bankStatement: String,
  affidavid: String,
  companyName: String,
  companyEmail: String,
  income: Number,
  sourceOfIncome: String,
  createdAt: String,
});

module.exports = model("Application", applicationSchema);
