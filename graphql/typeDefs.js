const { gql } = require("apollo-server-express");

module.exports = gql`
  type Applications {
    id: ID!
    userId: String!
    name: String!
    surname: String!
    email: String!
    phoneNumber: String!
    address: String!
    postalCode: String
    country: String!
    municipalAcc: String
    race: String
    houseHoldHead: Boolean
    maritalStatus: String
    dependents: Boolean
    status: String!
    idBook: String
    bankStatement: String
    affidavid: String
    createdAt: String!
  }

  input ApplicationInput {
    userId: String!
    name: String!
    surname: String!
    email: String!
    phoneNumber: String!
    address: String!
    postalCode: String
    municipalAcc: String
    race: String!
    country: String!
    houseHoldHead: Boolean
    maritalStatus: String
    dependents: Boolean
    idBook: String
    bankStatement: String
    affidavid: String
  }

  type User {
    id: ID!
    name: String!
    surname: String!
    email: String!
    phoneNumber: String!
    password: String!
    createdAt: String!
  }

  input RegisterInput {
    name: String!
    surname: String!
    email: String!
    phoneNumber: String!
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
    getApplications: [Applications]
    getUsers: [User]
    getCalendar: [Calendar]
  }
  type Mutation {
    createApplication(applicationInput: ApplicationInput): Applications!
    login(email: String!, password: String!): User!
    getUser(id: String!): User!
    createUser(registerInput: RegisterInput): User!
    createCalendar(date: String!): String!
    createTime(dateId: String!, times: [String!]): String!
    deleteDate(id: String!): String!
    deleteTime(id: String!): String!
    getTimes(dateId: String!): [Times]
    updateRequestStatus(id: String!, status: String!): String!
  }
`;
