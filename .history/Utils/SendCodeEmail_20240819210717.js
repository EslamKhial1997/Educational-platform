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
    from: process.env.EMAIL_USER,
    to: toEmail, // عنوان البريد الإلكتروني للمتلقي
    subject: "إعادة تعيين كلمة المرور",
    html: `
      <strong>
        <h3>مرحبًا ${toEmail}</h3>
      </strong>
      <span>${subject}</span>
      <p>يرجى إدخال هذا الرمز:</p>
      <h2>${randomCode}</h2>
      <h5>الرم</h5>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error sending email:", error);
    }
    console.log("Email sent: " + info.response);
  });
}
module.exports = sendCode;
