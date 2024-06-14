const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const ApiError = require("../Resuble/ApiErrors");
const expressAsyncHandler = require("express-async-handler");
dotenv.config({ path: "config.env" });
const transporter = nodemailer.createTransport({
  host: "smtp.example.com",
  port: 587,
  secure: false,
  service: "gmail",
  auth: {
    user: process.env.STAMP_USER_NAME,
    pass: process.env,
  },
});
async function sendCode(toEmail, randomCode) {
  const mailOptions = {
    from: "Educational_Platform@gmail.com",
    to: toEmail,
    subject: "Your Verification Code",
    html: `<strong>Hi ${toEmail}</strong><h5>We Recevid A Request To Rest Password On Your Educational Platform Account</h5> <h3> <strong> ${randomCode}</strong> Please Enter This Code</h3>  <h6>Thanks Dear</h6>`,
  };

  transporter.sendMail(mailOptions, expressAsyncHandler((req , res , next)=>{
    res
    .json({ status: "success", massage: "Rest Code Sent successfully" })
  }) 
  
)}
module.exports = sendCode;
