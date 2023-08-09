const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const { SECRETE_KEY } = require("../../config");

function generateToken(user) {
  return jwt.sign(
    {
      name: user.name,
      surname: user.surname,
      email: user.email,
      password: user.password,
      phoneNumber: user.phoneNumber,
      idNumber: user.idNumber,
    },
    SECRETE_KEY,
    { expiresIn: "2h" }
  );
}

module.exports = {
  Query: {
    async getUsers() {
      try {
        const users = await User.find().sort({ createdAt: -1 });
        return users;
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async login(_, { email, password }) {
      const user = await User.findOne({ email });

      if (!user) {
        const errors = "User not found";
        console.log(errors);
        return errors;
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        const wrondError = "Wrong credentials";
        console.log(wrongError);
        return wrongError;
      }
      const token = generateToken(user);
      return { ...user._doc, id: user._id, token };
    },
    async createUser(
      _,
      { registerInput: { name, surname, phoneNumber, email, idNumber } }
    ) {
      //TODO Validate user data }

      function generateRandomString(length) {
        const characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let randomString = "";

        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          randomString += characters.charAt(randomIndex);
        }

        return randomString;
      }

      var password = generateRandomString(6);
      console.log(password);
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        name,
        surname,
        phoneNumber,
        email,
        idNumber,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();
      const token = generateToken(res);

      return { ...res._doc, id: res._id, token };
    },
    async getUser(_, { id }) {
      try {
        const user = await User.findById(id);
        return user;
      } catch (err) {
        throw new Error(err);
      }
    },

    /*async deleteUser(_, { id }) {
      try {
        const user = await User.findById(id);

        await user.delete();
        return 'User deleted successfully';
      } catch (err) {
        throw new Error(err);
      }
    },*/
  },
};
