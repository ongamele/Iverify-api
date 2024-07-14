const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const User = require("../../models/User");
const { SECRETE_KEY } = require("../../config");
const sendMail = require("../../util/sendMail");

const sendSMS = async (phoneNumber, customMessage = null) => {
  let formattedPhoneNumber = phoneNumber.substring(1);

  try {
    const apiKey =
      "2319f2b218dfee20edf691f73ccba12f-73d582c6-316c-4b53-a90c-1c0c1fa1c94f";

    // Use custom message if provided, otherwise use the default message
    const message =
      customMessage ||
      `Mohokare: Hello, Your statement is available. You can access it here https://mohokarestatements.co.za/`;

    const response = await axios.post(
      "https://api.infobip.com/sms/1/text/single",
      {
        from: "27872406515",
        to: "27" + formattedPhoneNumber,
        text: message,
      },
      {
        headers: {
          Authorization: `App ${apiKey}`,
        },
      }
    );

    console.log("SMS STATUS ----------------> ", response.status);

    return "Statements uploaded successfully!";
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};

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
        const wrongError = "Wrong credentials";
        console.log(wrongError);
        return wrongError;
      }
      const token = generateToken(user);
      return { ...user._doc, id: user._id, token };
    },

    async forgotPassword(_, { email }) {
      const usr = await User.findOne({ email });
      console.log(usr.email);
      if (!usr) {
        return "User was not found.";
      }

      let token = Math.floor(100000 + Math.random() * 900000);

      const url = `https://iverify-user.netlify.app/forgot-password/${usr._id}/reset/${token}`;

      sendMail(usr.email, "Reset Password", url);

      return "Please check your email and reset password!";
    },
    async updatePassword(_, { id, password }) {
      try {
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.findByIdAndUpdate(
          id,
          { password: hashedPassword },
          { new: true } // To return the updated user
        );

        if (!user) {
          throw new Error("User not found");
        }

        return "Password changed successfully";
      } catch (err) {
        throw new Error(err.message);
      }
    },
    async createUser(
      _,
      {
        registerInput: {
          name,
          surname,
          phoneNumber,
          email,
          idNumber,
          municipality,
          password,
        },
      }
    ) {
      const passToSend = password;
      password = await bcrypt.hash(password, 12);

      let phoneNumberStr = String(phoneNumber);
      if (!phoneNumberStr.startsWith("0")) {
        phoneNumberStr = "0" + phoneNumberStr;
      }

      const newUser = new User({
        name,
        surname,
        phoneNumber: phoneNumberStr,
        email,
        idNumber,
        password,
        municipality,
        status: "Active",
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      let smsNote = `Iverify. Your username is ${email} & password is ${passToSend}`;
      sendSMS(phoneNumberStr, smsNote);
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
