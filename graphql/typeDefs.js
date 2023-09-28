const { gql } = require("apollo-server-express");

module.exports = gql`
  type Applications {
    id: ID!
    userId: String!
    name: String!
    surname: String!
    email: String!
    gender: String!
    phoneNumber: Int
    address: String!
    postalCode: String
    municipality: String
    idNumber: String!
    country: String!
    race: String
    houseHoldHead: Boolean
    maritalStatus: String
    dependents: Boolean
    status: String!
    idBook: String
    bankStatement: String
    affidavid: String
    companyName: String
    companyEmail: String
    companyPhoneNumber: Int
    income: Int
    sourceOfIncome: String
    standType: String
    suburb: String
    wardNumber: String
    companyRegNumber: String
    companyType: String
    applicantIdNumber: String
    applicantName: String
    applicantSurname: String
    applicantPhoneNumber: Int
    applicantRelationship: String
    spauseIdNumber: String
    spauseName: String
    spauseSurname: String
    sassaNumber: String
    ageRange: String
    reason: String
    createdAt: String!
  }

  input ApplicationInput {
    userId: String!
    name: String!
    surname: String!
    email: String!
    gender: String!
    phoneNumber: Int!
    address: String!
    postalCode: String
    municipality: String
    idNumber: String!
    race: String!
    country: String!
    houseHoldHead: Boolean
    maritalStatus: String
    dependents: Boolean
    idBook: String
    bankStatement: String
    affidavid: String
    companyName: String
    companyEmail: String
    companyPhoneNumber: Int
    income: Int
    sourceOfIncome: String
    standType: String
    suburb: String
    wardNumber: String
    companyRegNumber: String
    companyType: String
    applicantIdNumber: String
    applicantName: String
    applicantSurname: String
    applicantPhoneNumber: Int
    applicantRelationship: String
    spauseIdNumber: String
    spauseName: String
    spauseSurname: String
    sassaNumber: String
    ageRange: String
  }

  type User {
    id: ID!
    name: String!
    surname: String!
    email: String!
    phoneNumber: Int!
    idNumber: String!
    password: String!
    municipality: String!
    token: String!
    status: String!
    createdAt: String!
  }

  input RegisterInput {
    name: String!
    surname: String!
    email: String!
    phoneNumber: Int!
    idNumber: String!
    municipality: String!
    password: String!
  }

  type Calendar {
    id: ID!
    date: String!
    createdAt: String!
  }

  type Times {
    id: ID!
    dateId: String!
    status: String!
    time: String!

    createdAt: String!
  }

  type Query {
    getApplications(userId: String!): [Applications]
    getSuccessfulApplications(userId: String!): Int!
    getFailedApplications(userId: String!): Int!
    getAllApplications(userId: String!): Int!
    getLatestApplications(userId: String!): Int!
    getAllUserApplications: Int!
    getUsers: [User]
    getAllApproved: Int!
    getAllDeclined: Int!
  }
  type Mutation {
    createApplication(applicationInput: ApplicationInput): String!
    login(email: String!, password: String!): User!
    loginSuperuser(email: String!, password: String!): String!
    getUser(id: String!): User!
    createUser(registerInput: RegisterInput): User!
    updateRequestStatus(id: String!, status: String!): String!
    getSelectedApplication(id: String!): Applications!
  }
`;
