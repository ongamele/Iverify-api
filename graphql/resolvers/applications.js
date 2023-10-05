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
    async getSuccessfulApplicationsCount(_, { userId }) {
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

    async getFailedApplicationsCount(_, { userId }) {
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
          status: "Approved",
        });
        return count;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getAllDeclinedCount() {
      try {
        const count = await Application.countDocuments({
          status: "Declined",
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
          status: "Approved",
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
          status: "Declined",
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
        const applications = await Application.find({
          status: "Approved",
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
        } = applicationInput;

        const app = await Application.findOne({ idNumber });

        if (app) {
          const errors = "User already applied!";
          return errors;
        }

        const apiUrl = "https://api.bakerstreetanalytics.co.za/api/mod/lookup";
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

        async function makeRequest() {
          const response = await axios.post(apiUrl, requestBody, { headers });
          return response.data;
        }

        const responseData = await makeRequest();
        let status = "Pending";
        let reason = "Inconclusive";
        console.log(JSON.stringify(responseData));
        if (
          parseInt(responseData.responseText[0][0].PropertyValuation) > 500000
        ) {
          status = "Declined";
          reason = "High Property Value";
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
            status: status,
            reason: reason,
            createdAt: new Date().toISOString(),
          });

          await newApplication.save();
          return `Your application was ${status}. ${reason}`;
        }

        if (parseInt(responseData.responseText[0][0].Income) > 6000) {
          status = "Declined";
          reason = "High Income";
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
            status: status,
            reason: reason,
            createdAt: new Date().toISOString(),
          });

          await newApplication.save();
          return `Your application was ${status}. ${reason}`;
        }

        if (responseData.responseText[0][0].DeceasedStatus == "True") {
          status = "Declined";
          reason = "Deceased";
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
            status: status,
            reason: reason,
            createdAt: new Date().toISOString(),
          });

          await newApplication.save();
          return `Your application was ${status}. ${reason}`;
        }

        if (responseData.responseText[0][0].DirectorshipStatus == "True") {
          status = "Declined";
          reason = "Company Ownership";
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
            status: status,
            reason: reason,
            createdAt: new Date().toISOString(),
          });

          await newApplication.save();
          var message = "";
          if (status == "Approved") {
            message =
              "Application approved. Kindly provide VDM with ID Copy, Affidavit and three months bank statement.";
          }
          if (status == "Declined") {
            message =
              "Application declined. Kindly visit the municipality to re-apply after three months.";
          }

          if (status == "Pending") {
            message =
              "	Pending	Application incomplete. Application referred for further investigation.";
          }
          return `${message}. Reason: ${reason}`;
        }

        if (
          sourceOfIncome == "Sassa" &&
          responseData.responseText[0][0].DeceasedStatus == "False"
        ) {
          status = "Approved";
          reason = "Sassa beneficiary";
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
            status: status,
            reason: reason,
            createdAt: new Date().toISOString(),
          });

          await newApplication.save();
          return `Your application was ${status}. ${reason}`;
        }

        if (
          parseInt(responseData.responseText[0][0].Income) < 6000 &&
          responseData.responseText[0][0].DeceasedStatus == "False"
        ) {
          status = "Approved";
          reason = "Low Income";
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
            status: status,
            reason: reason,
            createdAt: new Date().toISOString(),
          });

          await newApplication.save();
          return `Your application was ${status}. ${reason}`;
        }

        if (
          parseInt(responseData.responseText[0][0].Age) < 18 &&
          responseData.responseText[0][0].DeceasedStatus == "False"
        ) {
          status = "Approved";
          reason = "Child Headed Household";
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
            status: status,
            reason: reason,
            createdAt: new Date().toISOString(),
          });

          await newApplication.save();
          return `Your application was ${status}. ${reason}`;
        }

        if (
          parseInt(responseData.responseText[0][0].Age) < 60 &&
          responseData.responseText[0][0].DeceasedStatus == "False"
        ) {
          status = "Approved";
          reason = "Applicant is a pensioner";
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
            status: status,
            reason: reason,
            createdAt: new Date().toISOString(),
          });

          await newApplication.save();
          return `Your application was ${status}. ${reason}`;
        }

        return `Your application was ${status}. ${reason}`;
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
