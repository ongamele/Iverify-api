const { model, Schema } = require("mongoose");

const timeSchema = new Schema({
  dateId: String,
  time: String,
  status: String,
  createdAt: String,
});

module.exports = model("Time", timeSchema);
