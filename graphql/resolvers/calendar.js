const bcrypt = require("bcryptjs");
//const haversine = require("haversine-distance");

const Calendar = require("../../models/Calendar");

module.exports = {
  Query: {
    async getCalendar() {
      try {
        const calendar = await Calendar.find().sort({
          createdAt: -1,
        });
        return calendar;
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async createCalendar(_, { date }) {
      const cal = await Calendar.find({ date: date });
      if (cal.length > 0) {
        console.log(cal.length);
        return "Date Already exists!";
      } else {
        console.log(cal.length);
        const newCalendar = new Calendar({
          date,
          createdAt: new Date().toISOString(),
        });

        const res = await newCalendar.save();
      }

      return "Date added!";
    },

    async deleteDate(_, { id }) {
      try {
        const calendar = await Calendar.findById(id);
        await calendar.delete();

        return "Date removed successfully";
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
