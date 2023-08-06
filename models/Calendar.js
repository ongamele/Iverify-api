const { model, Schema } = require("mongoose");

const calendarSchema = new Schema({
  date: String,
  createdAt: String,
});

module.exports = model("Candelar", calendarSchema);
