const bcrypt = require("bcryptjs");
//const haversine = require("haversine-distance");

const Time = require("../../models/Time");

module.exports = {
  Query: {},

  Mutation: {
    async createTime(_, { dateId, times }) {
      var message = "";
      for (let i = 0; i < times.length; i++) {
        let cal = await Time.find({ dateId: dateId, time: times[i] });
        if (cal.length > 0) {
          return times[i] + " Already assigned!";
        } else {
          const newTime = new Time({
            dateId,
            time: times[i],
            status: "Valid",
            createdAt: new Date().toISOString(),
          });

          await newTime.save();
        }
      }

      return "Time assigned successfully!";
    },

    async deleteTime(_, { dateId }) {
      try {
        const time = await Time.find(dateId);
        await time.delete();

        return "Time removed successfully";
      } catch (err) {
        throw new Error(err);
      }
    },

    async getTimes(_, { dateId }) {
      try {
        const times = await Time.find({ dateId: dateId, status: "Valid" });
        return times;
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
  },
};
