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

    async getSuccessfulApplications(_, { userId }) {
      try {
        const count = await Application.countDocuments({
          userId: userId,
          status: "Approved",
        });
        return count;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getFailedApplications(_, { userId }) {
      try {
        const count = await Application.countDocuments({
          userId: userId,
          status: "Declined",
        });
        return count;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getAllApplications(_, { userId }) {
      try {
        const count = await Application.countDocuments({
          userId: userId,
        });
        return count;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getLatestApplications(_, { userId }) {
      try {
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);

        const count = await Application.countDocuments({
          userId: userId,
          createdAt: { $gte: lastWeek },
        });

        return count;
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
          name,
          userId,
          surname,
          idNumber,
          email,
          gender,
          phoneNumber,
          country,
          race,
          address,
          postalCode,
          householdHead,
          maritalStatus,
          dependents,
          idBook,
          bankStatement,
          affidavid,
          companyName,
          companyPhoneNumber,
          companyEmail,
          income,
          sourceOfIncome,
          standType,
          suburb,
          wardNumber,
          municipality,
          companyRegNumber,
          companyType,
          applicantIdNumber,
          applicantName,
          applicantSurname,
          applicantPhoneNumber,
          applicantRelationship,
          spauseIdNumber,
          spauseName,
          spauseSurname,
          sassaNumber,
        },
      }
    ) {
      const newApplication = new Application({
        name,
        userId,
        surname,
        idNumber,
        email,
        gender,
        phoneNumber,
        country,
        race,
        address,
        postalCode,
        householdHead,
        maritalStatus,
        dependents,
        idBook,
        bankStatement,
        affidavid,
        companyName,
        companyPhoneNumber,
        companyEmail,
        income,
        sourceOfIncome,
        standType,
        suburb,
        wardNumber,
        municipality,
        companyRegNumber,
        companyType,
        applicantIdNumber,
        applicantName,
        applicantSurname,
        applicantPhoneNumber,
        applicantRelationship,
        spauseIdNumber,
        spauseName,
        spauseSurname,
        sassaNumber,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      const res = await newApplication.save();

      return { ...res._doc, id: res._id };
    },
  },
};
