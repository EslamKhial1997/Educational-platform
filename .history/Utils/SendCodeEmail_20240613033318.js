const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  host: "smtp.example.com",
  port: 587,
  secure: false,
  service: "gmail", 
  auth: {
    user: process.env.STAMP_USER_NAME,
    pass: process.env.STAMP_PASS, 
  },
});
function sendCode(toEmail, randomCode) {
  console.log(`The Email is ${toEmail}`);

  const mailOptions = {
    from: "smtp.example.com",
    to: toEmail,
    subject: "Your Verification Code",
    html: `<strong>Hi ${toEmail}</strong><h5>We Recevid A Request To Rest Password On Your Educational Platform Account</h5> <h3> <strong> ${randomCode}</strong> jPlease Enter This Code</h3>  <h6>Thanks Dear</h6>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error sending email:", error);
    }
    console.log("Email sent: " + info.response);
  });
}
module.exports = sendCode;
