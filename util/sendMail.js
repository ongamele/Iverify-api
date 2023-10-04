const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
module.exports = async (email, subject, text) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "ogebhuza@gmail.com", // generated ethereal user
        pass: "xclz dnid xrtb wwvb", // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // send mail with defined transport object
    await transporter.sendMail({
      from: '"IVERIFY 👻" ogebhuza@gmail.com', // sender address
      to: email,
      subject: subject, // Subject line
      text: text, // plain text body
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email not sent");
    console.log(error);
  }
};
