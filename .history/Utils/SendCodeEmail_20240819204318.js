const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const transporter = nodemailer.createTransport({
  host: "https://ebda3acadmy.com",
  port: 465,
  secure: true,
  service: "gmail",
  auth: {
    user: process.env.STAMP_USER_NAME,
    pass: process.env.STAMP_PASS,
  },
});
async function sendCode(toEmail, randomCode, subject) {
  const mailOptions = {
    from: "ebda3acadmy.com",
    to: toEmail,
    subject: "رمز إعادة تعيين كلمة المرور الخاص بك غير صالح لمدة 10 دقائق",
    html: `<strong><h1>  مرحبًا ${toEmail}</h1> 
   لقد تلقينا طلبًا لإعادة تعيين كلمة المرور على حساب المنصة التعليمية ابداع اكاديمي الخاص بك. يرجى إدخال هذا الرمز ${randomCode} . شكرًا لك عزيزي</h6>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error sending email:", error);
    }
    console.log("Email sent: " + info.response);
  });
}
module.exports = sendCode;
