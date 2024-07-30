const bcrypt = require("bcryptjs");
//const haversine = require("haversine-distance");

const Application = require("../../models/Application");
const axios = require("axios");

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

    async getAllApprovedApplications(_, { userId }) {
      try {
        const applications = await Application.find({
          userId: userId,
          status: "Approved",
        }).sort({
          createdAt: -1,
        });
        return applications;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getAllDeclinedApplications(_, { userId }) {
      try {
        const applications = await Application.find({
          userId: userId,
          status: "Declined",
        }).sort({
          createdAt: -1,
        });
        return applications;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getApplicationsSuperuser() {
      try {
        const applications = await Application.find().sort({
          createdAt: -1,
        });
        return applications;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getAllApprovedApplicationsSuperuser() {
      try {
        const applications = await Application.find({
          status: "Passed - Indigent Application Successful",
        }).sort({
          createdAt: -1,
        });
        return applications;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getAllDeclinedApplicationsSuperuser() {
      try {
        const applications = await Application.find({
          status: "Failed - Indigent Application Unsuccessful",
        }).sort({
          createdAt: -1,
        });
        return applications;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getSuccessfulApplicationsCount(_, { userId }) {
      try {
        const count = await Application.countDocuments({
          userId: userId,
          status: "Passed - Indigent Application Successful",
        });
        return count;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getFailedApplicationsCount(_, { userId }) {
      try {
        const count = await Application.countDocuments({
          userId: userId,
          status: "Failed - Indigent Application Unsuccessful",
        });
        return count;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getAllApplicationsCount(_, { userId }) {
      try {
        const count = await Application.countDocuments({
          userId: userId,
        });
        return count;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getLatestApplicationsCount(_, { userId }) {
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

    async getAllUserApplicationsCount() {
      try {
        const applications = await Application.countDocuments();
        return applications;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getAllApprovedCount() {
      try {
        const count = await Application.countDocuments({
          status: "Passed - Indigent Application Successful",
        });
        return count;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getAllDeclinedCount() {
      try {
        const count = await Application.countDocuments({
          status: "Failed - Indigent Application Unsuccessful",
        });
        return count;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getApprovedMunicipalityApplicationsCount(_, { municipality }) {
      try {
        const count = await Application.countDocuments({
          municipality: municipality,
          status: "Passed - Indigent Application Successful",
        });

        return count;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getDeclinedMunicipalityApplicationsCount(_, { municipality }) {
      try {
        const count = await Application.countDocuments({
          municipality: municipality,
          status: "Failed - Indigent Application Unsuccessful",
        });

        return count;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPendingMunicipalityApplicationsCount(_, { municipality }) {
      try {
        const count = await Application.countDocuments({
          municipality: municipality,
          status: "Pending",
        });

        return count;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getTotalMunicipalityApplicationsCount(_, { municipality }) {
      try {
        const count = await Application.countDocuments({
          municipality: municipality,
        });

        return count;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getAllMunicipalityApplications(_, { municipality }) {
      try {
        const applications = await Application.find({
          municipality: municipality,
        }).sort({
          createdAt: -1,
        });
        return applications;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getAllExcelApplications() {
      try {
        const applications = await Application.find().sort({
          createdAt: -1,
        });
        return applications;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getActiveIndigents() {
      try {
        const applications = await Application.find().sort({
          createdAt: -1,
        });
        return applications;
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async createApplication(_, { applicationInput }) {
      try {
        const {
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
          municipalAccountNumber,
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
          status,
          applicationDate,
          deceased,
        } = applicationInput;
        console.log(applicationDate);

        const app = await Application.findOne({ idNumber });

        if (app) {
          return "User already applied!";
        }

        let finalStatus = status || "Pending";
        let reason = "Inconclusive";

        if (status === "") {
          const apiUrl =
            "https://api.bakerstreetanalytics.co.za/api/mod/lookup";
          const accountKey =
            "Um9maGl3YSBNdWRhdTIwMjMtMDgtMzAgMTI6NDc6NTZyb2ZoaXdhQHppbWFrby5jby56YQ==";
          const requestBody = [
            {
              idn: idNumber,
              firstname: name,
              surname: surname,
              mobile: phoneNumber,
              email: email,
            },
          ];

          const headers = {
            "Content-Type": "application/json",
            accountKey: accountKey,
          };

          const responseData = (
            await axios.post(apiUrl, requestBody, { headers })
          ).data;
          console.log(JSON.stringify(responseData));

          if (
            parseInt(responseData.responseText[0][0].PropertyValuation) > 500000
          ) {
            finalStatus = "Declined";
            reason = "High Property Value";
          } else if (parseInt(responseData.responseText[0][0].Income) > 6000) {
            finalStatus = "Declined";
            reason = "High Income";
          } else if (
            responseData.responseText[0][0].DeceasedStatus === "True"
          ) {
            finalStatus = "Declined";
            reason = "Deceased";
          } else if (
            responseData.responseText[0][0].DirectorshipStatus === "True"
          ) {
            finalStatus = "Declined";
            reason = "Company Ownership";
          } else if (
            sourceOfIncome === "Sassa" &&
            responseData.responseText[0][0].DeceasedStatus === "False"
          ) {
            finalStatus = "Approved";
            reason = "Sassa beneficiary";
          } else if (
            parseInt(responseData.responseText[0][0].Income) < 6000 &&
            responseData.responseText[0][0].DeceasedStatus === "False"
          ) {
            finalStatus = "Approved";
            reason = "Low Income";
          } else if (
            parseInt(responseData.responseText[0][0].Age) < 18 &&
            responseData.responseText[0][0].DeceasedStatus === "False"
          ) {
            finalStatus = "Approved";
            reason = "Child Headed Household";
          } else if (
            parseInt(responseData.responseText[0][0].Age) >= 60 &&
            responseData.responseText[0][0].DeceasedStatus === "False"
          ) {
            finalStatus = "Approved";
            reason = "Applicant is a pensioner";
          }
        }

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
          municipalAccountNumber,
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
          status: finalStatus, // Ensures status is only set once
          reason,
          deceased,
          applicationDate,
          createdAt: new Date().toISOString(),
        });

        await newApplication.save();
        return `Your application was ${finalStatus}. ${reason}`;
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },
    async getSelectedApplication(_, { id }) {
      try {
        const application = await Application.findById(id);
        return application;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
