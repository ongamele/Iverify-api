const bcrypt = require("bcryptjs");
//const haversine = require("haversine-distance");

const Application = require("../../models/Application");
const Time = require("../../models/Time");
const Calendar = require("../../models/Calendar");

module.exports = {
  Query: {
    async getApplications() {
      try {
        const applications = await Application.find().sort({
          createdAt: -1,
        });
        return applications;
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async createApplication(
      _,
      {
        applicationInput: {
          userId,
          name,
          surname,
          email,
          phoneNumber,
          address,
          postalCode,
          country,
          municipalAcc,
          race,
          houseHoldHead,
          maritalStatus,
          dependents,
          idBook,
          bankStatement,
          affidavid,
        },
      }
    ) {
      console.log("We get here");
      const newApplication = new Application({
        userId,
        name,
        surname,
        email,
        phoneNumber,
        address,
        postalCode,
        country,
        municipalAcc,
        race,
        houseHoldHead,
        maritalStatus,
        dependents,
        idBook,
        bankStatement,
        affidavid,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      const res = await newApplication.save();

      return { ...res._doc, id: res._id };
    },
  },
};
