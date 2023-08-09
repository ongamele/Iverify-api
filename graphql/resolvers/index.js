const applicationResolvers = require("./applications");
const userResolvers = require("./users");
const calendarResolvers = require("./calendar");
const timesResolvers = require("./times");

module.exports = {
  Query: {
    ...applicationResolvers.Query,
    ...userResolvers.Query,
    ...calendarResolvers.Query,
    ...timesResolvers.Query,
  },
  Mutation: {
    ...applicationResolvers.Mutation,
    ...userResolvers.Mutation,
    ...calendarResolvers.Mutation,
    ...timesResolvers.Mutation,
  },
};
