const applicationResolvers = require("./applications");
const userResolvers = require("./users");
const superUsererResolvers = require("./superusers");

module.exports = {
  Query: {
    ...applicationResolvers.Query,
    ...userResolvers.Query,
    ...superUsererResolvers.Query,
  },
  Mutation: {
    ...applicationResolvers.Mutation,
    ...userResolvers.Mutation,
    ...superUsererResolvers.Mutation,
  },
};
