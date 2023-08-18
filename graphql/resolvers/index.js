const applicationResolvers = require("./applications");
const userResolvers = require("./users");
const superUsererResolvers = require("./superusers");
const calendarResolvers = require("./calendar");
const timesResolvers = require("./times");

module.exports = {
  Query: {
    ...applicationResolvers.Query,
    ...userResolvers.Query,
    ...superUsererResolvers.Query,
    ...calendarResolvers.Query,
    ...timesResolvers.Query,
  },
  Mutation: {
    ...applicationResolvers.Mutation,
    ...userResolvers.Mutation,
    ...superUsererResolvers.Mutation,
    ...calendarResolvers.Mutation,
    ...timesResolvers.Mutation,
  },
};
