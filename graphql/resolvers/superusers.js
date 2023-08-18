const bcrypt = require("bcryptjs");

module.exports = {
  Query: {},

  Mutation: {
    async loginSuperuser(_, { email, password }) {
      try {
        if (email !== "admin@iverify.co.za") {
          const errors = "User not found";
          console.log("This email is not found: " + email);
          return errors;
        }

        if (password !== "adminiverify455") {
          const wrongError = "Wrong credentials";

          return wrongError;
        }
        return "Success";
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
