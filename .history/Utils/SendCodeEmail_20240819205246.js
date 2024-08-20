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
    subject: 'إعادة تعيين كلمة المرور',
    html: `
      <img src="cid:unique@logo"/> <br/>
      <strong>
        <h3>مرحبًا ${toEmail}</h3>
      </strong>
      <span>لقد تلقينا طلبًا لإعادة تعيين كلمة المرور على حساب المنصة التعليمية ابداع اكاديمي الخاص بك.</span>
      <p>يرجى إدخال هذا الرمز:</p>
      <h2>${randomCode}</h2>
      <h6>شكرًا لك عزيزي</h6>
    `,
    attachments: [{
      filename: 'logo-Abda3.jpg',
      path: 'logo-Abda3.jpg',
      cid: 'unique@logo' // نفس الـcid المذكور في الـ src للصورة
    }]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error sending email:", error);
    }
    console.log("Email sent: " + info.response);
  });
}
module.exports = sendCode;
