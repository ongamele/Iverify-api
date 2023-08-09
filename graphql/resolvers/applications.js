const bcrypt = require("bcryptjs");
//const haversine = require("haversine-distance");

const Application = require("../../models/Application");
const Time = require("../../models/Time");
const Calendar = require("../../models/Calendar");

module.exports = {
  Query: {
    async getApplications(_, { userId }) {
      try {
        const applications = await Application.find({
          userId: userId,
        }).sort({
          createdAt: -1,
        });
        return applications;
      } catch (err) {
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
          gender,
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
          companyName,
          companyEmail,
          companyPhoneNumber,
          income,
          sourceOfIncome,
        },
      }
    ) {
      const newApplication = new Application({
        userId,
        name,
        surname,
        email,
        gender,
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
        companyName,
        companyEmail,
        companyPhoneNumber,
        income,
        sourceOfIncome,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      const res = await newApplication.save();

      return { ...res._doc, id: res._id };
    },
  },
};
